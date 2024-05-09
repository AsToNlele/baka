// Author: Alexandr Celakovsky - xcelak00
import { TimesheetItemType } from "@/utils/types"
import { Card, CardBody, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"

type TimesheetItemListProps = {
    data: Array<TimesheetItemType>
}

export const TimesheetItemList = ({ data }: TimesheetItemListProps) => {
    return (
        <Card>
            <CardBody>
                <div className="flex flex-1 items-center justify-center">
                    <h4 className="text-center text-xl">Jobs</h4>
                </div>
                <Table shadow="none" isStriped aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Description</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.map((timesheetItem, index) => (
                            <TableRow key={index}>
                                <TableCell>{timesheetItem.title}</TableCell>
                                <TableCell>{timesheetItem.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </CardBody>
        </Card>
    )
}

type TimesheetItemProps = {
    data: TimesheetItemType
}

export const TimesheetItem = ({ data }: TimesheetItemProps) => {
    return (
        <div className="flex gap-4">
            <div>{data.title}</div>
            <div>{data.description}</div>
        </div>
    )
}
