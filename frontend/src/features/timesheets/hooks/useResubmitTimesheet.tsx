// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { ResubmitTimesheetValidationType } from "@/features/timesheets/utils/types"

const resubmitTimesheet = ({
    id,
    data,
}: {
    id: number | string
    data: ResubmitTimesheetValidationType
}) => {
    return api.put(`/timesheets/${id}/update_timesheet/`, {
        ...data,
        status: "submitted",
    })
}

export const useResubmitTimesheet = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: resubmitTimesheet,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["timesheetList", data.data.id],
            })
        },
    })
    return mutation
}
