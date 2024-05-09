import { SocialPostAppType } from "@/utils/types"
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent,
    Input,
    Switch,
} from "@nextui-org/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import {
    EditSocialPostSchema,
    EditSocialPostValidation,
} from "@/features/socialposts/types"
import { useEditSocialPost } from "@/features/socialposts/hooks/useEditSocialPost"
import { InstagramEmbed } from "react-social-media-embed"
import { useEffect } from "react"

type EditSocialPostModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    socialPost: SocialPostAppType | null
}

export const EditSocialPostModal = ({
    isOpen,
    onOpenChange,
    onClose,
    socialPost = null,
}: EditSocialPostModalProps) => {
    const { mutate } = useEditSocialPost()

    const { control, handleSubmit, formState, reset } =
        useForm<EditSocialPostValidation>({
            resolver: zodResolver(EditSocialPostSchema),
            defaultValues: {},
        })

    useEffect(() => {
        reset({
            approved: socialPost?.approved ?? false,
            url: socialPost?.url ?? "",
        })
    }, [onOpenChange, reset, socialPost])

    const submit = () => { 
        handleSubmit(onSubmit)()
    }

    const onSubmit: SubmitHandler<EditSocialPostValidation> = (data) => {
        mutate(
            { id: socialPost?.id ?? 0, data },
            {
                onSuccess: () => {
                    onClose()
                },
            },
        )
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            scrollBehavior="inside"
            size="5xl"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Edit</ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                        >
                            <Controller
                                name="approved"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Switch
                                            isSelected={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            Approved
                                        </Switch>
                                    </>
                                )}
                            />
                            <Controller
                                name="url"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-4">
                                        <Input
                                            label="Url"
                                            value={field?.value}
                                            onChange={field.onChange}
                                            errorMessage={
                                                formState.errors?.url?.message
                                            }
                                        />
                                        {field?.value?.startsWith(
                                            "https://instagram.com",
                                        ) ||
                                            (field?.value?.startsWith(
                                                "https://www.instagram.com",
                                            ) && (
                                                    <InstagramEmbed
                                                        key={field.value ?? "key"}
                                                        url={field.value ?? ""}
                                                    />
                                                ))}
                                    </div>
                                )}
                            />
                        </form>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onPress={submit}
                    >
                        Save
                    </Button>
                    <Button color="secondary" onPress={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
