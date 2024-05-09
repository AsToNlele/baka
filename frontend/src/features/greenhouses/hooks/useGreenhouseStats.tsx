// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { GreenhouseStatsType } from "utils/types"

const greenhouseStats = async (id: number, month: number, year: number) => {
    return api
        .get(`/greenhouses/${id}/get_statistics/?month=${month}&year=${year}`)
        .then((res) => res.data)
        .then((data: GreenhouseStatsType) => data)
}

export const useGreenhouseStats = (id: number | null, month: number, year: number) => {
    const query = useQuery({
        queryKey: ["greenhouseStats", id, month, year],
        queryFn: () => greenhouseStats(id as number, month, year),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
