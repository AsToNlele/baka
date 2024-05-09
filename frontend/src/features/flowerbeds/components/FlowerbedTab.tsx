// Author: Alexandr Celakovsky - xcelak00
import { useProfile } from "@/features/auth/hooks/useProfile"
import { CreateFlowerbedModal } from "@/features/flowerbeds/components/CreateFlowerbedModal"
import { FlowerbedList } from "@/features/flowerbeds/components/FlowerbedList"
import { FlowerbedType, GreenhouseType } from "@/utils/types"
import { Button, useDisclosure } from "@nextui-org/react"
import { FaPlus } from "react-icons/fa"

type FlowerbedTabProps = {
    flowerbeds: readonly FlowerbedType[]
    greenhouseId?: number | string // If not set, expect to be in My Flowerbeds page
    greenhouse: GreenhouseType
}

export const FlowerbedTab = ({
    flowerbeds,
    greenhouseId,
    greenhouse
}: FlowerbedTabProps) => {
    const { data: profile } = useProfile()

    const isCaretaker = profile?.caretaker_greenhouses.some(
        (g) => g.id === greenhouseId,
    )
    const isOwner = profile?.owned_greenhouses.some(
        (g) => g.id === greenhouseId,
    )
    const isSuperuser = profile?.superuser
    const hasAccess = isCaretaker || isOwner || isSuperuser

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    return (
        <div className="flex flex-col gap-4">
            {hasAccess && (
                <Button isIconOnly color="primary" size="sm" onPress={onOpen}>
                    <FaPlus />
                </Button>
            )}
            {
                flowerbeds.length === 0 && (
                    <div className="flex items-center justify-center">
                        No flowerbeds found
                    </div>
                )
            }
            <FlowerbedList
                flowerbeds={flowerbeds}
                greenhouse={greenhouse}
            />
            <CreateFlowerbedModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                greenhouseId={greenhouseId} />
        </div>
    )
}
