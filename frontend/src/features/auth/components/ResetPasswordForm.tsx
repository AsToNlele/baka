import { SubmitHandler, useForm } from "react-hook-form"
import { Button, Input } from "@nextui-org/react"
import { useResetPassword } from "@/features/auth/hooks/useResetPassword"
import { useNavigate } from "react-router-dom"

export const ResetPasswordForm = () => {
    const navigate = useNavigate()
    const resetPassword = useResetPassword()

    type ResetPasswordInputs = {
        email: string
    }
    const { register, handleSubmit } = useForm<ResetPasswordInputs>()
    const onSubmit: SubmitHandler<ResetPasswordInputs> = (data) => {
        resetPassword.mutate(data, {
            onSuccess: () => {
                navigate("/reset-password-requested")
            },
        })
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
        >
            <Input
                label="Email"
                placeholder="your-email@email.com"
                type="email"
                autoFocus
                {...register("email", { required: true })}
            />
            <Button type="submit" color="primary" variant="shadow">
                Submit
            </Button>
        </form>
    )
}
