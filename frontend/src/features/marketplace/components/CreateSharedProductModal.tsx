import { useCreateSharedProduct } from "@/features/marketplace/hooks/useCreateSharedProduct"
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
import { CreateSharedProductSchema, CreateSharedProductValidationType } from "@/features/marketplace/types"

type CreateSharedProductModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void }

export const CreateSharedProductModal = ({
    isOpen,
    onOpenChange,
    onClose,
}: CreateSharedProductModalProps) => {
    const createSharedProduct = useCreateSharedProduct()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateSharedProductValidationType>({
        resolver: zodResolver(CreateSharedProductSchema),
    })

    const onSubmit: SubmitHandler<CreateSharedProductValidationType> = (
        data,
    ) => {
        createSharedProduct.mutate({ data: data })
    }

    const submit = () => {
        handleSubmit(onSubmit)()
    }

    useEffect(() => {
        if (createSharedProduct.isSuccess) {
            onClose()
        }
    }, [createSharedProduct.isSuccess, onClose])

    useEffect(() => {
        reset()
    }, [onOpenChange, reset])

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
                        Create a Shared product
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
                                        label="Name"
                                        placeholder="Name of the product"
                                        {...register("name", {
                                            required: true,
                                        })}
                                        errorMessage={errors.name?.message}
                                    />
                                    <Input
                                        label="Description"
                                        placeholder="Description of the product"
                                        {...register("description", {
                                            required: true,
                                        })}
                                        errorMessage={
                                            errors.description?.message
                                        }
                                    />
                                    <Input
                                        label="Image"
                                        placeholder=""
                                        {...register("image", {
                                            required: false,
                                        })}
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
                            isDisabled={createSharedProduct.isPending}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}
