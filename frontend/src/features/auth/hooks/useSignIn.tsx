import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { useNavigate } from "react-router-dom"

type Inputs = {
    username: string
    password: string
}

const signin = (data: Inputs) => {
    return api.post("/auth/login", data)
}

export const useSignIn = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: signin,
        onSuccess: () => {
            queryClient.invalidateQueries()
            navigate("/app")
        },
    })
    return mutation
}
