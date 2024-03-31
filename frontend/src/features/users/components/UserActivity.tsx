import { useSetUserActivity } from "@/features/users/hooks/useSetUserActivity"
import { UserType } from "@/utils/types"
import { Switch } from "@nextui-org/react"

type UserDetailProps = {
    data: UserType
}

export const UserActivity = ({ data }: UserDetailProps) => {
    const setActivity = useSetUserActivity()

    const handleActivityChange = (value: boolean) => {
        setActivity.mutate({ id: data.profile.id, data: { is_active: value }})
    }

    return <Switch isSelected={data.is_active} onValueChange={handleActivityChange}>User enabled</Switch>
}
