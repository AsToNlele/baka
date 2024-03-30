import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { useParams } from "react-router-dom"
import { ResetPasswordConfirmForm } from "@/features/auth/components/ResetPasswordConfirmForm"

export const ResetPasswordConfirm = () => {
    const { token } = useParams()
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
                            <ResetPasswordConfirmForm token={token} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
