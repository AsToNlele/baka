import type { ReactNode } from "react";
import { AppNavbar } from "./Navbar";
import { NavBreadcrumbs } from "./NavBreadcrumbs";

export const Layout = ({ children }: { children?: ReactNode }) => {
	return (
		<>
			<AppNavbar />
			<div className="max-w-5xl mx-auto px-6 py-4">
				<NavBreadcrumbs />
				{children}
			</div>
		</>
	)
}

