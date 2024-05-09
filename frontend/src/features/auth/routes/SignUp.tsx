// Author: Alexandr Celakovsky - xcelak00
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react"
import { SignUpForm } from "../components/SignUpForm"

export const SignUp = () => {
    return (
        <div className="flex min-h-full flex-col justify-center px-4 py-12">
            <div className="w-full">
                <Card className="mx-auto max-w-screen-sm">
                    <CardHeader className="block p-0 pt-8">
                        <h1 className="text-center text-2xl font-semibold">
                            Sign Up
                        </h1>
                    </CardHeader>
                    <CardBody className="gap-4 p-8">
                        <div className="flex flex-col">
                            <SignUpForm />
                        </div>
                        <div>
                            <Link href="/signin" color="secondary">
                                Already have an account? Sign in!
                            </Link>
                        </div>
                        <div>
                            <Link href="/reset-password" color="secondary">
                                Forgot your password? Reset it!
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
