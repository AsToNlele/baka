import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react"
import { useLocation } from "react-router-dom"

export const NavBreadcrumbs = () => {
	const location = useLocation()
	const paths = location.pathname.slice(4).split('/').slice(1)
	return (
		<Breadcrumbs className="pb-4">
			{paths.map((path, index) => {
				const href = `/app${paths.slice(0, index + 1).join('/')}`
				const title = path ? path.charAt(0).toUpperCase() + path.slice(1) : "Home"
				return <BreadcrumbItem href={href} key={index}>{title}</BreadcrumbItem>
			})}
		</Breadcrumbs>
	)
}
