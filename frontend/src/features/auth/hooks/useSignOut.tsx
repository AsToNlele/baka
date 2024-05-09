// Author: Alexandr Celakovsky - xcelak00
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

const signout = () => {
    return api.post("/auth/logout")
}

export const useSignOut = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: signout,
        onSuccess: () => {
            navigate("/")
            queryClient.invalidateQueries({ queryKey: ["profile"] })
            Cookies.remove("csrftoken")
        },
    })
    return mutation
}
