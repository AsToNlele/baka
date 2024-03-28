import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { CreateProductOrderType } from "@/utils/types"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"


const createProductOrder = ({
    data,
}: {
    data: CreateProductOrderType
}) => {
    return api.post(`/marketplace/order/`, data)
}

export const useCreateProductOrder = () => {
    const { setCurrentStep, setOrderId } = useShoppingCartStore()
    const mutation = useMutation({
        mutationFn: createProductOrder,
        onSuccess: (resp) => {
            setCurrentStep("step3")
            console.log("RESPONSE", resp.data)
            setOrderId(resp.data.id)
        },
        onError: (error) => {
            console.log("ERROR", error)
        }
    })
    return mutation
}
