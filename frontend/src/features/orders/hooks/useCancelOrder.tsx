
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"

const cancelOrder = ({
    id,
}: {
    id: number | string
}) => {
    return api.put(`/orders/${id}/cancel_order/`)
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: cancelOrder,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["OrderList", data.data.id],
            })
        },
    })
    return mutation
}
