import { useSaveHarvests } from "@/features/flowerbeds/hooks/useSaveHarvests"
import { useHarvestStore } from "@/features/flowerbeds/stores/useHarvestStore"
import { FlowerbedHarvestType } from "@/utils/types"
import { parseIsoAndFormatInputDate } from "@/utils/utils"
import {
    Button,
    Card,
    CardBody,
    Table,
    TableHeader,
    TableCell,
    TableColumn,
    TableRow,
    TableBody,
    Input,
    Divider,
} from "@nextui-org/react"
import { fromZonedTime } from "date-fns-tz"
import { Fragment, useEffect } from "react"
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa"
import { toast } from "sonner"

type HarvestProps = {
    harvests: Array<FlowerbedHarvestType>
    flowerbedId?: number
}

export const Harvest = ({ harvests, flowerbedId }: HarvestProps) => {
    const saveHarvests = useSaveHarvests()
    const { localHarvests, setLocalHarvests } = useHarvestStore()

    useEffect(() => {
        if (harvests && harvests.length > 0) {
            setLocalHarvests(harvests)
        }
    }, [harvests, setLocalHarvests])

    const save = () => {
        saveHarvests.mutate(
            {
                id: flowerbedId!,
                harvests: localHarvests,
            },
            {
                onSuccess: () => {
                    toast.success("Harvests saved successfully")
                },
            },
        )
    }

    const setValue = (
        index: number,
        type: "name" | "date" | "quantity",
        value: string,
    ) => {
        const newHarvests = [...localHarvests]
        if (type === "quantity") {
            const parsedValue = parseInt(value) >= 0 ? parseInt(value) : 0
            newHarvests[index].quantity = parsedValue
        }
        if (type === "name") {
            newHarvests[index].name = value
        }
        if (type === "date") {
            const currentTimezone =
                Intl.DateTimeFormat().resolvedOptions().timeZone ??
                "Europe/Prague"

            const dateUtc = fromZonedTime(value, currentTimezone).toISOString()
            newHarvests[index].date = dateUtc
        }
        setLocalHarvests(newHarvests)
    }

    const addNewHarvest = () => {
        const newHarvests = [
            ...localHarvests,
            {
                name: "Crop",
                quantity: 0,
                date: new Date().toISOString(),
            },
        ]
        setLocalHarvests(newHarvests)
    }

    const removeHarvest = (index: number) => {
        const newHarvests = localHarvests.filter((_, i) => i !== index)
        setLocalHarvests(newHarvests)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="min-h-80 w-full">
                <h1 className="mb-2 text-lg font-semibold">Harvest</h1>
                <Card>
                    <CardBody>
                        <div className="hidden lg:block">
                            <Table
                                shadow="none"
                                isStriped
                                aria-label="Example static collection table"
                            >
                                <TableHeader>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn>Quantity</TableColumn>
                                    <TableColumn>Date</TableColumn>
                                    <TableColumn>Action</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {localHarvests.map((harvest, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell className="shrink p-0">
                                                    <input
                                                        className="min-w-0 shrink rounded-lg border-2 border-black p-0 px-1"
                                                        value={
                                                            harvest.name ?? ""
                                                        }
                                                        onChange={(e) => {
                                                            setValue(
                                                                index,
                                                                "name",
                                                                e.target.value,
                                                            )
                                                        }}
                                                    ></input>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap items-center justify-center gap-2 xl:justify-start">
                                                        <input
                                                            type="number"
                                                            className="max-w-20 rounded-lg border-2 border-black p-0 px-1"
                                                            value={
                                                                harvest.quantity?.toString() ??
                                                                "0"
                                                            }
                                                            onChange={(e) => {
                                                                setValue(
                                                                    index,
                                                                    "quantity",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }}
                                                        ></input>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                isIconOnly
                                                                onPress={() => {
                                                                    setValue(
                                                                        index,
                                                                        "quantity",
                                                                        (
                                                                            (harvest.quantity ??
                                                                                0) +
                                                                            1
                                                                        ).toString(),
                                                                    )
                                                                }}
                                                            >
                                                                <FaPlus />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                isIconOnly
                                                                onPress={() => {
                                                                    setValue(
                                                                        index,
                                                                        "quantity",
                                                                        (
                                                                            (harvest.quantity ??
                                                                                0) -
                                                                            1
                                                                        ).toString(),
                                                                    )
                                                                }}
                                                            >
                                                                <FaMinus />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <input
                                                        type="date"
                                                        value={
                                                            parseIsoAndFormatInputDate(
                                                                harvest.date ??
                                                                    "",
                                                            ) ?? ""
                                                        }
                                                        onChange={(e) => {
                                                            setValue(
                                                                index,
                                                                "date",
                                                                e.target.value,
                                                            )
                                                        }}
                                                    ></input>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        color="danger"
                                                        onPress={() => {
                                                            removeHarvest(index)
                                                        }}
                                                        isIconOnly
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                            <div className="flex gap-8 p-4 pt-0">
                                <Button
                                    color="primary"
                                    isIconOnly
                                    onPress={addNewHarvest}
                                >
                                    <FaPlus />
                                </Button>
                                <Button
                                    color="secondary"
                                    onPress={save}
                                    isLoading={saveHarvests.isPending}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                        <div className="block lg:hidden">
                            <div className="flex flex-col gap-4">
                                {localHarvests.map((harvest, index) => {
                                    return (
                                        <Fragment key={`mobile-${index}`}>
                                            <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:items-start md:grid-cols-4 md:justify-stretch md:gap-4">
                                                <Input
                                                    label="Name"
                                                    value={harvest.name ?? ""}
                                                    onValueChange={(e) => {
                                                        setValue(
                                                            index,
                                                            "name",
                                                            e,
                                                        )
                                                    }}
                                                />
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
                                                    <Input
                                                        label="Quantity"
                                                        type="number"
                                                        value={
                                                            harvest.quantity?.toString() ??
                                                            "0"
                                                        }
                                                        onValueChange={(e) => {
                                                            setValue(
                                                                index,
                                                                "quantity",
                                                                e,
                                                            )
                                                        }}
                                                    />
                                                    <div className="flex items-center justify-around gap-2">
                                                        <Button
                                                            size="md"
                                                            // isIconOnly
                                                            onPress={() => {
                                                                setValue(
                                                                    index,
                                                                    "quantity",
                                                                    (
                                                                        (harvest.quantity ??
                                                                            0) +
                                                                        1
                                                                    ).toString(),
                                                                )
                                                            }}
                                                        >
                                                            <FaPlus />
                                                        </Button>
                                                        <Button
                                                            size="md"
                                                            // isIconOnly
                                                            onPress={() => {
                                                                setValue(
                                                                    index,
                                                                    "quantity",
                                                                    (
                                                                        (harvest.quantity ??
                                                                            0) -
                                                                        1
                                                                    ).toString(),
                                                                )
                                                            }}
                                                        >
                                                            <FaMinus />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    <label htmlFor="date">
                                                        Date
                                                    </label>
                                                    <input
                                                        name="date"
                                                        type="date"
                                                        value={
                                                            parseIsoAndFormatInputDate(
                                                                harvest.date ??
                                                                    "",
                                                            ) ?? ""
                                                        }
                                                        onChange={(e) => {
                                                            setValue(
                                                                index,
                                                                "date",
                                                                e.target.value,
                                                            )
                                                        }}
                                                    ></input>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <Button
                                                        className="hidden sm:flex"
                                                        size="md"
                                                        color="danger"
                                                        onPress={() => {
                                                            removeHarvest(index)
                                                        }}
                                                        isIconOnly
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                    <Button
                                                        className="flex sm:hidden"
                                                        size="md"
                                                        color="danger"
                                                        onPress={() => {
                                                            removeHarvest(index)
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </div>
                                            <Divider />
                                        </Fragment>
                                    )
                                })}
                                <div className="flex items-center justify-around p-4 pt-0">
                                    <Button
                                        color="primary"
                                        onPress={addNewHarvest}
                                    >
                                        New
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onPress={save}
                                        isLoading={saveHarvests.isPending}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
