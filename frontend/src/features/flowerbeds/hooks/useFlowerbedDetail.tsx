// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { FlowerbedDetailResponse } from "utils/types"

const flowerbedDetail = async (id: number) => {
    return api
        .get(`/flowerbeds/${id}`)
        .then((res) => res.data)
        .then((data: FlowerbedDetailResponse) => data)
}

export const useFlowerbedDetail = (id: number | null) => {
    const query = useQuery({
        queryKey: ["flowerbedList", id],
        queryFn: () => flowerbedDetail(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
