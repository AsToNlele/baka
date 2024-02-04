import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { EditGreenhouseRequest } from "@/utils/types"

const editGreenhouse = ({
    id,
    data,
}: {
    id: number | string
    data: EditGreenhouseRequest
}) => {
    return api.put(`/greenhouses/${id}/edit_greenhouse/`, data)
}

export const useEditGreenhouse = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: editGreenhouse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["greenhouseList", 1] })
        },
    })
    return mutation
}
