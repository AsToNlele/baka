import { Diary } from "@/features/flowerbeds/components/Diary"
import { FlowerbedDetailResponse, UserFlowerbedType } from "@/utils/types"

type UserFlowerbedProps = {
    userFlowerbed: UserFlowerbedType
    flowerbed: FlowerbedDetailResponse
}

export const UserFlowerbed = ({
    userFlowerbed,
    flowerbed,
}: UserFlowerbedProps) => {
    return (
        <>
            <div className="flex-1">
                <Diary
                    notes={userFlowerbed.notes}
                    flowerbedId={flowerbed.id!}
                />
            </div>
            <div className="flex-1"></div>
        </>
    )
}