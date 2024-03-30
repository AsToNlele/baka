import { SubmitHandler, useForm } from "react-hook-form"
import { Button, Input } from "@nextui-org/react"
import { useResetPasswordConfirm } from "@/features/auth/hooks/useResetPasswordConfirm"

export const ResetPasswordConfirmForm = ({
    token,
}: {
    token: string | undefined
}) => {
    const resetPassword = useResetPasswordConfirm()

    type ResetPasswordInputs = {
        password: string
    }
    const { register, handleSubmit } = useForm<ResetPasswordInputs>()
    const onSubmit: SubmitHandler<ResetPasswordInputs> = (data) => {
        resetPassword.mutate({ ...data, token: token ?? "" })
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
        >
            <Input
                label="New Password"
                placeholder="a secure password"
                type="password"
                autoFocus
                {...register("password", { required: true })}
            />
            <Button type="submit" color="primary" variant="shadow">
                Submit
            </Button>
        </form>
    )
}
