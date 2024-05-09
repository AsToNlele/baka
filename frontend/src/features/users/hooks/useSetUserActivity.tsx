// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { SetUserActivityRequest } from "@/utils/types"

const setUserActivity = ({
    id,
    data,
}: {
    id: number | string
    data: SetUserActivityRequest
}) => {
    return api.post(`/users/${id}/set_activity/`, data)
}

export const useSetUserActivity= () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: setUserActivity,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["userList", data.data.profile.id] })
        },
    })
    return mutation
}
