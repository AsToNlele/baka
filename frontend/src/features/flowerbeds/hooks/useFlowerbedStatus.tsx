import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { FlowerbedStatusResponse } from "utils/types"

const flowerbedStatus = async (id: number) => {
    console.log('flowerbedStatus', id)
    let res = api
        .get(`/flowerbeds/${id}/status/`)
        .then((res) => res.data)
        .then((data: FlowerbedStatusResponse) => data)
    console.log('flowerbedStatus', res)
    return res
}

export const useFlowerbedStatus = (id: number | null) => {
    const query = useQuery({
        queryKey: ["flowerbedStatus", id],
        queryFn: () => flowerbedStatus(id as number),
        retry: 0,
        enabled: typeof id === 'number' && !isNaN(id),
    })
    return query
}
