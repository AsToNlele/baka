import type { ReactNode } from "react";

export const Layout = ({ children }: { children?: ReactNode }) => (
	<div className="lg:container mx-auto px-6 py-4">
		{children}
	</div>
)

