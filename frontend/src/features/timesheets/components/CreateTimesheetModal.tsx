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

type CreateTimesheetModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
}
export const CreateTimesheetModal = ({
    isOpen,
    onOpenChange,
    onClose,
}: CreateTimesheetModalProps) => {
    const { mutate } = useCreateTimesheet()
    const navigate = useNavigate()

    const { register, control, handleSubmit, reset, formState, getValues } =
        useForm<CreateTimesheetValidationType>({
            resolver: zodResolver(CreateTimesheetSchema),
        })

    const onSubmit: SubmitHandler<CreateTimesheetValidationType> = (data) => {
        console.log("mutating")
        console.log(data)
        mutate(
            { data: data },
            {
                onSuccess: (res) => {
                    console.log("SUCCESS")
                    navigate(`/app/timesheets/${res.data.id}`)
                },
            },
        )
    }

    console.log(formState.errors)
    console.log(getValues())

    const submit = () => {
        console.log("SUBMITTING")
        handleSubmit(onSubmit)()
    }

    const { data } = useProfile()

    const greenhouses = (data &&
        data?.caretaker_greenhouses.map((greenhouse) => ({
            id: greenhouse.id,
            title: greenhouse.title,
        }))) || [{ id: -1, title: "Loading..." }]

    console.log(greenhouses)

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
                        Submit a Timesheet
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
                                        name="greenhouse"
                                        render={({ field: { onChange } }) => (
                                            <Select
                                                items={greenhouses}
                                                label="Greenhouse"
                                                onChange={onChange}
                                                errorMessage={
                                                    formState.errors.greenhouse
                                                        ?.message
                                                }
                                            >
                                                {greenhouses.map(
                                                    (greenhouse) =>
                                                        greenhouse && (
                                                            <SelectItem
                                                                key={
                                                                    greenhouse.id!
                                                                }
                                                                value={
                                                                    greenhouse.id!
                                                                }
                                                            >
                                                                {
                                                                    greenhouse.title
                                                                }
                                                            </SelectItem>
                                                        ),
                                                )}
                                            </Select>
                                        )}
                                    />
                                    <Input
                                        type="number"
                                        label="Pay"
                                        {...register("pay")}
                                        errorMessage={
                                            formState.errors.pay?.message
                                        }
                                    />
                                    <Controller
                                        name="working_hours"
                                        control={control}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <WorkingHoursCustomFields
                                                onChange={onChange}
                                                value={value}
                                                errors={
                                                    formState?.errors
                                                        ?.working_hours
                                                }
                                            />
                                        )}
                                    />
                                    <Divider />
                                    <Controller
                                        name="items"
                                        control={control}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TimesheetItemsCustomFields
                                                onChange={onChange}
                                                value={value}
                                                errors={
                                                    formState?.errors?.items
                                                }
                                            />
                                        )}
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
