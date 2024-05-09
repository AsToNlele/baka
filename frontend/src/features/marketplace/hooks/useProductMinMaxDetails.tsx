// Author: Alexandr Celakovsky - xcelak00
import { ShoppingCartProductItem} from "@/features/marketplace/types"
import { api } from "@/utils/api"
import { ProductMinMaxPriceType } from "@/utils/types"
import { useQueries, useQuery } from "@tanstack/react-query"

const ProductMinMaxDetails = (id: number) => {
    return api.get(`/marketplace/products/${id}/minmax`)
    .then((res) => res.data as ProductMinMaxPriceType)
}

export const useMarketplaceProductDetail = (id: number | undefined) => {
    useQuery({
        queryKey: ["marketplaceProductDetail", id],
        queryFn: () => ProductMinMaxDetails(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
}

export const useProductMinMaxDetails = (
    items: Array<ShoppingCartProductItem>,
) => {
    const query = useQueries({
        queries: items.map((item) => ({
            queryKey: ["product", item.product],
            queryFn: () => ProductMinMaxDetails(item.product),
        })),
    })

    return query
}
