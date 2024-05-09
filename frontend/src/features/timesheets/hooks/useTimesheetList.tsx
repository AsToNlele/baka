// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { TimesheetListResponse } from "utils/types"

const timesheetList = async () => {
    return api
        .get("/timesheets")
        .then((res) => res.data as TimesheetListResponse)
}

export const useTimesheetList = () => {
    const query = useQuery({
        queryKey: ["timesheetList"],
        queryFn: timesheetList,
        retry: 0,
    })
    return query
}
