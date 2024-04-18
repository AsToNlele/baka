import { CreateSocialPostValidation } from "@/features/socialposts/types"
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const createSocialPost = (data: CreateSocialPostValidation) => {
    return api.post(`/socialposts/`, data)
}

export const useCreateSocialPost = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: createSocialPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["socialPostListMy"] })
            queryClient.invalidateQueries({ queryKey: ["socialPostListAll"] })
        },
    })
    return mutation
}
