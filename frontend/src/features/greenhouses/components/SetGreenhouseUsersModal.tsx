import { useProfile } from "@/features/auth/hooks/useProfile"
import { useGreenhouseDetail } from "@/features/greenhouses/hooks/useGreenhouseDetail"
import { useSetGreenhouseCaretaker } from "@/features/greenhouses/hooks/useSetGreenhouseCaretaker"
import { useSetGreenhouseOwner } from "@/features/greenhouses/hooks/useSetGreenhouseOwner"
import { useUnsetGreenhouseCaretaker } from "@/features/greenhouses/hooks/useUnsetGreenhouseCaretaker"
import { useUnsetGreenhouseOwner } from "@/features/greenhouses/hooks/useUnsetGreenhouseOwner"
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

type SetGreenhouseUsersModalProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void
}

export const SetGreenhouseUsersModal = ({
    isOpen,
    onOpenChange,
    onClose,
}: SetGreenhouseUsersModalProps) => {
    const { id } = useParams()

    const greenhouseId = (id ? parseInt(id) : null) as number
    const { data } = useGreenhouseDetail(greenhouseId)
    const { data: user } = useProfile()
    const setOwner = useSetGreenhouseOwner()
    const unsetOwner = useUnsetGreenhouseOwner()
    const setCaretaker = useSetGreenhouseCaretaker()
    const unsetCaretaker = useUnsetGreenhouseCaretaker()

    console.log({ data })
    
    const isCaretaker = () => user?.profile?.id === data?.caretaker
    const isOwner = () => user?.profile?.id === data?.owner
    const isAdmin = () => user?.superuser

    const saveOwner = () => {
        setOwner.mutate(
            {
                id: greenhouseId,
                data: { owner: ownerId! },
            },
            {
                onSuccess: () => {
                    toast.success("Owner updated successfully")
                },
            },
        )
    }

    const removeOwner = () => {
        unsetOwner.mutate(
            { id: greenhouseId },
            {
                onSuccess: () => {
                    toast.success("Owner removed successfully")
                },
            },
        )
    }

    const saveCaretaker = () => {
        setCaretaker.mutate(
            {
                id: greenhouseId,
                data: { caretaker: caretakerId! },
            },
            {
                onSuccess: () => {
                    toast.success("Caretaker updated successfully")
                },
            },
        )
    }

    const removeCaretaker = () => {
        unsetCaretaker.mutate(
            { id: greenhouseId },
            {
                onSuccess: () => {
                    toast.success("Caretaker removed successfully")
                },
            },
        )
    }

    const [ownerId, setOwnerId] = useState<number | null>(null)
    const [caretakerId, setCaretakerId] = useState<number | null>(null)

    // Reset modal on open
    useEffect(() => {
        console.log(data)
        if (isOpen) {
            console.log("UPDATING")
            setOwnerId(data?.owner ?? null)
            setCaretakerId(data?.caretaker ?? null)
        }
    }, [isOpen, data])

    if (!greenhouseId) return null

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
                        User management
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="mt-8 flex flex-1 flex-col gap-2">
                                <h2 className="text-base">Owner ID</h2>
                                <Input
                                    type="number"
                                    placeholder="User ID"
                                    value={ownerId?.toString() ?? ""}
                                    onChange={(e) =>
                                        setOwnerId(parseInt(e.target.value))
                                    }
                                />
                                <Button
                                    color="success"
                                    variant="flat"
                                    onPress={saveOwner}
                                    isDisabled={!isAdmin()}
                                >
                                    Save
                                </Button>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={removeOwner}
                                    isDisabled={!isAdmin() && !isOwner()}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className="mt-8 flex flex-1 flex-col gap-2">
                                <h2 className="text-base">Caretaker ID</h2>
                                <Input
                                    type="number"
                                    placeholder="User ID"
                                    value={caretakerId?.toString() ?? ""}
                                    onChange={(e) =>
                                        setCaretakerId(parseInt(e.target.value))
                                    }
                                />
                                <Button
                                    color="success"
                                    variant="flat"
                                    onPress={saveCaretaker}
                                    isDisabled={!isAdmin() && !isOwner()}
                                >
                                    Save
                                </Button>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={removeCaretaker}
                                    isDisabled={!isAdmin() && !isOwner() && !isCaretaker()}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    )
}
