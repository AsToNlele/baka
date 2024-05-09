// Author: Alexandr Celakovsky - xcelak00
import { api } from "@/utils/api"
import { useMutation } from "@tanstack/react-query"

type Inputs = {
    email: string
    token: string
}

const activateAccount = (data: Inputs) => {
    return api.get(`/activate?email=${data.email}&token=${data.token}`)
}

export const useActivateAccount = () => {
    const mutation = useMutation({
        mutationFn: activateAccount,
    })
    return mutation
}
