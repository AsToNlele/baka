import { useApproveTimesheet } from "@/features/timesheets/hooks/useApproveTimesheet"
import { useRejectTimesheet } from "@/features/timesheets/hooks/useRejectTimesheet"
import { TimesheetWithGreenhouseType } from "@/utils/types"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useState } from "react"
import { toast } from "sonner"

type ApproveRejectTimesheetProps = {
    data: TimesheetWithGreenhouseType
}

export const ApproveRejectTimesheet = ({ data }: ApproveRejectTimesheetProps) => {
    const { isOpen: isApproveOpen, onOpen: onApproveOpen, onClose: onApproveClose, onOpenChange: onApproveOpenChange } = useDisclosure()
    const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose, onOpenChange: onRejectOpenChange } = useDisclosure()
    return (
        <>
            <div>
                <div className="flex justify-around gap-4">
                    <Button variant="flat" color="success" onPress={onApproveOpen}>Approve</Button>
                    <Button variant="flat" color="danger" onPress={onRejectOpen}>Reject</Button>
                </div>
            </div>
            <ApproveModal isOpen={isApproveOpen} onOpenChange={onApproveOpenChange} onClose={onApproveClose} timesheet={data} />
            <RejectModal isOpen={isRejectOpen} onOpenChange={onRejectOpenChange} onClose={onRejectClose} timesheet={data} />
        </>
    )
}

type ApproveModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    timesheet: TimesheetWithGreenhouseType
}

export const ApproveModal = ({
    isOpen,
    onOpenChange,
    onClose,
    timesheet
}: ApproveModalProps) => {
    const [message, setMessage] = useState("")
    const {mutate, isPending} = useApproveTimesheet()

    const handleApprove = () => {
        mutate({ id: timesheet.id!, message: message }, {
            onSuccess: () => {
                toast.success("Timesheet approved")
                onClose()
            }
        })
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
                        Approve timesheet
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
                        <Button color="success" variant="flat" onPress={handleApprove} isLoading={isPending}>
                            Approve
                        </Button>
                        <Button color="default" variant="flat" onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    ) 
}

type RejectModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    timesheet: TimesheetWithGreenhouseType
}

const RejectModal = ({
    isOpen,
    onOpenChange,
    onClose,
    timesheet
}: RejectModalProps) => {
    const [message, setMessage] = useState("")
    const {mutate, isPending} = useRejectTimesheet()
    
    const handleReject = () => {
        mutate({ id: timesheet.id!, message: message }, {
            onSuccess: () => {
                toast.success("Timesheet rejected")
                onClose()
            }
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            scrollBehavior="inside"
            size="5xl"
            onClose={onClose}
        >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Reject timesheet
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
                        <Button color="success" variant="flat" onPress={handleReject} isLoading={isPending}>
                            Reject
                        </Button>
                        <Button color="default" variant="flat" onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    ) 
}

