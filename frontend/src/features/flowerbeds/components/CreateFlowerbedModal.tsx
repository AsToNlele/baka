// Author: Alexandr Celakovsky - xcelak00
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent,
    Input,
    Checkbox,
} from "@nextui-org/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import {
    CreateFlowerbedSchema,
    CreateFlowerbedValidationType,
} from "@/features/flowerbeds/types"
import { useCreateFlowerbed } from "@/features/flowerbeds/hooks/useCreateFlowerbed"
import { toast } from "sonner"
import { useEffect } from "react"

type CreateFlowerbedModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    greenhouseId: number | string | undefined
}

export const CreateFlowerbedModal = ({
    isOpen,
    onOpenChange,
    onClose,
    greenhouseId,
}: CreateFlowerbedModalProps) => {
    const { register, handleSubmit, formState, control, reset } =
        useForm<CreateFlowerbedValidationType>({
            resolver: zodResolver(CreateFlowerbedSchema),
        })

    const submit = () => {
        handleSubmit(onSubmit)()
    }

    const { mutate } = useCreateFlowerbed()

    const onSubmit: SubmitHandler<CreateFlowerbedValidationType> = (data) => {
        mutate(
            { data },
            {
                onSuccess: () => {
                    onClose()
                    toast.success("Flowerbed created successfully")
                },
            },
        )
    }

    useEffect(() => {
        reset()
    }, [onOpenChange])

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            scrollBehavior="inside"
            size="5xl"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Create a new flowerbed
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="Name"
                                    {...register("name")}
                                    errorMessage={
                                        formState.errors.name?.message
                                    }
                                />
                                <Input
                                    type="number"
                                    label="Price per day"
                                    {...register("pricePerDay")}
                                    errorMessage={
                                        formState.errors.pricePerDay?.message
                                    }
                                />
                                <Input
                                    className="hidden"
                                    hidden
                                    aria-hidden
                                    label="Greenhouse"
                                    {...register("greenhouse")}
                                    defaultValue={greenhouseId?.toString()}
                                />
                                <Controller
                                    name="disabled"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            isSelected={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            Private
                                        </Checkbox>
                                    )}
                                />
                                <Input
                                    type="number"
                                    label="Width"
                                    {...register("dimension_width")}
                                    errorMessage={
                                        formState.errors.dimension_width
                                            ?.message
                                    }
                                />
                                <Input
                                    type="number"
                                    label="Height"
                                    {...register("dimension_height")}
                                    errorMessage={
                                        formState.errors.dimension_height
                                            ?.message
                                    }
                                />
                                <Input
                                    label="Ideal plants"
                                    {...register("idealPlants")}
                                    errorMessage={
                                        formState.errors.idealPlants?.message
                                    }
                                />
                                <Input
                                    label="Tools"
                                    {...register("tools")}
                                    errorMessage={
                                        formState.errors.tools?.message
                                    }
                                />
                            </div>
                        </form>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="flex justify-end gap-8">
                        <Button variant="flat" color="primary" onPress={submit}>
                            Save
                        </Button>

                        <Button
                            variant="flat"
                            color="default"
                            onPress={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
