import { SmallLoading } from "@/components/Loading"
import { useActivateAccount } from "@/features/auth/hooks/useActivateAccount"
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"

export const ActivateAccountConfirm = () => {
    const [searchParams] = useSearchParams()
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    const activateAccount = useActivateAccount()
    useEffect(() => {
        if (!email || !token) {
            return
        }
        activateAccount.mutate({ email, token })
    }, [])
    return (
        <div className="flex min-h-full flex-col justify-center px-4 py-12">
            <div className="w-full">
                <Card className="mx-auto max-w-screen-sm">
                    {activateAccount.isPending || !activateAccount.isSuccess ? (
                        <SmallLoading />
                    ) : (
                        <>
                            <CardHeader className="block p-0 pt-8">
                                <h1 className="text-center text-2xl font-semibold">
                                    Account activated
                                </h1>
                            </CardHeader>
                            <CardBody className="gap-4 p-8">
                                <div className="text-center">
                                    <p>
                                        Your account has been activated
                                        successfully. You can now sign in.
                                    </p>
                                    <Link
                                        to="/signin"
                                        color="secondary"
                                        className="mt-4 text-lg"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </CardBody>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}
