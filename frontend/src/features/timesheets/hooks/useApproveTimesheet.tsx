// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const approveTimesheet = ({
    id,
    message,
}: {
    id: number | string
    message: string
}) => {
    return api.put(`/timesheets/${id}/update_timesheet/`, {
        message: message ?? "",
        status: "approved",
    })
}

export const useApproveTimesheet = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: approveTimesheet,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["timesheetList", data.data.id],
            })
        },
    })
    return mutation
}
