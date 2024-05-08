import { useMultistepFormStore } from "@/features/flowerbeds/stores/useRentMultistepFormStore"
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

type Inputs = {
    rented_from: string
    rented_to: string
    discount_code?: string
}

export type RentFlowerbedResponse = {
    id: number
    order: {
        id: number
        status: string
        created_at: string
        final_price: string
        rent: number
        user: number
        discounts: []
    }
    rented_from: string
    rented_to: string
    flowerbed: number
    user: number
}

const rent = ({
    id,
    data,
}: {
    id: number | string
    data: Inputs
    /* eslint-disable  @typescript-eslint/no-explicit-any */
}): Promise<AxiosResponse<any, RentFlowerbedResponse>> => {
    return api.put(`/flowerbeds/${id}/extend_rent/`, data)
}

export const useExtendRentFlowerbed = () => {
    const { setCurrentStep, setOrderId } = useMultistepFormStore()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: rent,
        onSuccess: (resp) => {
            setCurrentStep("step3")
            console.log("RESPONSE", resp.data)
            queryClient.invalidateQueries({
                queryKey: ["flowerbedStatus", resp.data.flowerbed!.toString()],
            })
            setOrderId(resp.data.order.id)
        },
    })
    return mutation
}
