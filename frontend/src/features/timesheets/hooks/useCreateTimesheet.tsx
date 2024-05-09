// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { CreateTimesheetValidationType } from "@/features/timesheets/utils/types"

const createTimesheet = ({
    data,
}: {
    data: CreateTimesheetValidationType
}) => {
    return api.post(
        `/timesheets/create_timesheet/`,
        data,
    )
}

export const useCreateTimesheet = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: createTimesheet,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["timesheetList"],
            })
        },
    })
    return mutation
}
