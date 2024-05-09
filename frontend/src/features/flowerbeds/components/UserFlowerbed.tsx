// Author: Alexandr Celakovsky - xcelak00
import { Diary } from "@/features/flowerbeds/components/Diary"
import { Harvest } from "@/features/flowerbeds/components/Harvest"
import { Stats } from "@/features/flowerbeds/components/Stats"
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
            <div className="col-span-2 xl:col-span-1">
                <Diary
                    notes={userFlowerbed.notes}
                    flowerbedId={flowerbed.id!}
                />
            </div>
            <div className="col-span-2 xl:col-span-1">
                <Harvest
                    harvests={userFlowerbed.harvests}
                    flowerbedId={flowerbed.id!}
                />
            </div>
            <div className="col-span-2 xl:col-span-1">
                <Stats flowerbedId={flowerbed.id!} />
            </div>
        </>
    )
}
