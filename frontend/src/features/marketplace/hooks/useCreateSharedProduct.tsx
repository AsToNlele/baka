import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { toast } from "sonner"
import { CreateSharedProductValidationType } from "@/features/marketplace/types"

const createSharedProduct = ({
    data,
}: {
    data: CreateSharedProductValidationType & { image: File | null }
}) => {
    const form_data = new FormData()
    form_data.append("name", data.name)
    form_data.append("description", data.description)
    if (data.image) form_data.append("image", data.image, data.image.name)
    else {
        form_data.append("image", "")
    }

    return api.post(`/marketplace/shared-products/`, form_data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
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
