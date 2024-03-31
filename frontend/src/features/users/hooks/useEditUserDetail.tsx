import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { EditUserDetailType } from "@/features/users/types"

const editUserDetail = ({
    id,
    data,
}: {
    id: number | string
    data: EditUserDetailType
}) => {
    return api.post(`/users/${id}/edit/`, data)
}

export const useEditUserDetail = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: editUserDetail,
        onSuccess: (data) => {
            console.log("INVALIDATING", data)
            queryClient.invalidateQueries({ queryKey: ["userList", data.data.profile.id] })
        },
    })
    return mutation
}
