import React from 'react';
import {
	Navbar,
	NavbarBrand,
	NavbarMenuToggle,
	NavbarMenuItem,
	NavbarMenu,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
} from '@nextui-org/react';

export const GrowyLogo = () => (
	<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10.5 30H25.5" stroke="#469174" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M15 30C23.25 26.25 16.2 20.4 19.5 15" stroke="#469174" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M14.25 14.0999C15.9 15.2999 16.95 17.3999 17.7 19.6499C14.7 20.2499 12.45 20.2499 10.5 19.1999C8.7 18.2999 7.05 16.3499 6 12.8999C10.2 12.1499 12.6 12.8999 14.25 14.0999Z" fill="#469174" stroke="#469174" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M21.1502 9C20.0065 10.7873 19.4313 12.8792 19.5002 15C22.3502 14.85 24.4502 14.1 25.9502 12.9C27.4502 11.4 28.3502 9.45 28.5002 6C24.4502 6.15 22.5002 7.5 21.1502 9Z" fill="#469174" stroke="#469174" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
);

export default function LandingNavbar() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const menuItems = ['Features', 'Customers', 'Integrations'];

	return (
		<Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={{
			item: [
				"data-[active=true]:text-secondarytw"
			]
		}} className="bg-transparent backdrop-blur-none backdrop-filter-none border-none">
			<NavbarContent className="sm:hidden" justify="start">
				<NavbarMenuToggle
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
				/>
			</NavbarContent>

			<NavbarContent className="sm:hidden pr-3" justify="center">
				<NavbarBrand>
					<GrowyLogo />
					<p className="font-bold text-inherit">Growy</p>
				</NavbarBrand>
			</NavbarContent>


			<NavbarContent className="hidden sm:flex gap-4" justify="start">

				<NavbarBrand>
					<GrowyLogo />
					<p className="font-bold text-inherit text-2xl">Growy</p>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarItem>
					<Link href="#" color="foreground">
						Features
					</Link>
				</NavbarItem>
				<NavbarItem isActive>
					<Link href="#"
					color="foreground"
					// aria-current="page"
					// className='text-inherit'
					>
						Customers
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						Integrations
					</Link>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem className="hidden lg:flex">
					<Link href="/signin" className="text-secondarytw">Sign In</Link>
				</NavbarItem>
				<NavbarItem>
					<Button as={Link} href="/signup" className="bg-foreground text-background">
						Sign Up
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							className="w-full"
							color={
								index === 2
									? 'warning'
									: index === menuItems.length - 1
										? 'danger'
										: 'foreground'
							}
							href="#"
							size="lg"
						>
							{item}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
