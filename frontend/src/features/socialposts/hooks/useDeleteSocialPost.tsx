import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const deleteSocialPost = (id: number) => {
    return api.delete(`/socialposts/${id}/` )
}

export const useDeleteSocialPost = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: deleteSocialPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["socialPostListMy"] })
            queryClient.invalidateQueries({ queryKey: ["socialPostListAll"] })
        },
    })
    return mutation
}
