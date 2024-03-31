import { SmallLoading } from "@/components/Loading"
import { PageTitle } from "@/features/app/components/PageTitle"
import { useUserList } from "@/features/users/hooks/useUserList"
import { UserType } from "@/utils/types"
import { upperCaseFirstLetter } from "@/utils/utils"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import { Link } from "react-router-dom"

export const Users = () => {
    const { data, isLoading } = useUserList()
    console.log(data)
    return (
        <div>
            <PageTitle title="Users" />
            <div className="mt-4 flex flex-col gap-2">
                {isLoading ? (
                    <SmallLoading />
                ) : (
                    data?.map((user) => <User key={user.profile.id} user={user} />)
                )}
            </div>
        </div>
    )
}

// type ProductOrderProps = {
//     order: ProductOrderType
// }
//
// export const ProductOrder = ({ order }: ProductOrderProps) => {
//     return (
//         <Link to={`/app/orders/${order.id}`}>
//             <Card>
//                 <CardHeader className="flex gap-8">
//                     <h2 className="text-lg">
//                         {upperCaseFirstLetter(order.status ?? "")}
//                     </h2>
//                     <p className="text-sm">
//                         Ordered on: {parseIsoAndFormat(order.created_at!)}
//                     </p>
//                     <p className="text-sm">Order ID: {order.id}</p>
//                 </CardHeader>
//                 <Divider />
//                 <CardBody>
//                     <div className="flex gap-4">
//                         <div className="flex-col">
//                             <p>Products: {order?.items.length}</p>
//                         </div>
//                         <div className="flex-col">
//                             <p>Price: {order.final_price}</p>
//                         </div>
//                     </div>
//                 </CardBody>
//             </Card>
//         </Link>
//     )
// }
//

const User = ({ user }: { user: UserType }) => {
    // Make it similar to the ProductOrder component, use card
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
