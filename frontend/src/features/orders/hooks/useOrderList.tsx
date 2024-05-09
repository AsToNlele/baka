// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { OrdersListResponse } from "utils/types"

const orderList = async () => {
    return api
        .get("/orders")
        .then((res) => res.data)
        .then((data: OrdersListResponse) => data)
}

export const useOrderList = () => {
    const query = useQuery({
        queryKey: ["orderList"],
        queryFn: orderList,
        retry: 0,
    })
    return query
}
