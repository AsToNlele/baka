// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { GreenhouseListResponse } from "utils/types"

const myGreenhouseList = async () => {
    return api
        .get("/greenhouses/my_greenhouses/")
        .then((res) => res.data)
        .then((data: GreenhouseListResponse) => data)
}

export const useMyGreenhouseList = () => {
    const query = useQuery({
        queryKey: ["myGreenhouseList"],
        queryFn: myGreenhouseList,
        retry: 0,
    })
    return query
}
