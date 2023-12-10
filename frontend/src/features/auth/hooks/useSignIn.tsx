import { useMutation } from "@tanstack/react-query"
import { api } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Inputs = {
	username: string;
	password: string;
};

const signin = (data: Inputs) => {
	return api.post('/auth/login', data)
}

export const useSignIn = () => {
	const navigate = useNavigate();
	const mutation = useMutation(
		{
			mutationFn: signin,
			onSuccess: () => {
				navigate('/app')
				toast.success('Logged in successfully')
			}
		}
	)
	return mutation;
}