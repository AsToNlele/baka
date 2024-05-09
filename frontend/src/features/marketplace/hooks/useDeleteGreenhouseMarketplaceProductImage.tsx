// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const deleteGreenhouseMarketplaceProductImage = ({
    id,
}: {
    id: number | string
}) => {
    return api.delete(`/marketplace/marketplace-products/${id}/delete-image/`)
}

export const useDeleteGreenhouseMarketplaceProductImage = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: deleteGreenhouseMarketplaceProductImage,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseProductList", data.data.greenhouse],
            })
            queryClient.invalidateQueries({
                queryKey: ["productList"],
            })
        },
    })
    return mutation
}
