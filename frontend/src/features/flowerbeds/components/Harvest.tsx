import { useSaveHarvests } from "@/features/flowerbeds/hooks/useSaveHarvests"
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
} from "@nextui-org/react"
import { fromZonedTime } from "date-fns-tz"
import { useEffect, useState } from "react"
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa"
import { toast } from "sonner"

type HarvestProps = {
    harvests: Array<FlowerbedHarvestType>
    flowerbedId?: number
}

export const Harvest = ({ harvests, flowerbedId }: HarvestProps) => {
    const saveHarvests = useSaveHarvests()
    const [localHarvests, setLocalHarvests] =
        useState<Array<FlowerbedHarvestType>>(harvests)

    useEffect(() => {
        if (harvests && harvests.length > 0) {
            setLocalHarvests(harvests)
        }
    }, [harvests])

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
        <div className="max-h-80 min-h-80 w-full">
            <h1 className="mb-2 text-lg font-semibold">Harvest</h1>
            <Card>
                <CardBody>
                    <div>
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
                                            <TableCell className="p-0">
                                                <input
                                                    className="rounded-lg border-2 border-black p-0 px-1"
                                                    value={harvest.name ?? ""}
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
                                                <div className="flex flex-wrap items-center justify-center gap-2">
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
                                                                e.target.value,
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
                                                            harvest.date ?? "",
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
                </CardBody>
            </Card>
        </div>
    )
}
