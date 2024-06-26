// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { ProductListResponse } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

const productList = () => {
    return api
        .get("/marketplace/products")
        .then((res) => res.data)
        .then((data: ProductListResponse) => data)
}

export const useProductList = () => {
    const query = useQuery({
        queryKey: ["productList"],
        queryFn: productList,
    })
    return query
}
