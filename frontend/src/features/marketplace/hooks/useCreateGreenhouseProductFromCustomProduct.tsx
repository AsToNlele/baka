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
    return api.post(
        `/marketplace/greenhouses/${id}/products/from-custom/`,
        data,
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
