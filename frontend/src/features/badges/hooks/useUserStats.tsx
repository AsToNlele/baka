import { api } from "@/utils/api"
import { UserStatsResponse } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

const userStats = async () => {
    return api.get("/user-stats/").then((res) => res.data as UserStatsResponse)
}

export const useUserStats = () => {
    const query = useQuery({
        queryKey: ["userStats"],
        queryFn: userStats,
        retry: 0,
    })
    return query
}
