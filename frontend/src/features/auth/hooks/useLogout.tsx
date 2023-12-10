import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const logout = () => {
	return api.post('/auth/logout')
}

export const useLogout = () => {
	const navigate = useNavigate();
	const mutation = useMutation(
		{
			mutationFn: logout,
			onSuccess: () => {
				navigate('/')
				toast.success('Logged out successfully')
			}
		}
	)
	return mutation;
}
