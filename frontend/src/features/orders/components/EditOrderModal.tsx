import { useCreateTimesheet } from "@/features/timesheets/hooks/useCreateTimesheet"
import {
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalContent,
    Card,
    CardBody,
    Button,
    Input,
    Select,
    SelectItem,
    Divider,
} from "@nextui-org/react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    CreateTimesheetSchema,
    CreateTimesheetValidationType,
} from "@/features/timesheets/utils/types"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { useEffect } from "react"
import { WorkingHoursCustomFields } from "@/features/timesheets/components/WorkingHoursCustomFields"
import { TimesheetItemsCustomFields } from "@/features/timesheets/components/TimesheetItemsCustomFields"
import { useNavigate } from "react-router-dom"
import { useEditOrder } from "@/features/orders/hooks/useEditOrder"
import { OrderDetailResponse } from "@/utils/types"
import {
    EditOrderSchema,
    EditOrderValidationType,
} from "@/features/orders/utils/types"

type EditOrderModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    order: OrderDetailResponse
}
export const EditOrderModal = ({
    isOpen,
    onOpenChange,
    onClose,
    order,
}: EditOrderModalProps) => {
    const { mutate } = useEditOrder()

    const { register, control, handleSubmit, reset, formState, getValues } =
        useForm<EditOrderValidationType>({
            resolver: zodResolver(EditOrderSchema),
            defaultValues: {
                status: order.status!,
                final_price: parseFloat(order.final_price ?? "") ?? 0,
            },
        })

    const onSubmit: SubmitHandler<EditOrderValidationType> = (data) => {
        console.log("mutating")
        console.log(data)
        mutate(
            { id: order.id!, data: data },
            {
                onSuccess: () => {
                    onClose()
                },
            },
        )
    }

    console.log(formState.errors)
    console.log(getValues())

    const submit = () => {
        handleSubmit(onSubmit)()
    }

    useEffect(() => {
        reset({
            status: order.status!,
            final_price: parseFloat(order.final_price ?? "") ?? 0,
        })
    }, [onOpenChange, reset, order])

    const orderStatuses = [
        {
            id: "created",
            title: "Created",
        },
        {
            id: "paid",
            title: "Paid",
        },
        {
            id: "cancelled",
            title: "Cancelled",
        },
    ]

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
                        Edit Order
                    </ModalHeader>
                    <ModalBody>
                        <Card>
                            <CardBody>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        submit()
                                    }}
                                    className="flex flex-col gap-4"
                                >
                                    <Controller
                                        control={control}
                                        name="status"
                                        defaultValue={order.status!}
                                        render={({ field: { onChange } }) => (
                                            <Select
                                                items={orderStatuses}
                                                label="Status"
                                                onChange={onChange}
                                                defaultSelectedKeys={[
                                                    order.status!,
                                                ]}
                                                errorMessage={
                                                    formState.errors.status
                                                        ?.message
                                                }
                                            >
                                                {orderStatuses.map((status) => (
                                                    <SelectItem
                                                        key={status.id}
                                                        value={status.id}
                                                    >
                                                        {status.title}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <Input
                                        type="number"
                                        label="Final price"
                                        {...register("final_price")}
                                        defaultValue={order.final_price!}
                                        errorMessage={
                                            formState.errors.final_price
                                                ?.message
                                        }
                                    />
                                    <Input
                                        variant="flat"
                                        color="secondary"
                                        type="submit"
                                        value="Submit"
                                    />
                                </form>
                            </CardBody>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}
