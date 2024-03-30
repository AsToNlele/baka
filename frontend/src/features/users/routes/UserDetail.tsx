import { SmallLoading } from "@/components/Loading"
import { PageTitle } from "@/features/app/components/PageTitle"
import { useUserDetail } from "@/features/users/hooks/useUserDetail"
import { useParams } from "react-router-dom"

export const UserDetail = () => {
    const { id } = useParams()
    const userId = id ? parseInt(id) : null
    const { data, isLoading } = useUserDetail(userId)
    console.log(data)
    return (
        <div>
            {isLoading || !data ? (
                <SmallLoading />
            ) : (
                <div>
                    <PageTitle title={data.username} />

                    {/* # User detail */}
                    <div>
                        <h2 className="text-2xl font-bold">User Detail</h2>
                        <div className="flex gap-4">
                            <div>
                                <p>Username: {data.username}</p>
                                <p>Email: {data.email}</p>
                            </div>
                            <div>
                                <p>First name: {data.first_name}</p>
                                <p>Last name: {data.last_name}</p>
                            </div>
                        </div>
                    </div>

                    {/* # Orders, Flowerbeds, Rents */}

                    {/* # Owned Greenhouses */}

                    {/* # Caretaker of Greenhouses */}
                </div>
            )}
        </div>
    )
}
