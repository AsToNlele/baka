import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api"

const checkDiscountCode = ({ code }: { code: string | undefined }) => {
    return api.post(`discount-code-availability/`, { code })
}

export const useCheckDiscountCode = () => {
    const mutation = useMutation({
        mutationFn: checkDiscountCode,
    })
    return mutation
}
