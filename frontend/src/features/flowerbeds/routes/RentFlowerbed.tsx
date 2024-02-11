import { useFlowerbedDetail } from "@/features/flowerbeds/hooks/useFlowerbedDetail"
import { useMultistepFormStore } from "@/features/flowerbeds/stores/useMultistepFormStore"
import { Button, Divider, Image } from "@nextui-org/react"
import { useNavigate, useParams } from "react-router-dom"
import { DaySingleRangePickerWithInput } from "@/features/flowerbeds/components/DayRangePicker"
import { DateRange } from "react-day-picker"

import { differenceInDays, format, startOfDay } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import * as z from "zod"
import { useFlowerbedStatus } from "@/features/flowerbeds/hooks/useFlowerbedStatus"

const RentFlowerbedHeader = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { data } = useFlowerbedDetail(flowerbedId)

    return (
        <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex flex-1 sm:flex-none justify-center">
                <div className="max-w-[400px] lg:max-w-[250px]">
                    <Image
                        classNames={{
                            wrapper: "w-full",
                            img: "w-full aspect-4/3",
                        }}
                        src={`https://placedog.net/800/600`}
                    />
                </div>
            </div>
            <div className="flex gap-2 justify-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">
                        {data?.greenhouse.title}
                    </h1>
                    <p>{data?.name}</p>
                    <div className="">
                        <h3 className="text-lg font-semibold">Address</h3>
                        <p>{data?.greenhouse.greenhouse_address.street}</p>
                        <p>
                            {data?.greenhouse.greenhouse_address.city}{" "}
                            {data?.greenhouse.greenhouse_address.city_part &&
                                `, ${data?.greenhouse.greenhouse_address.city_part}`}
                        </p>
                        <p>{data?.greenhouse.greenhouse_address.zipcode}</p>
                    </div>
                </div>
                <div>
                    <div>
                        <h3 className="text-lg font-semibold">Price</h3>
                        <p>
                            {data &&
                                Number.parseFloat(
                                    data?.pricePerDay ?? "0",
                                )}{" "}
                            CZK/day
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            Minimal rent length
                        </h3>
                        <p>30 days</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// TODO: add min length of rent
const schema = z
    .object({
        from: z.coerce.date(),
        to: z.coerce.date(),
    })
    .refine(
        (schema) => schema.from <= schema.to,
        "'From' has to be before 'To'",
    )
    .refine(
        (schema) => schema.from >= startOfDay(new Date()),
        "'From' has to be in the future",
    )
    .refine(
        (schema) => schema.to >= startOfDay(new Date()),
        "'To' has to be in the future",
    )

export const RentFlowerbed = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { data, isLoading } = useFlowerbedDetail(flowerbedId)

    console.log(data, isLoading)

    return (
        <div className="flex flex-col gap-4">
            <RentFlowerbedHeader />
            <MultistepForm />
        </div>
    )
}

const Step1 = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { setCurrentStep, dateRange, setDateRange } = useMultistepFormStore()
    const { refetch } = useFlowerbedStatus(flowerbedId)
    const { data } = useFlowerbedDetail(flowerbedId)

    const [daysInBetween, setDaysInBetween] = useState<number | undefined>(
        undefined,
    )

    useEffect(() => {
        const calculateDaysInBetween = (range: DateRange | undefined) => {
            console.log(range)
            if (!range) return undefined
            let val =
                differenceInDays(
                    dateRange?.to || new Date(),
                    dateRange?.from || new Date(),
                ) + 1
            console.log(val)
            return val
        }
        setDaysInBetween(calculateDaysInBetween(dateRange))
    }, [dateRange])

    console.log(daysInBetween)

    const goToNext = () => {
        const result = schema.safeParse(dateRange)
        console.log(result)
        if (!result.success) {
            result.error.errors.map((error) => {
                toast.error(error.message)
            })
            return
        }
        refetch()

        setCurrentStep("step2")
    }

    const navigate = useNavigate()

    return (
        <div className="lg:mx-24 mx-auto flex flex-col gap-4">
            <DaySingleRangePickerWithInput
                range={dateRange}
                onRangeChange={setDateRange}
            />
            <div className="grid grid-cols-[repeat(2,max-content)] justify-end gap-2">
                <p>Days:</p>
                <p>{data && daysInBetween}</p>
                <p>Price per day:</p>
                <p>{data && Number.parseFloat(data?.pricePerDay ?? "0")}</p>
                <p className="text-lg font-bold">Total:</p>
                <p className="text-xl text-secondary">
                    {data &&
                        Number.parseFloat(data?.pricePerDay ?? "0") *
                            daysInBetween!}
                </p>
            </div>
            <div className="flex justify-between">
                <Button onPress={() => navigate(-1)}>Previous</Button>
                <Button color="primary" onPress={goToNext}>
                    Next
                </Button>
            </div>
        </div>
    )
}

