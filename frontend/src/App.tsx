// Author: Alexandr Celakovsky - xcelak00
import { NextUIProvider } from "@nextui-org/react"
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom"
import { Landing } from "./features/landing/routes/Landing"
import { SignIn } from "./features/auth/routes/SignIn"
import { Profile } from "./features/auth/routes/Profile"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { SignUp } from "./features/auth/routes/SignUp"
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
import { MyFlowerbedList } from "@/features/flowerbeds/routes/MyFlowerbedList"
import { Users } from "@/features/users/routes/Users"
import { UserDetail } from "@/features/users/routes/UserDetail"
import { ResetPassword } from "@/features/auth/routes/ResetPassword"
import { ResetPasswordRequested } from "@/features/auth/routes/ResetPasswordRequested"
import { ResetPasswordConfirm } from "@/features/auth/routes/ResetPasswordConfirm"
import { ResetPasswordReseted } from "@/features/auth/routes/ResetPasswordReseted"
import { Timesheets } from "@/features/timesheets/routes/Timesheets"
import { TimesheetDetail } from "@/features/timesheets/routes/TimesheetDetail"
import { ExtendRentFlowerbed } from "@/features/flowerbeds/routes/ExtendRentFlowerbed"
import { MyGreenhouses } from "@/features/greenhouses/routes/MyGreenhouses"
import { Suspense, lazy } from "react"
import { ActivateAccount } from "@/features/auth/routes/ActivateAccount"
import { ActivateAccountConfirm } from "@/features/auth/routes/ActivateAccountConfirm"
import { SocialPosts } from "@/features/socialposts/routes/SocialPosts"
import { SocialPostDetail } from "@/features/socialposts/routes/SocialPostDetail"
import { Badges } from "@/features/badges/routes/Badges"

// import { Newsletter } from "@/features/newsletter/routes/Newsletter"
// Import Newsltter lazy
const Newsletter = lazy(() => import("@/features/newsletter/routes/Newsletter"))

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
                                <Route
                                    path="/reset-password"
                                    element={<ResetPassword />}
                                />
                                <Route
                                    path="/reset-password/:token"
                                    element={<ResetPasswordConfirm />}
                                />
                                <Route
                                    path="/reset-password-requested"
                                    element={<ResetPasswordRequested />}
                                />
                                <Route
                                    path="/reset-password-reseted"
                                    element={<ResetPasswordReseted />}
                                />
                                <Route
                                    path="/activate-account"
                                    element={<ActivateAccount />}
                                />
                                <Route
                                    path="/activate-account-confirm"
                                    element={<ActivateAccountConfirm />}
                                />
                            </Route>
                            <Route element={<ProtectedRoute />}>
                                {/* <Route path="/app" element={<Menu />} /> */}
                                <Route
                                    path="/app"
                                    element={<Navigate to="/app/greenhouses" />}
                                />
                                <Route
                                    path="/app/profile"
                                    element={<Profile />}
                                />
                                <Route
                                    path="/app/greenhouses"
                                    element={<Greenhouses />}
                                />
                                <Route
                                    path="/app/my-greenhouses"
                                    element={<MyGreenhouses />}
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
                                    path="/app/my-beds"
                                    element={<MyFlowerbedList />}
                                />
                                <Route
                                    path="/app/flowerbeds/:id/rent"
                                    element={<RentFlowerbed />}
                                />
                                <Route
                                    path="/app/flowerbeds/:id/extend-rent"
                                    element={<ExtendRentFlowerbed />}
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
                                <Route path="/app/users" element={<Users />} />
                                <Route
                                    path="/app/users/:id"
                                    element={<UserDetail />}
                                />
                                <Route
                                    path="/app/timesheets"
                                    element={<Timesheets />}
                                />
                                <Route
                                    path="/app/timesheets/:id"
                                    element={<TimesheetDetail />}
                                />
                                <Route
                                    path="/app/newsletter"
                                    element={
                                        <Suspense
                                            fallback={<div>Loading...</div>}
                                        >
                                            <Newsletter />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/app/socialposts"
                                    element={<SocialPosts />}
                                />
                                <Route
                                    path="/app/socialposts/:id"
                                    element={<SocialPostDetail />}
                                />
                                <Route
                                    path="app/badges"
                                    element={<Badges />}
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
