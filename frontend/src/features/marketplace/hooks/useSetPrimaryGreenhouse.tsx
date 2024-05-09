// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import {
    SetPrimaryGreenhouseInput,
    SetPrimaryGreenhouseResponse,
} from "@/utils/types"

const setPrimaryGreenhouse = async (data: SetPrimaryGreenhouseInput) => {
    return api
        .post(`/marketplace/set-primary-greenhouse/`, data)
        .then((res) => res.data as SetPrimaryGreenhouseResponse)
}

export const useSetPrimaryGreenhouse = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: setPrimaryGreenhouse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] })
        },
    })
    return mutation
}
