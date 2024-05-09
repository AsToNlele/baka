// Author: Alexandr Celakovsky - xcelak00
import { WorkingHourType } from "@/utils/types"
import { parseIsoAndFormatDateTime } from "@/utils/utils"
import {
    Card,
    CardBody,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react"
import { differenceInMinutes } from "date-fns/fp/differenceInMinutes"

type WorkingHourListProps = {
    data: Array<WorkingHourType>
}

export const WorkingHourList = ({ data }: WorkingHourListProps) => {
    return (
        <Card>
            <CardBody>
                <div className="flex flex-1 items-center justify-center">
                    <h4 className="text-center text-xl">Time worked</h4>
                </div>
                <Table
                    shadow="none"
                    isStriped
                    aria-label="Example static collection table"
                >
                    <TableHeader>
                        <TableColumn>From</TableColumn>
                        <TableColumn>To</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.map((workingHour, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {parseIsoAndFormatDateTime(
                                        workingHour.start!,
                                    )}
                                </TableCell>
                                <TableCell>
                                    {parseIsoAndFormatDateTime(
                                        workingHour.end!,
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TotalWorked data={data} />
            </CardBody>
        </Card>
    )
}

const TotalWorked = ({ data }: WorkingHourListProps) => {
    const totalMinutes = data.reduce((acc, workingHour) => {
        return (
            acc +
            differenceInMinutes(
                new Date(workingHour.start!),
                new Date(workingHour.end!),
            )
        )
    }, 0)

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return (
        <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-lg">
                Total: {hours}h {minutes}m
            </p>
        </div>
    )
}

type WorkingHourProps = {
    data: WorkingHourType
}

export const WorkingHour = ({ data }: WorkingHourProps) => {
    return (
        <div className="flex gap-4">
            <div>{parseIsoAndFormatDateTime(data.start!)}</div>
            <div>{parseIsoAndFormatDateTime(data.end!)}</div>
        </div>
    )
}
