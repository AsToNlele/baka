// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { SharedProductDetailResponse } from "utils/types"

const sharedProductDetail = async (id: number) => {
    return api
        .get(`/marketplace/shared-products/${id}`)
        .then((res) => res.data)
        .then((data: SharedProductDetailResponse) => data)
}

export const useSharedProductDetail = (id: number | null) => {
    const query = useQuery({
        queryKey: ["sharedProductDetail", id],
        queryFn: () => sharedProductDetail(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
