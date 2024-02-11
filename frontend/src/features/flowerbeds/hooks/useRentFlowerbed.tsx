import { useMultistepFormStore } from "@/features/flowerbeds/stores/useMultistepFormStore"
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
// import { useNavigate } from "react-router-dom"

type Inputs = {
    rented_from: string
    rented_to: string
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
    id: Number | string
    data: Inputs
}): Promise<AxiosResponse<any,RentFlowerbedResponse>> => {
    return api.post(`/flowerbeds/${id}/rent/`, data)
}

export const useRentFlowerbed = () => {
    const { setCurrentStep } = useMultistepFormStore()
    // const navigate = useNavigate()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: rent,
        onSuccess: (resp) => {
            setCurrentStep("step3")
            console.log("RESPONSE", resp.data)
            // navigate("/")
            queryClient.invalidateQueries({
                queryKey: ["flowerbedStatus", resp.data.flowerbed!.toString()],
            })
            // toast.success("Signed out successfully")
        },
    })
    return mutation
}
