// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { OrderDetailResponse } from "utils/types"

const orderDetail = async (id: number) => {
    return api
        .get(`/orders/${id}`)
        .then((res) => res.data)
        .then((data: OrderDetailResponse) => data)
}

export const useOrderDetail = (id: number | null) => {
    const query = useQuery({
        queryKey: ["OrderList", id],
        queryFn: () => orderDetail(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
