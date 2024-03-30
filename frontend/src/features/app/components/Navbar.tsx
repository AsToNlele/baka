import { useState } from "react"
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
    Skeleton,
    Button,
} from "@nextui-org/react"
import { useProfile } from "../../auth/hooks/useProfile"
import { useSignOut } from "../../auth/hooks/useSignOut"
import { Brand } from "../../../components/Brand"
import { useLocation } from "react-router-dom"

export const AppNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { data: profileData } = useProfile()

    const location = useLocation()

    const { data, isLoading } = useProfile()

    const signOut = useSignOut()

    const menuLinks = [
        {
            name: "Home",
            href: "/app/",
        },
        {
            name: "Greenhouses",
            href: "/app/greenhouses",
        },
        {
            name: "Marketplace",
            href: "/app/marketplace",
        },
        {
            name: "My beds",
            href: "/app/my-beds",
        },
        {
            name: "My greenhouses",
            href: "/app/my-greenhouses",
        },
        ...((profileData && profileData.owned_greenhouses.length > 0) ||
            (profileData && profileData.caretaker_greenhouses.length > 0)
            ? [
                {
                    name: "Timesheet",
                    href: "/app/timesheet",
                },
            ]
            : []),
        ...(profileData && profileData.superuser
            ? [
                {
                    name: "Users",
                    href: "/app/users",
                },
                {
                    name: "Send Newsletter",
                    href: "/app/newsletter",
                },
            ]
            : []),
        {
            name: "Orders",
            href: "/app/orders",
        },
    ]

    console.log(menuLinks)

    return (
        <Navbar
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            className="flex-1 lg:flex lg:h-full lg:flex-col lg:justify-start"
            classNames={{
                wrapper: ["lg:flex", "lg:flex-col", "lg:h-full"],
            }}
        >
            <NavbarContent className="lg:hidden" justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
            </NavbarContent>

            <NavbarContent className="pr-3 lg:hidden" justify="center">
                <NavbarBrand>
                    <Brand />
                </NavbarBrand>
            </NavbarContent>
            <NavbarMenu>
                {menuLinks.map((item, index) => {
                    return (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                className="w-full"
                                href={item.href}
                                size="lg"
                                color={
                                    location.pathname === item.href ||
                                        `${location.pathname}/` === item.href
                                        ? "secondary"
                                        : "foreground"
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        </NavbarMenuItem>
                    )
                })}
            </NavbarMenu>

            {/* Lg */}
            <NavbarContent>
                <div className="hidden h-full justify-between p-2 lg:flex lg:flex-col">
                    <Brand />
                    <div className="flex grow flex-col gap-2 pt-8">
                        {menuLinks.map((item) => {
                            const isActive =
                                location.pathname === item.href ||
                                `${location.pathname}/` === item.href
                            if (isActive) {
                                return (
                                    <Button
                                        as={Link}
                                        variant="flat"
                                        href={item.href}
                                        color="secondary"
                                        key={item.href}
                                    >
                                        {item.name}
                                    </Button>
                                )
                            }
                            return (
                                <Button
                                    as={Link}
                                    variant="light"
                                    href={item.href}
                                    key={item.href}
                                >
                                    {item.name}
                                </Button>
                            )
                        })}
                    </div>
                    <NavbarItem>
                        {!isLoading ? (
                            <Dropdown
                                placement="bottom-start"
                                classNames={{
                                    content: "min-w-[120px]",
                                }}
                            >
                                <DropdownTrigger>
                                    <User
                                        as="button"
                                        name={`${data?.first_name} ${data?.last_name}`}
                                        description="Level 4"
                                        avatarProps={{
                                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                                        }}
                                    />
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="User Actions"
                                    variant="flat"
                                    classNames={{
                                        base: "min-w-[100px]",
                                    }}
                                >
                                    <DropdownItem
                                        key="profile"
                                        as={Link}
                                        href="/app/profile"
                                        className="text-foreground"
                                    >
                                        Profile
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logout"
                                        color="danger"
                                        onClick={() => signOut.mutate()}
                                    >
                                        Sign Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <div className="flex gap-1">
                                <Skeleton className="size-10 rounded-full" />
                                <div className="flex flex-col justify-center gap-1">
                                    <Skeleton className="h-3 w-14 text-small" />
                                    <Skeleton className="h-2 w-10 text-tiny" />
                                </div>
                            </div>
                        )}
                    </NavbarItem>
                </div>
            </NavbarContent>
        </Navbar>
    )
}
