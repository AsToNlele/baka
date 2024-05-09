// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const cancelTimesheet = ({
    id,
    message,
}: {
    id: number | string
    message: string
}) => {
    return api.put(`/timesheets/${id}/update_timesheet/`, {
        message: message ?? "",
        status: "cancelled",
    })
}

export const useCancelTimesheet = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: cancelTimesheet,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["timesheetList", data.data.id],
            })
        },
    })
    return mutation
}
