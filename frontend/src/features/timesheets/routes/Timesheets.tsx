// Author: Alexandr Celakovsky - xcelak00
import { PageTitle } from "@/features/app/components/PageTitle"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { CreateTimesheetModal } from "@/features/timesheets/components/CreateTimesheetModal"
import { TimesheetStatus } from "@/features/timesheets/components/TimesheetStatus"
import { useTimesheetList } from "@/features/timesheets/hooks/useTimesheetList"
import { TimesheetWithGreenhouseType } from "@/utils/types"
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Button,
    useDisclosure,
} from "@nextui-org/react"
import { FaPlus } from "react-icons/fa"
import { Link } from "react-router-dom"

type TimesheetProps = {
    timesheet: TimesheetWithGreenhouseType
}

export const Timesheet = ({ timesheet }: TimesheetProps) => {
    return (
        <Link to={`/app/timesheets/${timesheet.id}`}>
            <Card>
                <CardHeader className="flex gap-8">
                    <h2 className="text-lg">{timesheet.title}</h2>
                    <TimesheetStatus status={timesheet.status!} size="md" />
                    <p className="text-sm">{timesheet.author.user}</p>
                    <p className="text-sm">ID: {timesheet.id}</p>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="flex gap-4">
                        <div className="flex-col">
                            <p>Greenhouse: {timesheet.greenhouse.title}</p>
                            {/* <p>Flowerbed: {order.rent.flowerbed.name}</p> */}
                        </div>
                        <div className="flex-col"></div>
                    </div>
                    {timesheet.description && (
                        <div className="flex gap-4">
                            <p>Description: {timesheet.description}</p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </Link>
    )
}

export const Timesheets = () => {
    const { data, isLoading } = useTimesheetList()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    const { data: profileData } = useProfile()
    const isCaretaker =
        profileData && profileData?.caretaker_greenhouses?.length > 0
    return (
        <div>
            <div className="flex gap-2">
                <PageTitle title="Timesheets" />
                {isCaretaker && (
                    <Button
                        color="success"
                        variant="flat"
                        isIconOnly
                        onPress={onOpen}
                    >
                        <FaPlus />
                    </Button>
                )}
            </div>
            <div className="mt-4 flex flex-col gap-2">
                {isLoading && <p>Loading...</p>}
                {data?.map((timesheet) => (
                    <Timesheet key={timesheet.id} timesheet={timesheet} />
                ))}
            </div>
            <CreateTimesheetModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
            />
        </div>
    )
}
