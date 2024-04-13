import { CancelModal } from "@/features/timesheets/components/CancelModal"
import { ResubmitModal } from "@/features/timesheets/components/ResubmitModal"
import { TimesheetWithGreenhouseType } from "@/utils/types"
import { Button, useDisclosure } from "@nextui-org/react"

type ResubmitOrCloseTimesheetProps = {
    data: TimesheetWithGreenhouseType
}

export const ResubmitOrCloseTimesheet = ({
    data,
}: ResubmitOrCloseTimesheetProps) => {
    const { isOpen: isResubmitOpen, onOpen: onResubmitOpen, onClose: onResubmitClose, onOpenChange: onResubmitOpenChange } = useDisclosure()
    const { isOpen: isCloseOpen, onOpen: onCloseOpen, onClose: onCloseClose, onOpenChange: onCloseOpenChange } = useDisclosure()
    
    return (
        <>
            <div>
                <div className="flex justify-around gap-4">
                    <Button
                        variant="flat"
                        color="primary"
                        onPress={onResubmitOpen}
                    >
                        Resubmit
                    </Button>
                    <Button variant="flat" color="danger" onPress={onCloseOpen}>
                        Cancel
                    </Button>
                </div>
            </div>
            <ResubmitModal isOpen={isResubmitOpen} onOpenChange={onResubmitOpenChange} onClose={onResubmitClose} />
            <CancelModal isOpen={isCloseOpen} onOpenChange={onCloseOpenChange} onClose={onCloseClose} timesheet={data} />
        </>
    )
}
