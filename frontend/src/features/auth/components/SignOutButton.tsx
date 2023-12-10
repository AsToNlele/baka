import { Button } from "@nextui-org/react";
import { useSignOut } from "../hooks/useSignOut"

export const SignOutButton = () => {
	const signOut = useSignOut();
	return (
		<Button onClick={() => signOut.mutate()} color="danger">Sign Out</Button>
	)
}
