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

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            classNames={{
                item: ["data-[active=true]:text-secondarytw"],
            }}
            // className="border-none bg-transparent backdrop-blur-none backdrop-filter-none"
            className="border-none backdrop-blur-none backdrop-filter-none"
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
            <NavbarContent
                className="hidden gap-4 sm:flex"
                justify="center"
            ></NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
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
                <NavbarMenuItem key={`signup`}>
                    <Link
                        className="w-full"
                        color={"foreground"}
                        href="/signup"
                        size="lg"
                    >
                        Sign Up
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem key={`signin`}>
                    <Link
                        className="w-full"
                        color={"foreground"}
                        href="/signin"
                        size="lg"
                    >
                        Sign In
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    )
}
