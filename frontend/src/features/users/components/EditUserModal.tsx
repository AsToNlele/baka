import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useEditUserDetail } from "@/features/users/hooks/useEditUserDetail"
import { EditUserDetailSchema, EditUserDetailType } from "@/features/users/types"
import { useUserDetail } from "@/features/users/hooks/useUserDetail"
import { useParams } from "react-router-dom"

type EditUserModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void }

export const EditUserModal= ({
    isOpen,
    onOpenChange,
    onClose,
}: EditUserModalProps) => {
    const { id } = useParams()

    const userId = id ? parseInt(id) : null
    const { data } = useUserDetail(userId)
    const editUser = useEditUserDetail()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditUserDetailType>({
        resolver: zodResolver(EditUserDetailSchema),
        defaultValues: {
            username: data?.username,
            email: data?.email,
            first_name: data?.first_name,
            last_name: data?.last_name,
        }
    })

    const onSubmit: SubmitHandler<EditUserDetailType> = (
        data,
    ) => {
        editUser.mutate({id: userId!, data})
    }

    const submit = () => {
        handleSubmit(onSubmit)()
    }

    useEffect(() => {
        if (editUser.isSuccess) {
            onClose()
        }
    }, [editUser.isSuccess, onClose])

    useEffect(() => {
        reset()
    }, [onOpenChange, reset])

    console.log({ errors })

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            scrollBehavior="inside"
            size="5xl"
        >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Edit a User
                    </ModalHeader>
                    <ModalBody>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                submit()
                            }}
                        >
                            <div className="flex flex-col">
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="Username"
                                        placeholder="Username"
                                        {...register("username", {
                                            required: true,
                                        })}
                                        errorMessage={errors.username?.message}
                                        defaultValue={data?.username ?? ""}
                                    />
                                    <Input
                                        label="Email"
                                        placeholder="Email"
                                        {...register("email", {
                                            required: true,
                                        })}
                                        errorMessage={errors.email?.message}
                                        defaultValue={data?.email ?? ""}
                                    />
                                    <Input
                                        label="First Name"
                                        placeholder="First Name"
                                        {...register("first_name", {
                                            required: true,
                                        })}
                                        errorMessage={errors.first_name?.message}
                                        defaultValue={data?.first_name ?? ""}
                                    />
                                    <Input
                                        label="Last Name"
                                        placeholder="Last Name"
                                        {...register("last_name", {
                                            required: true,
                                        })}
                                        errorMessage={errors.last_name?.message}
                                        defaultValue={data?.last_name ?? ""}
                                    />
                                    <Input
                                        type="submit"
                                        value="Submit"
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>
                        <Button
                            color="primary"
                            onPress={submit}
                            isDisabled={editUser.isPending}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}
