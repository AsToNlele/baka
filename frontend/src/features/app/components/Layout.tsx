import type { ReactNode } from "react"
import { AppNavbar } from "./Navbar"
import { NavBreadcrumbs } from "./NavBreadcrumbs"
import { motion } from "framer-motion"

export const Layout = ({ children }: { children?: ReactNode }) => {
    return (
        <div className="min-h-screen h-full w-full lg:flex relative">
            <div className="lg:shrink-0 shadow-md lg:h-screen lg:fixed lg:w-52">
                <AppNavbar />
            </div>
            <motion.div
                className="lg:grow mx-auto px-6 py-4 lg:pl-56"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "tween" }}
            >
                <NavBreadcrumbs />
                {children}
            </motion.div>
        </div>
    )
}
