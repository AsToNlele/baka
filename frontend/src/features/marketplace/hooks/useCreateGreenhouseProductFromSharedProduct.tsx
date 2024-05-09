// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { toast } from "sonner"
import { CreateGreenhouseProductFromSharedProductValidationType } from "@/features/marketplace/types"

const createGreenhouseProductFromSharedProduct = ({
    id,
    data,
}: {
    id: number
    data: CreateGreenhouseProductFromSharedProductValidationType
}) => {
    return api.post(
        `/marketplace/greenhouses/${id}/products/from-shared/`,
        data,
    )
}

export const useCreateGreenhouseProductFromSharedProduct = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: createGreenhouseProductFromSharedProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseProductList"],
            })
            toast.success("Greenhouse product created successfully")
        },
    })
    return mutation
}
