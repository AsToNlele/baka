// Author: Alexandr Celakovsky - xcelak00
import { SmallLoading } from "@/components/Loading"
import { PageTitle } from "@/features/app/components/PageTitle"
import { useUserList } from "@/features/users/hooks/useUserList"
import { UserType } from "@/utils/types"
import { upperCaseFirstLetter } from "@/utils/utils"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import { Link } from "react-router-dom"

export const Users = () => {
    const { data, isLoading } = useUserList()
    // List users
    return (
        <div>
            <PageTitle title="Users" />
            <div className="mt-4 flex flex-col gap-2">
                {isLoading ? (
                    <SmallLoading />
                ) : (
                    data?.map((user) => (
                        <User key={user.profile.id} user={user} />
                    ))
                )}
            </div>
        </div>
    )
}


const User = ({ user }: { user: UserType }) => {
    // User card
    return (
        <Link to={`/app/users/${user.profile.user}`}>
            <Card>
                <CardHeader className="flex gap-8">
                    <h2 className="text-lg">
                        {upperCaseFirstLetter(user.username ?? "")}
                    </h2>
                    <p className="text-sm">Email: {user.email}</p>
                    <p className="text-sm">User ID: {user.profile.user}</p>
                </CardHeader>
                {(user.last_name ||
                    user.first_name ||
                    user.owned_greenhouses.length > 0 ||
                    user.caretaker_greenhouses.length > 0) && (
                    <>
                        <Divider />
                        <CardBody>
                            <div className="flex gap-4">
                                {(user.last_name || user.first_name) && (
                                    <div className="flex-col">
                                        <>
                                            <p>First Name: {user.first_name}</p>
                                            <p>Last Name: {user.last_name}</p>
                                        </>
                                    </div>
                                )}

                                {(user.owned_greenhouses.length > 0 ||
                                    user.caretaker_greenhouses.length > 0) && (
                                    <div className="flex-col">
                                        <p>
                                            Owned Greenhouses:{" "}
                                            {user.owned_greenhouses.length}
                                        </p>
                                        <p>
                                            Caretaker of Greenhouses:{" "}
                                            {user.caretaker_greenhouses.length}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </>
                )}
            </Card>
        </Link>
    )
}
