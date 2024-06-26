// Author: Alexandr Celakovsky - xcelak00
import { useFlowerbedDetail } from "@/features/flowerbeds/hooks/useFlowerbedDetail"
import { useMultistepFormStore } from "@/features/flowerbeds/stores/useRentMultistepFormStore"
import { Button, Divider } from "@nextui-org/react"
import { useNavigate, useParams } from "react-router-dom"
import {
    DaySingleFromFixedRangePickerWithInput,
} from "@/features/flowerbeds/components/DayRangePicker"
import { DateRange } from "react-day-picker"

import { differenceInDays, format, startOfDay } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import * as z from "zod"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { Loading } from "@/components/Loading"
import { QRPaymentStandalone } from "@/features/orders/components/QRPayment"
import { AwaitPayment } from "@/features/orders/components/AwaitPayment"
import { useExtendRentFlowerbed } from "@/features/flowerbeds/hooks/useExtendRentFlowerbed"
import { GreenhouseImage } from "@/features/greenhouses/components/GreenhouseImage"
import { DiscountField } from "@/features/orders/components/DiscountField"
import { LocalDiscount } from "@/utils/types"

const ExtendRentFlowerbedHeader = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { data } = useFlowerbedDetail(flowerbedId)

    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-1 justify-center sm:flex-none">
                <div className="max-w-[400px] lg:max-w-[250px]">
                    <GreenhouseImage
                        image={data?.greenhouse.image}
                        title={data?.greenhouse.title}
                    />
                </div>
            </div>
            <div className="flex justify-center gap-2">
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

export const ExtendRentFlowerbed = () => {
    return (
        <div className="flex flex-col gap-4">
            <ExtendRentFlowerbedHeader />
            <MultistepForm />
        </div>
    )
}

const Step1 = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { setCurrentStep, dateRange, setDateRange, setOrderId } =
        useMultistepFormStore()
    const { data, refetch: refetchDetail } = useFlowerbedDetail(flowerbedId)

    const [daysInBetween, setDaysInBetween] = useState<number | undefined>(
        undefined,
    )

    const setSingleDateRange = (range: DateRange | undefined) => {
        if (data && range) {
            const from = new Date(data.currentRent.rented_to)
            const to = range.to
            if (!to) {
                setDateRange({ from, to: from })
            } else if (from < to) {
                setDateRange({ from, to })
            } else {
                setDateRange({ from: from, to: from })
            }
        }
    }

    useEffect(() => {
    }, [])

    useEffect(() => {
        if (data && data?.currentRent) {
            setSingleDateRange({
                from: new Date(data?.currentRent.rented_to),
                to: new Date(data?.currentRent.rented_to),
            })
        }
    }, [data])

    useEffect(() => {
        const calculateDaysInBetween = (range: DateRange | undefined) => {
            if (!range) return undefined
            const val =
                differenceInDays(
                    dateRange?.to || new Date(),
                    dateRange?.from || new Date(),
                ) + 1
            return val
        }
        setDaysInBetween(calculateDaysInBetween(dateRange))
    }, [dateRange])

    const goToNext = () => {
        const result = schema.safeParse(dateRange)
        if (!result.success) {
            result.error.errors.map((error) => {
                toast.error(error.message)
            })
            return
        }
        refetchDetail()

        setOrderId(null)
        setCurrentStep("step2")
    }

    const navigate = useNavigate()

    if (!data) {
        return <Loading />
    }

    return (
        <div className="mx-auto flex flex-col gap-4 lg:mx-24">
            {dateRange && dateRange.from && dateRange.to && (
                <DaySingleFromFixedRangePickerWithInput
                    range={dateRange}
                    onRangeChange={setSingleDateRange}
                />
            )}
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

const Step2 = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { data } = useFlowerbedDetail(flowerbedId)
    const { dateRange, setCurrentStep } = useMultistepFormStore()
    const dateFormat = "dd.MM.yyyy"
    const { mutate } = useExtendRentFlowerbed()
    const [discount, setDiscount] = useState<LocalDiscount | null>(null)

    const goToNext = () => {
        mutate({
            id: flowerbedId!,
            data: {
                rented_from: dateRange!.from!.toISOString(),
                rented_to: dateRange!.to!.toISOString(),
                discount_code: discount?.code,
            },
        })
    }

    useEffect(() => {
        if (!dateRange || !dateRange.from || !dateRange.to) {
            toast.error("Please select a valid date range")
            setCurrentStep("step1")
        }
    }, [dateRange])

    const { data: profileData } = useProfile()

    const calculateDaysInBetween = (range: DateRange | undefined) => {
        if (!range) return 0
        const val =
            differenceInDays(
                dateRange?.to || new Date(),
                dateRange?.from || new Date(),
            ) + 1
        return val
    }
    
    const almostTotalPrice =
        Number.parseFloat(data?.pricePerDay ?? "0") *
        calculateDaysInBetween(dateRange)
    let totalPrice =
        almostTotalPrice - (discount ? discount?.discount_value : 0)
    if (totalPrice < 0) {
        totalPrice = 0
    }

    return (
        <>
            <div className="mx-auto flex flex-col gap-4 lg:mx-24">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Full name: </h2>
                        <p>
                            {profileData?.first_name || "Test"}{" "}
                            {profileData?.last_name || "User"}
                        </p>
                        <h2 className="text-xl font-bold">Email:</h2>
                        <p>{profileData?.email || "test@email.com"}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Renting from:</h2>
                        <p>{format(dateRange!.from!, dateFormat)}</p>
                        <h2 className="text-xl font-bold">Renting to:</h2>
                        <p>{format(dateRange!.to!, dateFormat)}</p>
                    </div>
                </div>
                <Divider />
                {/* Price summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Days:</h2>
                        <p>
                            {differenceInDays(
                                dateRange!.to!,
                                dateRange!.from!,
                            ) + 1}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Price per day:</h2>
                        <p>{Number.parseFloat(data?.pricePerDay ?? "0")}</p>
                    </div>
                </div>
                <Divider />
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <DiscountField
                            discount={discount}
                            setDiscount={setDiscount}
                        />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">Total:</h2>
                        <p className="text-xl text-secondary">
                            {data && almostTotalPrice}
                            {data && discount && (
                                <span>
                                    {" "}
                                    -{" "}
                                    <span className="text-success">
                                        {discount.discount_value ?? 0}
                                    </span>
                                    ={" "}
                                    <span className="text-primary">
                                        {totalPrice}
                                    </span>
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex justify-between">
                    <Button onPress={() => setCurrentStep("step1")}>
                        Previous
                    </Button>
                    <Button color="secondary" onPress={goToNext}>
                        Confirm
                    </Button>
                </div>
            </div>
        </>
    )
}
const Step3 = () => {
    const { orderId } = useMultistepFormStore()
    if (!orderId) {
        return <Loading />
    }
    return (
        <div className="flex flex-col gap-4">
            <QRPaymentStandalone orderId={orderId} />
            <AwaitPayment orderId={orderId} />
        </div>
    )
}

const MultistepForm = () => {
    const { currentStep, setCurrentStep } = useMultistepFormStore()

    useEffect(() => {
        setCurrentStep("step1")
    }, [setCurrentStep])

    return (
        <div>
            <div className="mb-2 flex justify-center gap-4">
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
            <div className="mt-4">
                {currentStep === "step1" && <Step1 />}
                {currentStep === "step2" && <Step2 />}
                {currentStep === "step3" && <Step3 />}
            </div>
        </div>
    )
}
