import type { ReactNode } from "react";
import { AppNavbar } from "./Navbar";

export const Layout = ({ children }: { children?: ReactNode }) => {
	return (
		<>
			<AppNavbar />
			<div className="lg:container mx-auto px-6 py-4">
				{children}
			</div>
		</>
	)
}

