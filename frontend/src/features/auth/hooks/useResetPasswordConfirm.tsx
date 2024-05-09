// Author: Alexandr Celakovsky - xcelak00
import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { useNavigate } from "react-router-dom"

type Inputs = {
    password: string
    token: string
}

const resetPasswordConfirm = (data: Inputs) => {
    return api.post("/password-reset/confirm/", data)
}

export const useResetPasswordConfirm = () => {
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: resetPasswordConfirm,
        onSuccess: () => {
            navigate("/reset-password-reseted")
        },
    })
    return mutation
}
