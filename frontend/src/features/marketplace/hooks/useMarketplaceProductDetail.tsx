import { ShoppingCartMarketplaceItem } from "@/features/marketplace/types"
import { api } from "@/utils/api"
import { GreenhouseDetailProductType } from "@/utils/types"
import { useQueries, useQuery } from "@tanstack/react-query"

const MarketplaceProductDetail = (id: number) => {
    return api.get(`/marketplace/product/${id}`)
    .then((res) => res.data as GreenhouseDetailProductType)
}

export const useMarketplaceProductDetail = (id: number | undefined) => {
    useQuery({
        queryKey: ["marketplaceProductDetail", id],
        queryFn: () => MarketplaceProductDetail(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
}

export const useMarketplaceProductDetails = (
    items: Array<ShoppingCartMarketplaceItem>,
) => {
    const query = useQueries({
        queries: items.map((item) => ({
            queryKey: ["marketplaceProductDetail", item.marketplaceProduct],
            queryFn: () => MarketplaceProductDetail(item.marketplaceProduct),
        })),
    })

    return query
}
