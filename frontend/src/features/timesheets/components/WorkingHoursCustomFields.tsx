// Author: Alexandr Celakovsky - xcelak00
import { WorkingHourType } from "@/utils/types"
import { Button, Card, CardBody } from "@nextui-org/react"
import { FaPlus, FaTrash } from "react-icons/fa"

export const WorkingHoursCustomFields = ({
    onChange,
    errors,
    value,
}: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    errors: any
    onChange: (data: any) => void
    value: Array<WorkingHourType>
}) => {
    const getNow = () => new Date().toISOString().slice(0, 16)
    const addEmptyWorkingItem = () => {
        onChange([
            ...(value ?? []),
            { start: getNow(), end: getNow() },
        ])
    }

    const removeItem = (index: number) => {
        const newValue = value.filter((_, i) => i !== index)
        onChange(newValue)
    }

    const handleDateTimeChange = (
        index: number,
        type: "start" | "end",
        e: any,
    ) => {
        const newValue = [...value]
        newValue[index][type] = e.target.value
        onChange(newValue)
    }
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-center text-xl font-bold">Working Hours</h2>
            <p className="text-center text-red-500">
                {!Array.isArray(errors) && errors?.message}
            </p>
            <div className="flex flex-col items-center justify-center gap-8">
                {value?.map((workingHour, index) => {
                    return (
                        <Card key={index}>
                            <CardBody>
                                <div>
                                    <h3 className="my-2 flex items-center justify-center gap-2 text-lg">
                                        <span>Working hour {index + 1}</span>

                                        <Button
                                            isIconOnly
                                            variant="flat"
                                            color="danger"
                                            onPress={() => removeItem(index)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </h3>
                                    <div className="flex flex-col justify-evenly gap-4 md:flex-row">
                                        <Card>
                                            <CardBody>
                                                <div className="flex flex-col justify-center gap-4">
                                                    <label
                                                        htmlFor={`start-${index}`}
                                                        className="text-center"
                                                    >
                                                        Start
                                                    </label>
                                                    <input
                                                        name={`start-${index}`}
                                                        type="datetime-local"
                                                        onChange={(e) =>
                                                            handleDateTimeChange(
                                                                index,
                                                                "start",
                                                                e,
                                                            )
                                                        }
                                                        value={
                                                            workingHour.start!
                                                        }
                                                    ></input>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <Card>
                                            <CardBody>
                                                <div className="flex flex-col justify-center gap-4">
                                                    <label
                                                        htmlFor={`end-${index}`}
                                                        className="text-center"
                                                    >
                                                        End
                                                    </label>
                                                    <input
                                                        name={`end-${index}`}
                                                        type="datetime-local"
                                                        onChange={(e) =>
                                                            handleDateTimeChange(
                                                                index,
                                                                "end",
                                                                e,
                                                            )
                                                        }
                                                        value={workingHour.end!}
                                                    ></input>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    <p className="mt-2 text-center text-red-500">
                                        {errors?.[index]?.message}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    )
                })}

                <Button
                    isIconOnly
                    color="primary"
                    size="lg"
                    onPress={addEmptyWorkingItem}
                >
                    <FaPlus />
                </Button>
            </div>
        </div>
    )
}
