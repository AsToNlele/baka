import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { OrderPaymentResponse } from "utils/types"

const orderPayment = async (id: number) => {
    return api
        .get(`/orders/${id}/get_payment`)
        .then((res) => res.data)
        .then((data: OrderPaymentResponse) => data)
}

export const useOrderPayment = (id: number | null) => {
    const query = useQuery({
        queryKey: ["OrderPayment", id],
        queryFn: () => orderPayment(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
