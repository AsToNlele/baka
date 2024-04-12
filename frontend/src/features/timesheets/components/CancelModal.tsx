import { useCancelTimesheet } from "@/features/timesheets/hooks/useCancelTimesheet"
import { TimesheetWithGreenhouseType } from "@/utils/types"
import {
    ModalContent,
    Modal,
    ModalBody,
    ModalHeader,
    Input,
    Button,
    ModalFooter,
} from "@nextui-org/react"
import { useState } from "react"
import { toast } from "sonner"

type CancelModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    timesheet: TimesheetWithGreenhouseType
}

export const CancelModal = ({
    isOpen,
    onOpenChange,
    onClose,
    timesheet,
}: CancelModalProps) => {
    const [message, setMessage] = useState("")
    const { mutate, isPending } = useCancelTimesheet()

    const handleClose = () => {
        mutate(
            { id: timesheet.id!, message: message },
            {
                onSuccess: () => {
                    toast.success("Timesheet cancelled")
                    onClose()
                },
            },
        )
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            scrollBehavior="inside"
            size="5xl"
            onClose={onClose}
        >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Cancel timesheet
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="mt-8 flex flex-1 flex-col gap-2">
                                <h2 className="text-base">Message</h2>
                                <Input
                                    type="text"
                                    placeholder="Your message (optional)"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="success"
                            variant="flat"
                            onPress={handleClose}
                            isLoading={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="default"
                            variant="flat"
                            onPress={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}
