// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { BadgeRarityListResponse } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

const badgeRarity = async () => {
    return api
        .get("/badge-rarity/")
        .then((res) => res.data as BadgeRarityListResponse)
}

export const useBadgeRarity = () => {
    const query = useQuery({
        queryKey: ["badgeRarity"],
        queryFn: badgeRarity,
        retry: 0,
    })
    return query
}
