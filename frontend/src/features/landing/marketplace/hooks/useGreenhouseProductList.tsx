import { api } from "@/utils/api"
import { GreenhouseProductListResponse } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

const greenhouseProductList = async (id: number) => {
    return api
        .get(`/marketplace/greenhouses/${id}/products`)
        .then((res) => res.data.results)
        .then((data: GreenhouseProductListResponse) => data)
}

export const useGreenhouseProductList = (id: number | null) => {
    const query = useQuery({
        queryKey: ["greenhouseProductList", id],
        queryFn: () => greenhouseProductList(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
