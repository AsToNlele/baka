// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { ProductDetailResponse } from "utils/types"

const productDetail = async (id: number) => {
    return api
        .get(`/marketplace/products/${id}`)
        .then((res) => res.data)
        .then((data: ProductDetailResponse) => data)
}

export const useProductDetail = (id: number | null) => {
    const query = useQuery({
        queryKey: ["productDetail", id],
        queryFn: () => productDetail(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
