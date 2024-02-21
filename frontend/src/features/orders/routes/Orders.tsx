import { PageTitle } from "@/features/app/components/PageTitle"
import { useOrderList } from "@/features/orders/hooks/useOrderList"
import { FlowerbedOrderType } from "@/utils/types"
import { parseIsoAndFormat, upperCaseFirstLetter } from "@/utils/utils"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import { Link } from "react-router-dom"

type FlowerbedOrderProps = {
    order: FlowerbedOrderType
}

export const FlowerbedOrder = ({
    order,
}: FlowerbedOrderProps) => {
    return (
        <Link to={`/app/orders/${order.id}`}>
            <Card>
                <CardHeader className="flex gap-8">
                    <h2 className="text-lg">{upperCaseFirstLetter(order.status ?? "")}</h2>
                    <p className="text-sm">Ordered on: {parseIsoAndFormat(order.created_at!)}</p>
                    <p className="text-sm">Order ID: {order.id}</p>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="flex gap-4">
                        <div className="flex-col">
                            <p>
                                Greenhouse: {order.rent.flowerbed.greenhouse.title}
                            </p>
                            <p>
                                Flowerbed: {order.rent.flowerbed.name}
                            </p>
                        </div>
                        <div className="flex-col">
                            <p>
                                Rented from {parseIsoAndFormat(order.rent.rented_from!)}
                            </p>
                            <p>
                                Rented to {parseIsoAndFormat(order.rent.rented_to!)}
                            </p>
                        </div>
                        <div className="flex-col">
                            <p>
                                Price: {order.final_price}
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Link>

    )
}

export const Orders = () => {
    const { data, isLoading } = useOrderList()
    console.log(data)
    return (
        <div>
            <PageTitle title="Orders" />
            <div className="mt-4 flex flex-col gap-2">
                {isLoading && <p>Loading...</p>}
                {data?.map((order) => (
                    order && order.type === "flowerbed" ? (
                        <FlowerbedOrder key={order.id} order={order} />
                    ) : null
                ))}
            </div>
        </div>
    )
}
