import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useProfile } from "../hooks/useProfile"
import { Avatar, Button, Input, Switch } from "@nextui-org/react"
import { EditSelfSchema, EditSelfValidationType } from "@/features/users/types"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEditSelf } from "@/features/auth/components/useEditSelf"
import { toast } from "sonner"

export const ProfileForm = () => {
    const profile = useProfile()

    // type ProfileInputs = {
    //     email: string
    //     first_name: string
    //     last_name: string
    // }
    // const { register, handleSubmit } = useForm<ProfileInputs>()
    // const onSubmit: SubmitHandler<ProfileInputs> = (data) => {
    //     console.log(data)
    // }
    //

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
    return (
        <div className="flex flex-col justify-start gap-8 pt-8">
            <div className="flex gap-8">
                <Avatar
                    className="size-24"
                    src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                />
                <div className="flex flex-col gap-4">
                    <Button color="warning">Change picture</Button>
                    <Button color="danger">Delete picture</Button>
                </div>
            </div>
            <Input
                label="Username"
                value={profile.data?.username}
                disabled
                className="max-w-xs"
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-start gap-8"
            >
                <div className="flex flex-col items-start gap-4">
                    <div className="flex items-start gap-4">
                        <Input
                            label="First name"
                            placeholder="Your first name"
                            className="max-w-xs"
                            {...register("first_name", { required: true })}
                        />
                        <Input
                            label="Last name"
                            placeholder="Your last name"
                            className="max-w-xs"
                            {...register("last_name", { required: true })}
                        />
                    </div>
                    <Input
                        label="Email address"
                        placeholder="Your first email address"
                        className="max-w-xs"
                        {...register("email", { required: true })}
                    />
                </div>
                <div className="flex w-full flex-col gap-4">
                    <div className="flex gap-4">
                        <Input label="Address line 1" />
                        <Input label="Address line 2" />
                    </div>
                    <div className="flex gap-4">
                        <Input label="City" />
                        <Input label="Postal code" />
                    </div>
                </div>
                <Button type="submit" color="primary" variant="shadow">
                    Submit
                </Button>
            </form>
        </div>
    )
}
