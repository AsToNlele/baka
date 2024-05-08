import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { UserFlowerbedStatsType } from "utils/types"

const userFlowerbedStats = async (id: number) => {
    return api
        .get(`/flowerbeds/${id}/get_stats/`)
        .then((res) => res.data as UserFlowerbedStatsType)
}

export const useUserFlowerbedStats = (id: number | null) => {
    const query = useQuery({
        queryKey: ["userFlowerbedStats", id],
        queryFn: () => userFlowerbedStats(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
