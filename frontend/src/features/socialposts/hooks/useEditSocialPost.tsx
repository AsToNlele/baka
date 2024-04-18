import { EditSocialPostValidation } from "@/features/socialposts/types"
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const editSocialPost = ({
    id,
    data,
}: {
    id: number
    data: EditSocialPostValidation
}) => {
    return api.put(`/socialposts/${id}/edit/`, data)
}

export const useEditSocialPost = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: editSocialPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["socialPostListMy"] })
            queryClient.invalidateQueries({ queryKey: ["socialPostListAll"] })
        },
    })
    return mutation
}