// const Step1WithBothRanges = () => {
//     const {id} = useParams()
//     const flowerbedId = id ? parseInt(id) : null
//     const {setCurrentStep, dateRange, setDateRange} = useMultistepFormStore()
//     // const {refetch} = useFlowerbedStatus(flowerbedId)
//     const {data} = useFlowerbedDetail(flowerbedId)
//     console.log(dateRange)
//
//     const handleRangeChange = (range: DateRange | undefined) => {
//         console.log(range)
//         if (!range) {
//             setDateRange(undefined)
//         } else {
//             setDateRange(range)
//         }
//     }
//
//     const goToNext = () => {
//         const result = schema.safeParse(dateRange)
//         console.log(result)
//         if (!result.success) {
//             // console.log(result.error.errors)
//             result.error.errors.map((error) => {
//                 toast.error(error.message)
//             })
//             return
//         }
//         // refetch();
//
//         setCurrentStep("step2")
//     }
//
//     return (
//         <div>
//             <div className="flex justify-center">
//                 <DayRangePicker
//                     selectedRange={dateRange}
//                     onRangeChange={handleRangeChange}
//                     rents={data?.rents}
//                 />
//             </div>
//             <Button onPress={goToNext}>Next</Button>
//         </div>
//     )
// }

const Step2 = () => {
    const { dateRange, setCurrentStep } = useMultistepFormStore()
    const dateFormat = "dd.MM.yyyy"

    useEffect(() => {
        if (!dateRange || !dateRange.from || !dateRange.to) {
            toast.error("Please select a valid date range")
            setCurrentStep("step1")
        }
    }, [dateRange])

    return (
        <>
            {dateRange && dateRange.from && dateRange.to && (
                <div>
                    {format(dateRange.from, dateFormat)} -{" "}
                    {format(dateRange.to, dateFormat)}
                </div>
            )}
            <Button onPress={() => setCurrentStep("step1")}>Back</Button>
            <Button onPress={() => setCurrentStep("step3")}>Next</Button>
        </>
    )
}
const Step3 = () => <>Step3</>

const MultistepForm = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { currentStep } = useMultistepFormStore()
    const { data } = useFlowerbedDetail(flowerbedId)
    const { data: statusData } = useFlowerbedStatus(flowerbedId)
    const navigate = useNavigate()

    useEffect(() => {
        if (statusData) {
            if (statusData?.status === "rented") {
                toast.error("This flowerbed is already rented")

                navigate(
                    data?.greenhouse.id
                        ? `/app/greenhouses/${data?.greenhouse.id}`
                        : "/app/greenhouses",
                )
            }
        }
    }, [statusData])
    return (
        <div>
            <div className="flex justify-center gap-4">
                <div
                    className={`${
                        currentStep === "step1" ? "text-black" : "text-gray-300"
                    }`}
                >
                    Rent length
                </div>
                <div
                    className={`${
                        currentStep === "step2" ? "text-black" : "text-gray-500"
                    }`}
                >
                    Summary
                </div>
                <div
                    className={`${
                        currentStep === "step3" ? "text-black" : "text-gray-500"
                    }`}
                >
                    Payment
                </div>
            </div>
            <Divider />
            <div>
                {currentStep === "step1" && <Step1 />}
                {currentStep === "step2" && <Step2 />}
                {currentStep === "step3" && <Step3 />}
            </div>
        </div>
    )
}
