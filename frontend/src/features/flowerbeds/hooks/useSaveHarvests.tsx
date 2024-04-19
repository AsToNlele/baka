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
            queryClient.invalidateQueries({
                queryKey: ["userFlowerbed", data.data.id],
            })
        },
    })
    return mutation
}
