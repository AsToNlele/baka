import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { GreenhouseListResponse } from "utils/types"

const greenhouseList = async () => {
    return api.get("/greenhouses").then((res) => res.data).then((data: GreenhouseListResponse) => data)
}

export const useGreenhouseList = () => {
    const query = useQuery({
        queryKey: ["greenhouseList"],
        queryFn: greenhouseList,
        retry: 0,
    })
    return query
}
