import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Button, Input, Switch } from "@nextui-org/react"
import { useSignUp } from "../hooks/useSignUp"
import {
    RegisterUserSchema,
    RegisterUserValidationType,
} from "@/features/users/types"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"

export const SignUpForm = () => {
    const signUp = useSignUp()
    const navigate = useNavigate()

    const { register, handleSubmit, formState, control } =
        useForm<RegisterUserValidationType>({
            resolver: zodResolver(RegisterUserSchema),
        })

    const onSubmit: SubmitHandler<RegisterUserValidationType> = (data) => {
        signUp.mutate(data, {
            onSuccess: () => {
                navigate("/activate-account")
            },
        })
    }
    const submit = () => {
        handleSubmit(onSubmit)()
    }

    console.log(formState.errors)

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
        >
            <Input
                label="Username"
                placeholder="Login"
                {...register("username", { required: true })}
                errorMessage={formState.errors.username?.message}
            />
            <Input
                label="Password"
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
                errorMessage={formState.errors.password?.message}
            />
            <Input
                label="Confirm Password"
                type="password"
                placeholder="Same password"
                {...register("passwordMatch", { required: true })}
                errorMessage={formState.errors.passwordMatch?.message}
            />
            <Input
                label="Email"
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                errorMessage={formState.errors.email?.message}
            />
            <Input
                label="First name"
                placeholder="First name"
                {...register("first_name", { required: true })}
                errorMessage={formState.errors.first_name?.message}
            />
            <Input
                label="Last name"
                placeholder="Last name"
                {...register("last_name", { required: true })}
                errorMessage={formState.errors.last_name?.message}
            />
            <Controller
                control={control}
                name="subscribe_newsletter"
                defaultValue={false}
                render={({ field: { onChange } }) => (
                    <Switch onChange={onChange} defaultSelected={false}>
                        Subscribe to newsletter
                    </Switch>
                )}
            />
            <Button onPress={submit} color="primary" variant="shadow">
                Submit
            </Button>
        </form>
    )
}
