import "react-day-picker/dist/style.css"
import "./DayPicker.css"
import { ChangeEventHandler, useEffect, useState, useRef } from "react"

import { format, isAfter, isBefore, isValid, parse } from "date-fns"
import { DateRange, DayPicker, SelectRangeEventHandler } from "react-day-picker"
import { Divider, Input } from "@nextui-org/react"
import { cs, enGB } from "date-fns/locale"
import { FlowerbedType } from "@/utils/types"

type DaySingleRangePickerWithInputProps = {
    range: DateRange | undefined
    onRangeChange: (range: DateRange | undefined) => void
}

const dateFormat = "dd.MM.yyyy"

export const DaySingleRangePickerWithInput = ({
    range,
    onRangeChange,
}: DaySingleRangePickerWithInputProps) => {
    const fromValue = useRef<string>(format(new Date(), dateFormat))
    const [toValue, setToValue] = useState<string>("")

    const handleToValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setToValue(e.target.value)
    }

    const handleDayClick = (day: Date | undefined) => {
        setToValue(day ? format(day, dateFormat) : "")
    }

    useEffect(() => {
        const fromDate = parse(fromValue.current, dateFormat, new Date())
        const toDate = toValue
            ? parse(toValue, dateFormat, new Date())
            : undefined
        onRangeChange({
            from: fromDate,
            to: toDate,
        })
    }, [toValue])
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-center flex-1">
                <DaySingleRangePicker
                    range={range}
                    onDayClick={handleDayClick}
                />
            </div>
            <div className="flex items-center justify-center">
                <Input
                    label="From Date"
                    placeholder="25.05.1977"
                    value={fromValue.current}
                    fullWidth={false}
                    className="w-auto"
                />
                <Divider orientation="horizontal" className="max-w-[30px]" />
                <Input
                    label="To Date"
                    placeholder="25.05.1983"
                    value={toValue}
                    onChange={handleToValueChange}
                    className="w-auto"
                />
            </div>
        </div>
    )
}

type DaySingleRangePickerProps = {
    range: DateRange | undefined
    onDayClick: (range: Date | undefined) => void
}

export const DaySingleRangePicker = ({
    range,
    onDayClick,
}: DaySingleRangePickerProps) => {
    return (
        <>
            <div className="block md:hidden">
                <DayPicker
                    mode="range"
                    onDayClick={onDayClick}
                    selected={range}
                    numberOfMonths={1}
                    disabled={{
                        before: new Date(),
                    }}
                />
            </div>
            <div className="hidden md:block">
                <DayPicker
                    mode="range"
                    onDayClick={onDayClick}
                    selected={range}
                    numberOfMonths={2}
                    disabled={{
                        before: new Date(),
                    }}
                    styles={{
                        day: {},
                    }}
                />
            </div>
        </>
    )
}

export const DayRangePicker = ({
    onRangeChange,
    selectedRange = undefined,
    rents = [],
}: {
    onRangeChange: (range: DateRange | undefined) => void
    selectedRange?: DateRange | undefined
    rents: FlowerbedType["rents"]
}) => {
    const [fromValue, setFromValue] = useState<string>("")
    const [toValue, setToValue] = useState<string>("")

    const setSelectedRange = (range: DateRange | undefined) => {
        onRangeChange(range)
    }

    const disabledRanges = rents
        ?.filter((rent) => rent.rented_to && rent.rented_from)
        .map((rent) => ({
            from: new Date(rent.rented_from!),
            to: new Date(rent.rented_to!),
        }))

    const hasCzechLocale = navigator?.languages?.includes("cs") ?? false
    const locale = !hasCzechLocale ? cs : enGB

    useEffect(() => {
        onRangeChange(selectedRange)
    }, [selectedRange])

    const handleFromChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFromValue(e.target.value)
        const date = parse(e.target.value, dateFormat, new Date())
        if (!isValid(date)) {
            return setSelectedRange({ from: undefined, to: undefined })
        }
        if (selectedRange?.to && isAfter(date, selectedRange.to)) {
            setSelectedRange({ from: selectedRange.to, to: date })
        } else {
            setSelectedRange({ from: date, to: selectedRange?.to })
        }
    }

    const handleToChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setToValue(e.target.value)
        const date = parse(e.target.value, dateFormat, new Date())

        if (!isValid(date)) {
            return setSelectedRange({
                from: selectedRange?.from,
                to: undefined,
            })
        }
        if (selectedRange?.from && isBefore(date, selectedRange.from)) {
            setSelectedRange({ from: date, to: selectedRange.from })
        } else {
            setSelectedRange({ from: selectedRange?.from, to: date })
        }
    }

    const handleRangeSelect: SelectRangeEventHandler = (
        range: DateRange | undefined,
    ) => {
        setSelectedRange(range)
        if (range?.from) {
            setFromValue(format(range.from, dateFormat))
        } else {
            setFromValue("")
        }
        if (range?.to) {
            setToValue(format(range.to, dateFormat))
        } else {
            setToValue("")
        }
    }

    return (
        <div className="flex flex-wrap gap-4">
            <div className="flex justify-center flex-1">
                <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={handleRangeSelect}
                    locale={locale}
                    disabled={disabledRanges}
                />
            </div>
            <div className="flex flex-col items-center justify-center">
                <Input
                    label="From Date"
                    placeholder="25.05.1977"
                    value={fromValue}
                    onChange={handleFromChange}
                />
                <Divider orientation="vertical" className="max-h-[5rem]" />
                <Input
                    label="To Date"
                    placeholder="25.05.1983"
                    value={toValue}
                    onChange={handleToChange}
                />
            </div>
        </div>
    )
}
