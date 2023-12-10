import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { useSignUp } from "../hooks/useSignUp";

export const SignUpForm = () => {
	const signUp = useSignUp();
	
	type RegisterInputs = {
		username: string;
		password: string;
	};
	const { register, handleSubmit } = useForm<RegisterInputs>();
	const onSubmit: SubmitHandler<RegisterInputs> = (data) => {
		signUp.mutate(data);
	}
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex space-y-4 flex-col">
			<Input
				label="Username"
				placeholder="Login"
				{...register('username', { required: true })}
			/>
			<Input
				label="Password"
				type="password"
				placeholder="Password"
				{...register('password', { required: true })}
			/>
			<Button type="submit" color="primary" variant="shadow">Submit</Button>
		</form>
	)
}
