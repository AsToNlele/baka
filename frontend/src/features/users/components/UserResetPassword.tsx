// Author: Alexandr Celakovsky - xcelak00
import { useResetPassword } from "@/features/auth/hooks/useResetPassword"
import { Button } from "@nextui-org/react"
import { toast } from "sonner"

type UserResetPasswordProps = {
    userEmail: string
}
export const UserResetPassword = ({ userEmail }: UserResetPasswordProps) => {
    const resetPassword = useResetPassword()
    const handleReset = () => {
        resetPassword.mutate(
            { email: userEmail },
            {
                onSuccess: () => {
                    toast.success("Password reset email sent")
                },
            },
        )
    }
    return (
        <Button color="warning" onPress={handleReset}>
            Reset Password
        </Button>
    )
}
