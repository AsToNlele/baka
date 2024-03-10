import { NextUIProvider } from "@nextui-org/react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { Landing } from "./features/landing/routes/Landing"
import { SignIn } from "./features/auth/routes/SignIn"
import { Profile } from "./features/auth/routes/Profile"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { SignUp } from "./features/auth/routes/SignUp"
import { Menu } from "./features/app/routes/Menu"
import { queryConfig } from "./utils/queryConfig"
import { ProtectedRoute, RedirectRoute } from "./utils/CustomRoutes"
import { Greenhouses } from "./features/greenhouses/routes/Greenhouses"
import { AnimatePresence } from "framer-motion"
import { GreenhouseDetail } from "@/features/greenhouses/routes/GreenhouseDetail"
import { FlowerbedDetail } from "@/features/flowerbeds/routes/FlowerbedDetail"
import { RentFlowerbed } from "@/features/flowerbeds/routes/RentFlowerbed"
import { Orders } from "@/features/orders/routes/Orders"
import { OrderDetail } from "@/features/orders/routes/OrderDetail"
import { Marketplace } from "@/features/marketplace/routes/Marketplace"
import { ProductDetail } from "@/features/marketplace/routes/ProductDetail"
import { Cart } from "@/features/marketplace/routes/Cart"

function App() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryClient = new QueryClient(queryConfig)

    return (
        <NextUIProvider navigate={navigate}>
            <QueryClientProvider client={queryClient}>
                <main className="min-h-screen bg-background text-foreground main-theme">
                    <Toaster richColors position="top-right" />
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route index element={<Landing />} />
                            <Route element={<RedirectRoute />}>
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/signin" element={<SignIn />} />
                            </Route>
                            <Route element={<ProtectedRoute />}>
                                <Route path="/app" element={<Menu />} />
                                <Route
                                    path="/app/profile"
                                    element={<Profile />}
                                />
                                <Route
                                    path="/app/greenhouses"
                                    element={<Greenhouses />}
                                />
                                <Route
                                    path="/app/greenhouses/:id"
                                    element={<GreenhouseDetail />}
                                />
                                <Route
                                    path="/app/flowerbeds/:id"
                                    element={<FlowerbedDetail />}
                                />
                                <Route
                                    path="/app/flowerbeds/:id/rent"
                                    element={<RentFlowerbed />}
                                />
                                <Route
                                    path="/app/orders"
                                    element={<Orders />}
                                />
                                <Route
                                    path="/app/orders/:id"
                                    element={<OrderDetail />}
                                />
                                <Route
                                    path="/app/marketplace"
                                    element={<Marketplace />}
                                />
                                <Route
                                    path="/app/marketplace/products/:id"
                                    element={<ProductDetail />}
                                />
                                <Route
                                    path="/app/marketplace/cart"
                                    element={<Cart />}
                                />
                                <Route path="*" element={<h1>404</h1>} />
                            </Route>
                        </Routes>
                    </AnimatePresence>
                </main>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </NextUIProvider>
    )
}

export default App
