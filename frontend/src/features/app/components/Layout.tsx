import type { ReactNode } from "react";
import { AppNavbar } from "./Navbar";
import { NavBreadcrumbs } from "./NavBreadcrumbs";

export const Layout = ({ children }: { children?: ReactNode }) => {
	return (
		<div className="min-h-screen h-full w-full lg:flex">

			<div className="lg:flex lg:shrink-0 lg:h-screen shadow-md">
				<AppNavbar />
			</div>
			<div className="lg:grow mx-auto px-6 py-4">
				<NavBreadcrumbs />
				{children}
			</div>
		</div>
	)
}

