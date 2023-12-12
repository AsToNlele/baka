import { useState } from 'react';
import {
	Navbar,
	NavbarBrand,
	NavbarMenuToggle,
	NavbarMenuItem,
	NavbarMenu,
	NavbarContent,
	NavbarItem,
	Link,
	User,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Skeleton
} from '@nextui-org/react';
import { useProfile } from '../../auth/hooks/useProfile';
import { useSignOut } from '../../auth/hooks/useSignOut';

export const AcmeLogo = () => (
	<svg fill="none" height="36" viewBox="0 0 32 32" width="36">
		<path
			clipRule="evenodd"
			d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

export const AppNavbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const menuItems = ['Features', 'Customers', 'Integrations'];

	const { data, isLoading } = useProfile();

	const signOut = useSignOut();

	return (
		<Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent className="sm:hidden" justify="start">
				<NavbarMenuToggle
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
				/>
			</NavbarContent>

			<NavbarContent className="sm:hidden pr-3" justify="center">
				<NavbarBrand>
					<AcmeLogo />
					<p className="font-bold text-inherit">ACME</p>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarBrand>
					<AcmeLogo />
					<p className="font-bold text-inherit">ACME</p>
				</NavbarBrand>
				<NavbarItem>
					<Link color="foreground" href="#">
						Features
					</Link>
				</NavbarItem>
				<NavbarItem isActive>
					<Link href="#" aria-current="page">
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
					{!isLoading ? (
						<Dropdown placement="bottom-start">
							<DropdownTrigger>
								<User
									as="button"
									name={`${data?.first_name} ${data?.last_name}`}
									description="Level 4"
									avatarProps={{
										src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
									}} />
							</DropdownTrigger>
							<DropdownMenu aria-label="User Actions" variant="flat">
								<DropdownItem key="profile" href="/app/profile">
									Profile
								</DropdownItem>
								<DropdownItem key="logout" color="danger" onClick={() => signOut.mutate()}>
									Sign Out
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					) : (
						<div className="flex gap-1">
							<Skeleton className="rounded-full w-10 h-10" />
							<div className="flex flex-col justify-center gap-1">
								<Skeleton className='text-small w-14 h-3' />
								<Skeleton className='text-tiny w-10 h-2' />
							</div>
						</div>
					)}


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
