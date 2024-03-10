import React from "react"
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
} from "@nextui-org/react"
import { Brand } from "../../../components/Brand"

export default function LandingNavbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    const menuItems = ["Features", "Customers", "Integrations"]

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            classNames={{
                item: ["data-[active=true]:text-secondarytw"],
            }}
            className="border-none bg-transparent backdrop-blur-none backdrop-filter-none"
        >
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
            </NavbarContent>

            <NavbarContent className="pr-3 sm:hidden" justify="center">
                <NavbarBrand>
                    <Brand />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden gap-4 sm:flex" justify="start">
                <NavbarBrand>
                    <Brand />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                <NavbarItem>
                    <Link href="#" color="foreground">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link
                        href="#"
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
                    <Link href="/signin" className="text-secondary">
                        Sign In
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} href="/signup" color="primary">
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
                                    ? "warning"
                                    : index === menuItems.length - 1
                                    ? "danger"
                                    : "foreground"
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
    )
}
