import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
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
            toast.success("Signed out successfully")
        },
    })
    return mutation
}
