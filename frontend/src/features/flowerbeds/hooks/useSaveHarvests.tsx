// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { FlowerbedHarvestType } from "@/utils/types"

const saveHarvests = ({
    id,
    harvests,
}: {
    id: number | string
    harvests: Array<FlowerbedHarvestType>
}) => {
    const newHarvests = harvests.map((harvest) => ({
        name: harvest.name,
        quantity: harvest.quantity,
        date: harvest.date,
    }))

    return api.put(`/flowerbeds/${id}/set_harvests/`, {
        harvests: newHarvests,
    })
}

export const useSaveHarvests = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: saveHarvests,
        onSuccess: (data) => {
            console.log(data.data.id)
            console.log(data.data)
            queryClient.invalidateQueries({
                queryKey: ["userFlowerbed", data.data.flowerbed],
            })
            queryClient.invalidateQueries({
                queryKey: ["userFlowerbedStats", data.data.flowerbed],
            })
        },
    })
    return mutation
}
