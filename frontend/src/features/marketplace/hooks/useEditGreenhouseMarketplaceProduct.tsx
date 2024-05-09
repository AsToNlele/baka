// Author: Alexandr Celakovsky - xcelak00
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
    const form_data = new FormData()
    form_data.append("product.name", data.product.name)
    form_data.append("product.description", data.product.description)
    form_data.append("price", data.price.toString())
    form_data.append("quantity", data.quantity.toString())
    if (data.product.image) {
        if (data.product.image instanceof File) {
            form_data.append(
                "product.image",
                data.product.image,
                data.product.image.name,
            )
        }
    } 
    return api.put(`/marketplace/marketplace-products/${id}/`, form_data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
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
