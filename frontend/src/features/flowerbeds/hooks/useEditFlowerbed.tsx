import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { EditFlowerbedValidationType } from "@/features/flowerbeds/types"

const editFlowerbed = ({ id, data }: { id: number | string, data: EditFlowerbedValidationType }) => {
    return api.put(`/flowerbeds/${id}/`, data)
}

export const useEditFlowerbed = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: editFlowerbed,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["flowerbedList", data.data.id],
            })
        },
    })
    return mutation
}
