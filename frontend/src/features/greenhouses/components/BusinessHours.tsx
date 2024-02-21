import { BusinessHoursType } from "@/utils/types"
import { Button, Input, Switch } from "@nextui-org/react"
import { FaPlus, FaTrash } from "react-icons/fa"

export const BusinessHours = ({
    onChange,
    value,
}: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    onChange: (data: any) => void
    value: Array<BusinessHoursType>
}) => {
    type timeType = "from" | "to"

    const handleDaySwitch = (day: number, inputValue: boolean) => {
        if (inputValue) {
            onChange([
                ...value,
                {
                    day: day,
                    greenhouse_business_hour_periods: [
                        {
                            open: "09:00",
                            close: "17:00",
                        },
                    ],
                },
            ])
        } else {
            onChange(value.filter((d) => d.day !== day))
        }
    }

    const handlePeriodAdd = (day: number) => {
        const tempDays = [...value]
        tempDays
            .find((d) => d.day === day)!
            .greenhouse_business_hour_periods.push({
                open: "09:00",
                close: "17:00",
            })
        onChange(tempDays)
    }

    const handlePeriodRemove = (day: number, index: number) => {
        const tempDays = [...value]
        const filteredPeriods = tempDays
            .find((d) => d.day === day)!
            .greenhouse_business_hour_periods.filter((_, i) => i !== index)
        tempDays.find((d) => d.day === day)!.greenhouse_business_hour_periods =
            filteredPeriods
        onChange(tempDays)
    }

    const handleTimeChange = (
        day: number,
        index: number,
        type: timeType,
        inputValue: string,
    ) => {
        const tempDays = [...value]
        if (type === "from") {
            tempDays.find(
                (d) => d.day === day,
            )!.greenhouse_business_hour_periods[index].open = inputValue
        } else {
            tempDays.find(
                (d) => d.day === day,
            )!.greenhouse_business_hour_periods[index].close = inputValue
        }
        onChange(tempDays)
    }

    const mappedDays = days.map((day) => {
        const periods = value.find((d) => d.day === day.day)
        return {
            ...day,
            greenhouse_business_hour_periods: periods
                ? periods?.greenhouse_business_hour_periods
                : [],
        }
    })

    return (
        <div className="flex flex-col gap-4 mt-4">
            {mappedDays.map((day) => {
                return (
                    <div className="flex gap-4">
                        <div className="mt-4 flex gap-4">
                            <Switch
                                className="items-start"
                                isSelected={
                                    day.greenhouse_business_hour_periods &&
                                    day.greenhouse_business_hour_periods
                                        .length > 0
                                }
                                onValueChange={(value) =>
                                    handleDaySwitch(day.day, value)
                                }
                            />
                            <h2>{day.name}</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {day.greenhouse_business_hour_periods?.map(
                                (period, index) => (
                                    <div className="flex gap-8 items-center">
                                        <Input
                                            label="From"
                                            type="time"
                                            fullWidth={false}
                                            className="w-36"
                                            defaultValue={period.open}
                                            onChange={(inputValue) =>
                                                handleTimeChange(
                                                    day.day,
                                                    index,
                                                    "from",
                                                    inputValue.target.value,
                                                )
                                            }
                                        />
                                        <Input
                                            label="To"
                                            type="time"
                                            fullWidth={false}
                                            className="w-36"
                                            defaultValue={period.close}
                                            onChange={(inputValue) =>
                                                handleTimeChange(
                                                    day.day,
                                                    index,
                                                    "to",
                                                    inputValue.target.value,
                                                )
                                            }
                                        />
                                        {index === 0 ? (
                                            <Button
                                                color="success"
                                                variant="flat"
                                                isIconOnly
                                                onPress={() =>
                                                    handlePeriodAdd(day.day)
                                                }
                                            >
                                                <FaPlus />
                                            </Button>
                                        ) : (
                                            <Button
                                                color="danger"
                                                variant="flat"
                                                isIconOnly
                                                onPress={() =>
                                                    handlePeriodRemove(
                                                        day.day,
                                                        index,
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                            </Button>
                                        )}
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const days = [
    {
        day: 1,
        name: "Monday",
    },
    {
        day: 2,
        name: "Tuesday",
    },
    {
        day: 3,
        name: "Wednesday",
    },
    {
        day: 4,
        name: "Thursday",
    },
    {
        day: 5,
        name: "Friday",
    },
    {
        day: 6,
        name: "Saturday",
    },
    {
        day: 0,
        name: "Sunday",
    },
]
