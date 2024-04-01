import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api"

type Inputs = {
    email: string
}

const resetPassword = (data: Inputs) => {
    return api.post("/password-reset/", data)
}

export const useResetPassword = () => {
    const mutation = useMutation({
        mutationFn: resetPassword,
    })
    return mutation
}
