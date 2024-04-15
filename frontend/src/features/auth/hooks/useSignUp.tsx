import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api"
import { RegisterUserValidationType } from "@/features/users/types"

const signup = (input: RegisterUserValidationType) => {
    return api.post("/register/", input)
}

export const useSignUp = () => {
    const mutation = useMutation({
        mutationFn: signup,
    })
    return mutation
}
