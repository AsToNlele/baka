import { Card, CardBody, CardHeader } from "@nextui-org/react"

export const ResetPasswordRequested = () => {
    return (
        <div className="flex min-h-full flex-col justify-center px-4 py-12">
            <div className="w-full">
                <Card className="mx-auto max-w-screen-sm">
                    <CardHeader className="block p-0 pt-8">
                        <h1 className="text-center text-2xl font-semibold">
                            Password reset requested
                        </h1>
                    </CardHeader>
                    <CardBody className="gap-4 p-8">
                        <p className="text-center">
                            Check your email for a password reset link.
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
