import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { EditSelfValidationType } from "@/features/users/types"

const editSelf = (data: EditSelfValidationType) => {
    return api.put(`/edit-self/`, data)
}

export const useEditSelf = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: editSelf,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile"],
            })
        },
    })
    return mutation
}
