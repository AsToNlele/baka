import { Card, CardBody, CardHeader, Link } from "@nextui-org/react"

export const ResetPasswordReseted = () => {
    return (
        <div className="flex min-h-full flex-col justify-center px-4 py-12">
            <div className="w-full">
                <Card className="mx-auto max-w-screen-sm">
                    <CardHeader className="block p-0 pt-8">
                        <h1 className="text-center text-2xl font-semibold">
                            Password reseted
                        </h1>
                    </CardHeader>
                    <CardBody className="gap-4 p-8">
                        <div className="text-center">
                            <p>Your password has been reseted successfully.</p>
                            <Link href="/signin" color="secondary" className="mt-4 text-lg">
                                Sign in
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
