// Author: Alexandr Celakovsky - xcelak00
import { SmallLoading } from "@/components/Loading"
import { PageTitle } from "@/features/app/components/PageTitle"
import { UserDetails } from "@/features/users/components/UserDetails"
import { useUserDetail } from "@/features/users/hooks/useUserDetail"
import { useParams } from "react-router-dom"

export const UserDetail = () => {
    const { id } = useParams()
    const userId = id ? parseInt(id) : null
    const { data, isLoading } = useUserDetail(userId)
    
    return (
        <div>
            {isLoading || !data ? (
                <SmallLoading />
            ) : (
                <div>
                    <PageTitle title={data.username} />

                    <UserDetails data={data} />
                </div>
            )}
        </div>
    )
}
