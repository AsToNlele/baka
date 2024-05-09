// Author: Alexandr Celakovsky - xcelak00
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { TimesheetWithGreenhouseType } from "utils/types"

const timesheetDetail = async (id: number) => {
    return api.get(`/timesheets/${id}`).then((res) => res.data as TimesheetWithGreenhouseType)
}

export const useTimesheetDetail = (id: number | null) => {
    const query = useQuery({
        queryKey: ["timesheetList", id],
        queryFn: () => timesheetDetail(id as number),
        retry: 0,
        enabled: typeof id === "number" && !isNaN(id),
    })
    return query
}
