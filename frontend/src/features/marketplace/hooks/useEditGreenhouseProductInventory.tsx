// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { EditGreenhouseProductInventoryRequest } from "@/utils/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const editGreenhouseProductInventory = ({
    id,
    data,
}: {
    id: number | string
    data: EditGreenhouseProductInventoryRequest
}) => {
    return api.put(`/marketplace/greenhouses/${id}/products/edit/`, data)
}

export const useEditGreenhouseProductInventory = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: editGreenhouseProductInventory,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseProductList", data.data.id],
            })
        },
    })
    return mutation
}
