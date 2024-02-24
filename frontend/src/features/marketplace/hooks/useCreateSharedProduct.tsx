import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { toast } from "sonner"
import { CreateSharedProductValidationType } from "@/features/marketplace/components/CreateSharedProductModal"

const createSharedProduct = ({
    data,
}: {
    data: CreateSharedProductValidationType
}) => {
    return api.post(`/marketplace/shared-products/`, data)
}

export const useCreateSharedProduct = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: createSharedProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productList"] })
            toast.success("Shared product created successfully")
        },
    })
    return mutation
}
