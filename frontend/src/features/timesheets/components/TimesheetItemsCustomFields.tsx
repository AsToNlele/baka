// Author: Alexandr Celakovsky - xcelak00
import { TimesheetItemType } from "@/utils/types"
import {
    Button,
    Card,
    CardBody,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Dropdown
} from "@nextui-org/react"
import { Key } from "react"
import { FaPlus, FaTrash } from "react-icons/fa"

export const TimesheetItemsCustomFields = ({
    onChange,
    errors,
    value,
}: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    errors: any
    onChange: (data: any) => void
    value: Array<TimesheetItemType>
}) => {
    const addItem = (key: Key) => {
        // Prefilled items for ux
        switch (key) {
            case "refill":
                onChange([
                    ...(value ?? []),
                    {
                        title: "Refill marketplace",
                        description: "Restock and update inventory",
                    },
                ])
                break
            case "maintanance":
                onChange([
                    ...(value ?? []),
                    {
                        title: "Maintanance",
                        description: "Check and maintainance of greenhouse",
                    },
                ])
                break
            case "fertilizing":
                onChange([
                    ...(value ?? []),
                    { title: "Fertilizing", description: "Fertilizing plants" },
                ])
                break
            case "prepare":
                onChange([
                    ...(value ?? []),
                    {
                        title: "Prepare new flowerbed",
                        description: "Preparations for a new tenant",
                    },
                ])
                break
            case "custom":
                onChange([
                    ...(value ?? []),
                    { title: "Your title", description: "Your description" },
                ])
                break
            default:
                break
        }
    }

    const removeItem = (index: number) => {
        const newValue = value.filter((_, i) => i !== index)
        onChange(newValue)
    }

    const handleTextChange = (
        index: number,
        type: "title" | "description",
        e: any,
    ) => {
        const newValue = [...value]
        newValue[index][type] = e.target.value
        onChange(newValue)
    }
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-center text-xl font-bold">Jobs</h2>
            <p className="text-center text-red-500">
                {!Array.isArray(errors) && errors?.message}
            </p>
            <div className="flex flex-col items-center justify-center gap-8">
                {value?.map((item, index) => {
                    return (
                        <Card
                            key={index}
                            classNames={{
                                base: "w-full",
                            }}
                        >
                            <CardBody>
                                <div>
                                    <h3 className="my-2 flex items-center justify-center gap-2 text-lg">
                                        <span>Item {index + 1}</span>

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
                                        <Card
                                            classNames={{
                                                base: "w-full",
                                            }}
                                        >
                                            <CardBody>
                                                <div className="flex w-full flex-col justify-center gap-4">
                                                    <Input
                                                        label="Title"
                                                        type="text"
                                                        onChange={(e) =>
                                                            handleTextChange(
                                                                index,
                                                                "title",
                                                                e,
                                                            )
                                                        }
                                                        value={item.title!}
                                                    />
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <Card
                                            classNames={{
                                                base: "w-full",
                                            }}
                                        >
                                            <CardBody>
                                                <div className="flex flex-col justify-center gap-4">
                                                    <Input
                                                        label="Description"
                                                        type="text"
                                                        onChange={(e) =>
                                                            handleTextChange(
                                                                index,
                                                                "description",
                                                                e,
                                                            )
                                                        }
                                                        value={
                                                            item.description!
                                                        }
                                                    />
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
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            isIconOnly
                            color="primary"
                            size="lg"
                        >
                            <FaPlus />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Action event example"
                        onAction={(key) => addItem(key)}
                    >
                        <DropdownItem key="refill">
                            Refill marketplace
                        </DropdownItem>
                        <DropdownItem key="maintanance">
                            Maintanance
                        </DropdownItem>
                        <DropdownItem key="fertilizing">
                            Fertilizing
                        </DropdownItem>
                        <DropdownItem key="prepare">
                            Prepare new flowerbed
                        </DropdownItem>
                        <DropdownItem key="custom">Custom</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    )
}
