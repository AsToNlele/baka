import type { ReactNode } from "react"
import { AppNavbar } from "./Navbar"
import { NavBreadcrumbs } from "./NavBreadcrumbs"
import { motion } from "framer-motion"
import { ShoppingCart } from "@/features/app/components/ShoppingCart"
import { useLocation } from "react-router-dom"

export const Layout = ({ children }: { children?: ReactNode }) => {
    const location = useLocation()
    return (
        <div className="relative size-full min-h-screen lg:flex">
            <div className="shadow-md lg:fixed lg:h-screen lg:w-52 lg:shrink-0">
                <AppNavbar />
            </div>

            <motion.div
                className="mx-auto px-[30px] py-4 lg:grow lg:pl-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "tween" }}
            >
                <div className="flex justify-between">
                    <NavBreadcrumbs />
                    {location.pathname !== "/app/marketplace/cart" && location.pathname.includes('/app/marketplace') && (
                        <ShoppingCart />
                    )}
                </div>
                {children}
            </motion.div>
        </div>
    )
}
