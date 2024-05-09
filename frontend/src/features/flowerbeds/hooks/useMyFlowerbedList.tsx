// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { FlowerbedListType } from "utils/types"

const myFlowerbedList = async () => {
    return api
        .get("/flowerbeds/my_flowerbeds/")
        .then((res) => res.data)
        .then((data: FlowerbedListType) => data)
}

export const useMyFlowerbedList = () => {
    const query = useQuery({
        queryKey: ["myFlowerbedList"],
        queryFn: myFlowerbedList,
        retry: 0,
    })
    return query
}
