import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const signout = () => {
	return api.post('/auth/logout')
}

export const useSignOut = () => {
	const navigate = useNavigate();
	const mutation = useMutation(
		{
			mutationFn: signout,
			onSuccess: () => {
				navigate('/')
				toast.success('Signed out successfully')
			}
		}
	)
	return mutation;
}
