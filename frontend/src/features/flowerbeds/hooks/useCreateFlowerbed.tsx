// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { CreateFlowerbedValidationType } from "@/features/flowerbeds/types"

const createFlowerbed = ({ data }: { data: CreateFlowerbedValidationType }) => {
    return api
        .post(`/flowerbeds/`, data)
        .then((res) => res.data as CreateFlowerbedValidationType)
}

export const useCreateFlowerbed = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: createFlowerbed,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["greenhouseList", data.greenhouse],
            })
        },
    })
    return mutation
}
