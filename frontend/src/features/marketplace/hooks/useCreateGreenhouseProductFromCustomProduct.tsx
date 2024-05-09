// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { toast } from "sonner"
import { CreateGreenhouseProductFromCustomProductValidationType } from "@/features/marketplace/types"

const createGreenhouseProductFromCustomProduct = ({
    id,
    data,
}: {
    id: number
    data: CreateGreenhouseProductFromCustomProductValidationType
}) => {
    const form_data = new FormData()
    form_data.append("product.name", data.product.name)
    form_data.append("product.description", data.product.description)
    form_data.append("price", data.price.toString())
    form_data.append("quantity", data.quantity.toString())
    if (data.product.image)
        form_data.append(
            "product.image",
            data.product.image,
            data.product.image.name,
        )
    else {
        form_data.append("image", "")
    }

    return api.post(
        `/marketplace/greenhouses/${id}/products/from-custom/`,
        form_data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    )
}

export const useCreateGreenhouseProductFromCustomProduct = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: createGreenhouseProductFromCustomProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseProductList"],
            })
            toast.success("Greenhouse product created successfully")
        },
    })
    return mutation
}
