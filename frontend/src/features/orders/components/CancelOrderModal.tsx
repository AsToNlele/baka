import { Modal, ModalHeader, ModalBody, ModalFooter, Button, ModalContent } from "@nextui-org/react"

export const CancelOrderModal = ({
    isOpen,
    onClose,
    onOpenChange,
    orderId,
}: {
    isOpen: boolean
    onClose: () => void
    onOpenChange: (open: boolean) => void
    orderId: number | null
}) => {
    // const { mutate } = useCancelOrder()

    const handleCancel = () => {
        if (orderId) {
            // mutate(orderId)
            // onClose()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}
            placement="center"
            scrollBehavior="inside"
            size="xl"
        >
            <ModalContent>
                <ModalHeader title="Cancel Order" />
                <ModalBody>
                    <p>Are you sure you want to cancel this order?</p>
                    <p>
                        <strong>Order ID:</strong> {orderId}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" color="danger" onPress={handleCancel}>
                        Cancel Order
                    </Button>
                    <Button variant="flat" onPress={() => onOpenChange(false)}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
