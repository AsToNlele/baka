// Author: Alexandr Celakovsky - xcelak00
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react"
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm"

export const ResetPassword = () => {
    return (
        <div className="flex min-h-full flex-col justify-center px-4 py-12">
            <div className="w-full">
                <Card className="mx-auto max-w-screen-sm">
                    <CardHeader className="block p-0 pt-8">
                        <h1 className="text-center text-2xl font-semibold">
                            Reset Password
                        </h1>
                    </CardHeader>
                    <CardBody className="gap-4 p-8">
                        <div className="flex flex-col">
                            <ResetPasswordForm />
                        </div>
                        <div>
                            <Link href="/signin" color="secondary">
                                Already have an account? Sign in!
                            </Link>
                        </div>
                        <div>
                            <Link href="/signup" color="secondary">
                                Don't have an account? Sign up!
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
