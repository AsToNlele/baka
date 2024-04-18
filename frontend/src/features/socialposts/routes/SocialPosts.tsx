import { PageTitle } from "@/features/app/components/PageTitle"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { EditSocialPostModal } from "@/features/socialposts/components/EditSocialPostModal"
import { useChangeStatusSocialPost } from "@/features/socialposts/hooks/useChangeStatusSocialPost"
import { useCreateSocialPost } from "@/features/socialposts/hooks/useCreateSocialPost"
import { useDeleteSocialPost } from "@/features/socialposts/hooks/useDeleteSocialPost"
import { useMySocialPostList } from "@/features/socialposts/hooks/useMySocialPostList"
import { useAllSocialPostList } from "@/features/socialposts/hooks/useAllSocialPostList"
import {
    CreateSocialPostSchema,
    CreateSocialPostValidation,
} from "@/features/socialposts/types"
import { useIsAdmin } from "@/hooks/isAdmin"
import { SocialPostAppType } from "@/utils/types"
import { parseIsoAndFormatDateTime } from "@/utils/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Tabs,
    Tab,
    Input,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Button,
    Switch,
    useDisclosure,
    Chip,
    Link,
} from "@nextui-org/react"
import { Key, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { FaEdit, FaTrash } from "react-icons/fa"
import { toast } from "sonner"

export const SocialPosts = () => {
    const [selected, setSelected] = useState("send")
    const isAdmin = useIsAdmin()

    const handleSelectionChange = (key: Key) => {
        setSelected(key.toString())
    }

    return (
        <div>
            <PageTitle title="Share your moment" />
            <Tabs
                selectedKey={selected}
                onSelectionChange={handleSelectionChange}
            >
                <Tab title="Send" key="send">
                    <CreateSocialPost setTab={handleSelectionChange} />
                </Tab>
                <Tab title="My posts" key="my-posts">
                    <MySocialPostList />
                </Tab>
                {isAdmin && (
                    <Tab title="All posts" key="all-posts">
                        <AllSocialPostList />
                    </Tab>
                )}
            </Tabs>
        </div>
    )
}

const AllSocialPostList = () => {
    const [selected, setSelected] = useState<SocialPostAppType | null>(null)
    const { data } = useAllSocialPostList()
    const { mutate } = useChangeStatusSocialPost()
    const { mutate: deletePost } = useDeleteSocialPost()
    const handleSocialPostEdit = (post: SocialPostAppType) => {
        onOpen()
        setSelected(post)
    }
    const handleSocialPostStatusChange = (
        post: SocialPostAppType,
        checked: boolean,
    ) => {
        mutate({
            id: post.id!,
            data: { approved: checked },
        })
    }
    const handleSocialPostTrash = (post: SocialPostAppType) => {
        deletePost(post.id!)
    }

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    return (
        <div>
            {data?.length === 0 && <p>No posts</p>}
            <div className="flex flex-col gap-4">
                {data?.map((post) => (
                    <SocialPost
                        key={post.id}
                        post={post}
                        edit={handleSocialPostEdit}
                        statusChange={handleSocialPostStatusChange}
                        trash={handleSocialPostTrash}
                    />
                ))}
            </div>
            <EditSocialPostModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                socialPost={selected}
            />
        </div>
    )
}

const MySocialPostList = () => {
    const [selected, setSelected] = useState<SocialPostAppType | null>(null)
    const { data } = useMySocialPostList()
    const { mutate } = useChangeStatusSocialPost()
    const { mutate: deletePost } = useDeleteSocialPost()
    const handleSocialPostEdit = (post: SocialPostAppType) => {
        onOpen()
        setSelected(post)
    }
    const handleSocialPostStatusChange = (
        post: SocialPostAppType,
        checked: boolean,
    ) => {
        mutate({
            id: post.id!,
            data: { approved: checked },
        })
    }
    const handleSocialPostTrash = (post: SocialPostAppType) => {
        deletePost(post.id!)
    }

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    return (
        <div>
            {data?.length === 0 && <p>No posts</p>}
            <div className="flex flex-col gap-4">
                {data?.map((post) => (
                    <SocialPost
                        key={post.id}
                        post={post}
                        edit={handleSocialPostEdit}
                        statusChange={handleSocialPostStatusChange}
                        trash={handleSocialPostTrash}
                    />
                ))}
            </div>
            <EditSocialPostModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                socialPost={selected}
            />
        </div>
    )
}

type SocialPostProps = {
    post: SocialPostAppType
    edit: (item: SocialPostAppType) => void
    statusChange: (item: SocialPostAppType, checked: boolean) => void
    trash: (item: SocialPostAppType) => void
}

const SocialPost = ({ post, edit, statusChange, trash }: SocialPostProps) => {
    const isAdmin = useIsAdmin()
    const profile = useProfile()
    const isAuthor = post?.author?.user === profile?.data?.username

    const canDelete = isAdmin || isAuthor
    const canEdit = isAdmin
    console.log(canDelete, canEdit)

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col flex-wrap items-start gap-4">
                    <p className="break-all">
                        {post.url}
                    </p>
                    {canDelete && <p>Author: {post.author?.user}</p>}
                    <Button
                        as={Link}
                        href={`/app/socialposts/${post.id}`}
                        color="secondary"
                    >
                        Detail
                    </Button>
                    <Button
                        href={post.url}
                        as={Link}
                        color="warning"
                        showAnchorIcon
                        variant="solid"
                        target="_blank"
                    >
                        Open in IG
                    </Button>
                </div>
            </CardHeader>
            <CardBody>
                <div className="flex gap-4">
                    <Chip
                        className="mb-2"
                        color={post.approved ? "primary" : "default"}
                    >
                        {post.approved ? "Approved" : "Waiting for Approval"}
                    </Chip>
                    <p>
                        Created{" "}
                        {parseIsoAndFormatDateTime(post.created_at ?? "")}
                    </p>
                </div>
            </CardBody>
            <CardFooter>
                <div className="flex flex-wrap gap-8">
                    {canEdit && (
                        <Button
                            color="secondary"
                            isIconOnly
                            onClick={() => edit(post)}
                        >
                            <FaEdit />
                        </Button>
                    )}
                    {canEdit && (
                        <Switch
                            isSelected={post.approved}
                            onValueChange={(e) => statusChange(post, e)}
                        >
                            Approved
                        </Switch>
                    )}
                    {canDelete && (
                        <Button
                            color="danger"
                            isIconOnly
                            onClick={() => trash(post)}
                        >
                            <FaTrash />
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}

const CreateSocialPost = ({ setTab }: { setTab: (key: string) => void }) => {
    const { mutate } = useCreateSocialPost()

    const { register, handleSubmit, reset, formState, getValues } =
        useForm<CreateSocialPostValidation>({
            resolver: zodResolver(CreateSocialPostSchema),
        })

    const onSubmit: SubmitHandler<CreateSocialPostValidation> = (data) => {
        console.log("MUTATING")
        mutate(data, {
            onSuccess: (res) => {
                console.log(res)
                toast.success("Post sent for approval")
                reset()
                setTab("my-posts")
            },
        })
    }

    console.log(formState.errors)
    console.log(getValues())

    const submit = () => {
        handleSubmit(onSubmit)()
    }

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    submit()
                }}
                className="flex flex-col gap-4"
            >
                <Input
                    type="text"
                    label="Url"
                    {...register("url")}
                    errorMessage={formState?.errors?.url?.message}
                />
                <Input
                    variant="flat"
                    color="secondary"
                    type="submit"
                    value="Submit"
                />
            </form>
        </div>
    )
}
