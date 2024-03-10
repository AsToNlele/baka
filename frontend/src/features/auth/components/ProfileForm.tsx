import { SubmitHandler, useForm } from "react-hook-form"
import { useProfile } from "../hooks/useProfile"
import { Avatar, Button, Input } from "@nextui-org/react"

export const ProfileForm = () => {
    const profile = useProfile()

    type ProfileInputs = {
        email: string
        first_name: string
        last_name: string
    }
    const { register, handleSubmit } = useForm<ProfileInputs>()
    const onSubmit: SubmitHandler<ProfileInputs> = (data) => {
        console.log(data)
    }
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
