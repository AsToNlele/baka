import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { GetPickupOptionsInput, GetPickupOptionsOutput } from "@/utils/types"

const getPickupOptions = async (data: GetPickupOptionsInput) => {
    return api
        .post(`/marketplace/pickup-options/`, data)
        .then((res) => res.data as GetPickupOptionsOutput)
}

export const useGetPickupOptions = () => {
    const mutation = useMutation({
        mutationFn: getPickupOptions,
    })
    return mutation
}
