import { Button } from "@nextui-org/react";
import { useLogout } from "../hooks/useLogout"

export const LogoutButton = () => {
	const logout = useLogout();
	return (
		<Button onClick={() => logout.mutate()} color="danger">Logout</Button>
	)
}
