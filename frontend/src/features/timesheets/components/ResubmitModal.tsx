import { useResubmitTimesheet } from "@/features/timesheets/hooks/useResubmitTimesheet"
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
    // Select,
    // SelectItem,
    Divider,
} from "@nextui-org/react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    CreateTimesheetSchema,
    CreateTimesheetValidationType,
    ResubmitTimesheetValidationType,
} from "@/features/timesheets/utils/types"
import { useEffect } from "react"
import { WorkingHoursCustomFields } from "@/features/timesheets/components/WorkingHoursCustomFields"
import { TimesheetItemsCustomFields } from "@/features/timesheets/components/TimesheetItemsCustomFields"
import { useNavigate, useParams } from "react-router-dom"
import { useTimesheetDetail } from "@/features/timesheets/hooks/useTimesheetDetail"
import { toZonedTime, format } from "date-fns-tz"

type CreateTimesheetModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
}
export const ResubmitModal = ({
    isOpen,
    onOpenChange,
    onClose,
}: CreateTimesheetModalProps) => {
    const { mutate } = useResubmitTimesheet()
    const navigate = useNavigate()
    const { id } = useParams()
    const timesheetId = id ? parseInt(id) : null
    const { data: timesheetData } = useTimesheetDetail(timesheetId)

    const convertedTimesheetData = (timesheetData && {
        greenhouse: timesheetData?.greenhouse.id ?? -1,
        pay: parseInt(timesheetData?.pay ?? "0"),
        working_hours: timesheetData?.working_hours.map((wh) => {
            const startUtcDatetime = new Date(wh.start ?? "")
            const endUtcDatetime = new Date(wh.end ?? "")

            const currentTimezone =
                Intl.DateTimeFormat().resolvedOptions().timeZone ??
                "Europe/Prague"

            const startLocalDatetime = toZonedTime(
                startUtcDatetime,
                currentTimezone,
            )
            const endLocalDatetime = toZonedTime(
                endUtcDatetime,
                currentTimezone,
            )

            const start = format(startLocalDatetime, "yyyy-MM-dd'T'HH:mm")
            const end = format(endLocalDatetime, "yyyy-MM-dd'T'HH:mm")

            return {
                start,
                end,
            }
        }),
        items: timesheetData?.items?.map((item) => ({
            title: item?.title ?? "",
            description: item?.description ?? "",
        })),
    }) || {
        greenhouse: "-1",
        pay: 0,
        working_hours: [],
        items: [],
    }

    const { register, control, handleSubmit, reset, formState, getValues } =
        useForm<CreateTimesheetValidationType>({
            resolver: zodResolver(CreateTimesheetSchema),
            defaultValues: {
                greenhouse: timesheetData?.greenhouse.id ?? -1,
                pay: convertedTimesheetData.pay,
                working_hours: convertedTimesheetData.working_hours,
                items: convertedTimesheetData?.items,
            },
        })

    const onSubmit: SubmitHandler<ResubmitTimesheetValidationType> = (data) => {
        console.log("mutating")
        console.log(data)
        mutate(
            { id: timesheetId!, data },
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

    // const { data } = useProfile()

    // const greenhouses = (data &&
    //     data?.caretaker_greenhouses.map((greenhouse) => ({
    //         id: `${greenhouse?.id}`,
    //         title: `${greenhouse?.title}`,
    //     }))) || []

    // console.log(greenhouses)

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
                                    <Input
                                        label="Greenhouse"
                                        disabled
                                        value={
                                            timesheetData?.greenhouse.title ??
                                            ""
                                        }
                                    />
                                    {/* <Controller */}
                                    {/*     control={control} */}
                                    {/*     name="greenhouse" */}
                                    {/*     render={({ field: { onChange } }) => ( */}
                                    {/*         <Select */}
                                    {/*             items={greenhouses} */}
                                    {/*             label="Greenhouse" */}
                                    {/*             onChange={onChange} */}
                                    {/*             errorMessage={ */}
                                    {/*                 formState.errors.greenhouse */}
                                    {/*                     ?.message */}
                                    {/*             } */}
                                    {/*             defaultSelectedKeys={[ */}
                                    {/*                 `${convertedTimesheetData.greenhouse}`, */}
                                    {/*             ]} */}
                                    {/*         > */}
                                    {/*             {greenhouses.map( */}
                                    {/*                 (greenhouse) => */}
                                    {/*                     greenhouse && ( */}
                                    {/*                         <SelectItem */}
                                    {/*                             key={`${greenhouse.id!}`} */}
                                    {/*                             value={`${greenhouse.id!}`} */}
                                    {/*                         > */}
                                    {/*                             { */}
                                    {/*                                 greenhouse.title */}
                                    {/*                             } */}
                                    {/*                         </SelectItem> */}
                                    {/*                     ), */}
                                    {/*             )} */}
                                    {/*         </Select> */}
                                    {/*     )} */}
                                    {/* /> */}
                                    <Input
                                        type="number"
                                        label="Pay"
                                        defaultValue={convertedTimesheetData.pay.toString()}
                                        {...register("pay")}
                                        errorMessage={
                                            formState.errors.pay?.message
                                        }
                                    />
                                    <Controller
                                        name="working_hours"
                                        control={control}
                                        defaultValue={
                                            convertedTimesheetData.working_hours
                                        }
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
                                        defaultValue={
                                            convertedTimesheetData.items
                                        }
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
