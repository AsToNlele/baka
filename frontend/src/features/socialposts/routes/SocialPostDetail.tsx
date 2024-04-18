import { SmallLoading } from "@/components/Loading"
import { PageTitle } from "@/features/app/components/PageTitle"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { EditSocialPostModal } from "@/features/socialposts/components/EditSocialPostModal"
import { useDeleteSocialPost } from "@/features/socialposts/hooks/useDeleteSocialPost"
import { useSocialPostDetail } from "@/features/socialposts/hooks/useSocialPostDetail"
import { useIsAdmin } from "@/hooks/isAdmin"
import { parseIsoAndFormatDateTime } from "@/utils/utils"
import { Button, Chip, useDisclosure } from "@nextui-org/react"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { InstagramEmbed } from "react-social-media-embed"

export const SocialPostDetail = () => {
    const { id } = useParams()
    const socialPostId = id ? parseInt(id) : null
    const { data, isLoading } = useSocialPostDetail(socialPostId)
    const { mutate: deletePost } = useDeleteSocialPost()

    const isAdmin = useIsAdmin()
    const profile = useProfile()
    const isAuthor = data?.author.user === profile?.data?.username

    const canDelete = isAdmin || isAuthor
    const canEdit = isAdmin
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    const edit = () => {
        onOpen()
    }

    const navigate = useNavigate()

    const trash = (socialPostId: number) => {
        deletePost(socialPostId, {
            onSuccess: () => {
                navigate("/app/socialposts")
            },
        })
    }

    return (
        <div>
            <div className="flex gap-4">
                <PageTitle title="Post" />
                {data && (
                    <>
                        {canEdit && (
                            <>
                                <Button
                                    color="secondary"
                                    isIconOnly
                                    onClick={edit}
                                >
                                    <FaEdit />
                                </Button>
                                <EditSocialPostModal
                                    isOpen={isOpen}
                                    onOpenChange={onOpenChange}
                                    onClose={onClose}
                                    socialPost={data}
                                />
                            </>
                        )}
                        {canDelete && (
                            <Button
                                color="danger"
                                isIconOnly
                                onClick={() => trash(socialPostId!)}
                            >
                                <FaTrash />
                            </Button>
                        )}
                    </>
                )}
            </div>
            {!data || (isLoading && <SmallLoading />)}
            {data && (
                <div className="flex flex-col gap-2">
                    <h1 className="break-all">{data?.url}</h1>
                    <p>Author: {data?.author?.user}</p>
                    <Chip
                        className="mb-2"
                        color={data?.approved ? "primary" : "default"}
                    >
                        {data?.approved ? "Approved" : "Waiting for Approval"}
                    </Chip>
                    <p>
                        Created{" "}
                        {parseIsoAndFormatDateTime(data?.created_at ?? "")}
                    </p>
                    <InstagramEmbed url={data.url} />
                </div>
            )}
        </div>
    )
}
