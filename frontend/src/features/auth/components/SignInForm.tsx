import { SubmitHandler, useForm } from "react-hook-form";
import { useSignIn } from "../hooks/useSignIn";
import { Button, Input } from "@nextui-org/react";

export const SignInForm = () => {
	const signIn = useSignIn();
	
	type SignInInputs = {
		username: string;
		password: string;
	};
	const { register, handleSubmit } = useForm<SignInInputs>();
	const onSubmit: SubmitHandler<SignInInputs> = (data) => {
		signIn.mutate(data);
	}
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex space-y-4 flex-col">
			<Input
				label="Username"
				placeholder="Login"
				autoFocus
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
