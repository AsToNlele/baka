// Author: Alexandr Celakovsky - xcelak00
import { useGreenhouseImageUpload } from "@/features/greenhouses/hooks/useGreenhouseImageUpload"
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import { ChangeEvent, useRef } from "react"

type GreenhouseImageUploadModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
    greenhouseId: number | null
}

export const GreenhouseImageUploadModal = ({
    isOpen,
    onOpenChange,
    onClose,
    greenhouseId,
}: GreenhouseImageUploadModalProps) => {
    const greenhouseImageUpload = useGreenhouseImageUpload()
    const imageInputRef = useRef<HTMLInputElement>(null)
    if (!greenhouseId) return null

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Autoupload image on input
        const newUploadData = e?.target?.files?.[0]
        if (newUploadData) {
            greenhouseImageUpload.mutate(
                {
                    data: { image: newUploadData, greenhouseId },
                },
                {
                    onSuccess: () => onClose(),
                },
            )
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            scrollBehavior="inside"
            onClose={onClose}
        >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Upload Greenhouse Image
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex justify-center">
                            <Button
                                onPress={() => imageInputRef?.current?.click()}
                                color="secondary"
                                variant="flat"
                                isLoading={greenhouseImageUpload.isPending}
                            >
                                Upload Image
                                <input
                                    hidden
                                    type="file"
                                    name="image"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={(e) => {
                                        handleImageChange(e)
                                    }}
                                    ref={imageInputRef}
                                />
                            </Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}
