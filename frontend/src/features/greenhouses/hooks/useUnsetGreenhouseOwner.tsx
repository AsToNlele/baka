import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const unsetGreenhouseOwner = ({ id }: { id: number | string }) => {
    return api.put(`/greenhouses/${id}/unset_owner/`)
}

export const useUnsetGreenhouseOwner = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: unsetGreenhouseOwner,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseList", data.data.id],
            })
        },
    })
    return mutation
}
