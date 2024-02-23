import { api } from "@/utils/api"
import { SharedProductListResponse } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

const sharedProductList = () => {
    return api
        .get("/marketplace/shared-products")
        .then((res) => res.data.results)
        .then((data: SharedProductListResponse) => data)
}

export const useSharedProductList = () => {
    const query = useQuery({
        queryKey: ["sharedProductList"],
        queryFn: sharedProductList,
    })
    return query
}
