import { EditGreenhouseMarketplaceProductRequestValidationType } from "@/features/marketplace/types"
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const editGreenhouseMarketplaceProduct = ({
    id,
    data,
}: {
    id: number | string
    data: EditGreenhouseMarketplaceProductRequestValidationType
}) => {
    return api.put(`/marketplace/marketplace-products/${id}/`, data)
}

export const useEditGreenhouseMarketplaceProduct = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: editGreenhouseMarketplaceProduct,
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
