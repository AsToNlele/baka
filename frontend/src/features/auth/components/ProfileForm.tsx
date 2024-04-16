import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useProfile } from "../hooks/useProfile"
import { Button, Input, Switch } from "@nextui-org/react"
import { EditSelfSchema, EditSelfValidationType } from "@/features/users/types"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEditSelf } from "@/features/auth/components/useEditSelf"
import { toast } from "sonner"

export const ProfileForm = () => {
    const profile = useProfile()

    const { mutate } = useEditSelf()

    const { register, control, handleSubmit, reset, formState, getValues } =
        useForm<EditSelfValidationType>({
            resolver: zodResolver(EditSelfSchema),
            defaultValues: {
                profile: {
                    receive_newsletter:
                        profile.data?.profile?.receive_newsletter,
                },
                first_name: profile.data?.first_name,
                last_name: profile.data?.last_name,
                email: profile.data?.email,
            },
        })

    const onSubmit: SubmitHandler<EditSelfValidationType> = (data) => {
        console.log("mutating")
        console.log(data)
        mutate(data, {
            onSuccess: (res) => {
                const data = res.data
                reset({
                    profile: {
                        receive_newsletter: data.profile.receive_newsletter,
                    },
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                })
                toast.success("Profile updated")
            },
        })
    }

    console.log(formState.errors)
    console.log(getValues())

    const submit = () => {
        handleSubmit(onSubmit)()
    }

    useEffect(() => {
        reset({
            profile: {
                receive_newsletter: profile.data?.profile?.receive_newsletter,
            },
            first_name: profile.data?.first_name,
            last_name: profile.data?.last_name,
            email: profile.data?.email,
        })
    }, [])

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex flex-col items-start justify-start gap-2 space-y-4"
        >
            <Input label="Username" value={profile.data?.username} disabled />
            <Input
                label="Email"
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                errorMessage={formState.errors.email?.message}
                defaultValue={profile.data?.email}
            />
            <Input
                label="First name"
                placeholder="First name"
                {...register("first_name", { required: true })}
                errorMessage={formState.errors.first_name?.message}
                defaultValue={profile.data?.first_name}
            />
            <Input
                label="Last name"
                placeholder="Last name"
                {...register("last_name", { required: true })}
                errorMessage={formState.errors.last_name?.message}
                defaultValue={profile.data?.last_name}
            />
            <Controller
                control={control}
                name="profile.receive_newsletter"
                defaultValue={profile.data?.profile?.receive_newsletter}
                render={({ field: { onChange } }) => (
                    <Switch
                        onChange={onChange}
                        defaultSelected={
                            profile?.data?.profile.receive_newsletter
                        }
                    >
                        Subscribe to newsletter
                    </Switch>
                )}
            />
            <Button onPress={submit} color="primary" variant="shadow">
                Update
            </Button>
        </form>
    )
}
