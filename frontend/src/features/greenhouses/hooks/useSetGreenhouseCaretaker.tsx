// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { SetCaretakerRequest } from "@/utils/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const setGreenhouseCaretaker = ({
    id,
    data,
}: {
    id: number | string
    data: SetCaretakerRequest
}) => {
    return api.put(`/greenhouses/${id}/set_caretaker/`, data)
}

export const useSetGreenhouseCaretaker = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: setGreenhouseCaretaker,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseList", data.data.id],
            })
        },
    })
    return mutation
}
