import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { CreateGreenhouseValidationType } from "@/features/greenhouses/types"

const createGreenhouse = ({
    data,
}: {
    data: CreateGreenhouseValidationType
}) => {
    return api.post(`/greenhouses/create_greenhouse/`, data)
}

export const useCreateGreenhouse = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: createGreenhouse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["greenhouseList"] })
        },
    })
    return mutation
}
