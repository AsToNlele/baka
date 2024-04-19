import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const deleteGreenhouseMarketplaceProduct = ({
    id,
}: {
    id: number | string
}) => {
    return api.delete(`/marketplace/marketplace-products/${id}/delete`)
}

export const useDeleteGreenhouseMarketplaceProduct = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: deleteGreenhouseMarketplaceProduct,
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