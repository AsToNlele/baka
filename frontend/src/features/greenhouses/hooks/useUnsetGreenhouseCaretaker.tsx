// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const unsetGreenhouseCaretaker = ({ id }: { id: number | string }) => {
    return api.put(`/greenhouses/${id}/unset_caretaker/`)
}

export const useUnsetGreenhouseCaretaker = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: unsetGreenhouseCaretaker,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseList", data.data.id],
            })
        },
    })
    return mutation
}
