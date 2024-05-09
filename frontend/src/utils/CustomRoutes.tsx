// Author: Alexandr Celakovsky - xcelak00
import { Outlet, useNavigate } from "react-router-dom"
import { useProfile } from "../features/auth/hooks/useProfile"
import { toast } from "sonner"
import { Layout } from "../features/app/components/Layout"
import { Loading } from "../components/Loading"
import { useEffect, type ReactNode } from "react"

export const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
    const navigate = useNavigate()
    const query = useProfile()
    useEffect(() => {
        if (!query.isFetching && query.error) {
            toast.error("You must be signed in to access this page")
            navigate("/signin", { replace: true })
        }
    }, [navigate, query.error, query.isFetching])

    return (
        <>
            <Layout>
                {query.isLoading ? (
                    <Loading />
                ) : children ? (
                    children
                ) : (
                    <Outlet />
                )}
            </Layout>
        </>
    )
}

export const RedirectRoute = ({ children }: { children?: ReactNode }) => {
    const navigate = useNavigate()
    const query = useProfile()
    useEffect(() => {
        if (query.isSuccess && !query.isError) {
            navigate("/app", { replace: true })
        }
    }, [navigate, query.isError, query.isSuccess])

    return query.isLoading ? <Loading /> : children ? children : <Outlet />
}
