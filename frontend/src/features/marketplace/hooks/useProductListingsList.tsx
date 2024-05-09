// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { ProductListingsListResponse } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

const productListingsList = async (id: number) => {
    return api
        .get(`/marketplace/products/${id}/listings/`)
        .then((res) => res.data)
        .then((data: ProductListingsListResponse) => data)
}

export const useProductListingsList = (id: number | null) => {
    const query = useQuery({
        queryKey: ["productListingsList", id],
        queryFn: async () => productListingsList(id as number),
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
