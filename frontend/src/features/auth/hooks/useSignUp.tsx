import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Inputs = {
	username: string;
	password: string;
};

const signup = (data: Inputs) => {
	return api.post('/auth/register', data)
}

export const useSignUp = () => {
	const navigate = useNavigate();
	const mutation = useMutation(
		{
			mutationFn: signup,
			onSuccess: () => {
				navigate('/app')
				toast.success('Signed up successfully')
			}
		}
	)
	return mutation;
}
