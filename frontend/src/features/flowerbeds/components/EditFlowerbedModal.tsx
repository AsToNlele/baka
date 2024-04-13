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
import { toast } from "sonner"
import {
    EditFlowerbedSchema,
    EditFlowerbedValidationType,
} from "@/features/flowerbeds/types"
import { useEditFlowerbed } from "@/features/flowerbeds/hooks/useEditFlowerbed"
import { FlowerbedDetailResponse } from "@/utils/types"
import { useEffect } from "react"

type EditFlowerbedModalProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    flowerbed: FlowerbedDetailResponse | undefined
}

export const EditFlowerbedModal = ({
    isOpen,
    onOpenChange,
    onClose,
    flowerbed,
}: EditFlowerbedModalProps) => {
    const { register, handleSubmit, formState, control, reset } =
        useForm<EditFlowerbedValidationType>({
            resolver: zodResolver(EditFlowerbedSchema),
        })

    const submit = () => {
        handleSubmit(onSubmit)()
    }

    useEffect(() => {
        if (!flowerbed) return
        reset({
            name: flowerbed.name!,
            pricePerDay: parseFloat(flowerbed.pricePerDay!) ?? 0,
            dimension_width: flowerbed.dimension_width,
            dimension_height: flowerbed.dimension_height,
            idealPlants: flowerbed.idealPlants!,
            tools: flowerbed.tools!,
        })
    }, [reset, flowerbed, onOpenChange])

    const { mutate } = useEditFlowerbed()

    const onSubmit: SubmitHandler<EditFlowerbedValidationType> = (data) => {
        mutate(
            { id: flowerbed?.id ?? 0, data },
            {
                onSuccess: () => {
                    onClose()
                    toast.success("Flowerbed updated successfully")
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
                <ModalHeader className="flex flex-col gap-1">
                    Edit Flowerbed
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
                                    defaultValue={flowerbed?.name ?? ""}
                                />
                                <Input
                                    type="number"
                                    label="Price per day"
                                    {...register("pricePerDay")}
                                    errorMessage={
                                        formState.errors.pricePerDay?.message
                                    }
                                    defaultValue={flowerbed?.pricePerDay}
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
                                    defaultValue={flowerbed?.disabled ?? false}
                                />
                                <Input
                                    type="number"
                                    label="Width"
                                    {...register("dimension_width")}
                                    errorMessage={
                                        formState.errors.dimension_width
                                            ?.message
                                    }
                                    defaultValue={
                                        flowerbed?.dimension_width?.toString() ??
                                        "0"
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
                                    defaultValue={
                                        flowerbed?.dimension_height?.toString() ??
                                        "0"
                                    }
                                />
                                <Input
                                    label="Ideal plants"
                                    {...register("idealPlants")}
                                    errorMessage={
                                        formState.errors.idealPlants?.message
                                    }
                                    defaultValue={flowerbed?.idealPlants ?? ""}
                                />
                                <Input
                                    label="Tools"
                                    {...register("tools")}
                                    errorMessage={
                                        formState.errors.tools?.message
                                    }
                                    defaultValue={flowerbed?.tools ?? ""}
                                />
                                <Input type="submit" hidden className="hidden" />
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
