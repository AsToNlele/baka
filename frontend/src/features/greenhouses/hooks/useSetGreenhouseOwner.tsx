import { api } from "@/utils/api"
import { SetOwnerRequest } from "@/utils/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const setGreenhouseOwner = ({
    id,
    data,
}: {
    id: number | string
    data: SetOwnerRequest
}) => {
    return api.put(`/greenhouses/${id}/set_owner/`, data)
}

export const useSetGreenhouseOwner = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: setGreenhouseOwner,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseList", data.data.id],
            })
        },
    })
    return mutation
}
