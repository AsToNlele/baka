import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { useNavigate } from "react-router-dom"

type Inputs = {
    email: string
}

const resetPassword = (data: Inputs) => {
    return api.post("/password-reset/", data)
}

export const useResetPassword = () => {
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            navigate("/reset-password-requested")
        },
    })
    return mutation
}
