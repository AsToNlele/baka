import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const changeStatusSocialPost = ({
    id,
    data,
}: {
    id: number
    data: {
            approved: boolean
        }
}) => {
    return api.put(`/socialposts/${id}/edit/`, data)
}

export const useChangeStatusSocialPost = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: changeStatusSocialPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["socialPostListMy"] })
            queryClient.invalidateQueries({ queryKey: ["socialPostListAll"] })
        },
    })
    return mutation
}
