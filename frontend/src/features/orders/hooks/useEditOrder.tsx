// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { EditOrderValidationType } from "@/features/orders/utils/types"

const editOrder = ({
    id,
    data,
}: {
    id: number | string
    data: EditOrderValidationType
}) => {
    return api.put(`/orders/${id}/edit_order/`, data)
}

export const useEditOrder = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: editOrder,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["OrderList", data.data.id],
            })
        },
    })
    return mutation
}
