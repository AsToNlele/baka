// Author: Alexandr Celakovsky - xcelak00
import { upperCaseFirstLetter } from "@/utils/utils"
import { Chip } from "@nextui-org/react"

type TimesheetStatusProps = {
    status: string
    size?: "sm" | "md" | "lg"
}
export const TimesheetStatus = ({
    status,
    size = "lg",
}: TimesheetStatusProps) => {
    switch (status) {
        case "submitted": {
            return (
                <Chip variant="flat" color="secondary" size={size}>
                    Submitted
                </Chip>
            )
        }
        case "approved": {
            return (
                <Chip variant="flat" color="success" size={size}>
                    Approved
                </Chip>
            )
        }
        case "rejected": {
            return (
                <Chip variant="flat" color="danger" size={size}>
                    Rejected
                </Chip>
            )
        }
        case "cancelled": {
            return (
                <Chip variant="flat" color="warning" size={size}>
                    Cancelled
                </Chip>
            )
        }
        default: {
            return (
                <Chip variant="flat" color="default" size={size}>
                    {upperCaseFirstLetter(status)}
                </Chip>
            )
        }
    }
}
