import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { GreenhouseDetailResponse } from "utils/types"

const greenhouseDetail = async (id: number) => {
    return api
        .get(`/greenhouses/${id}`)
        .then((res) => res.data)
        .then((data: GreenhouseDetailResponse) => data)
}

export const useGreenhouseDetail = (id: number | null) => {
    const query = useQuery({
        queryKey: ["greenhouseList", id],
        queryFn: () => greenhouseDetail(id as number),
        retry: 0,
        enabled: typeof id === 'number' && !isNaN(id),
    })
    return query
}
