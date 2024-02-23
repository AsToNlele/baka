import { PageTitle } from "@/features/app/components/PageTitle"
import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail"
import { parseIsoAndFormat, upperCaseFirstLetter } from "@/utils/utils"
import { Divider } from "@nextui-org/react"
import { useParams } from "react-router-dom"
import { QRPaymentStandalone } from "@/features/orders/components/QRPayment"
import { AwaitPayment } from "@/features/orders/components/AwaitPayment"

export const OrderDetail = () => {
    const { id } = useParams()
    const orderId = id ? parseInt(id) : null
    const { data } = useOrderDetail(orderId)
    return (
        <div className="flex flex-col gap-4">
            <PageTitle title={`Order #${orderId}`} />
            {data ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-lg">
                            {upperCaseFirstLetter(data.status ?? "")}
                        </h2>
                        <p className="text-sm">
                            Ordered on: {parseIsoAndFormat(data.created_at!)}
                        </p>
                        <p className="text-sm">Order ID: {data.id}</p>
                    </div>
                    <Divider />{" "}
                    <div className="flex gap-4">
                        {data.type === "flowerbed" ? (
                            <div className="flex gap-4">
                                <div className="flex-col">
                                    <p>
                                        Greenhouse:{" "}
                                        {data.rent.flowerbed.greenhouse.title}
                                    </p>
                                    <p>Flowerbed: {data.rent.flowerbed.name}</p>
                                </div>
                                <div className="flex-col">
                                    <p>
                                        Rented from{" "}
                                        {parseIsoAndFormat(
                                            data.rent.rented_from!
                                        )}
                                    </p>
                                    <p>
                                        Rented to{" "}
                                        {parseIsoAndFormat(
                                            data.rent.rented_to!
                                        )}
                                    </p>
                                </div>
                                <div className="flex-col">
                                    <p>Price: {data.final_price}</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
            {orderId && (
                <div className="flex flex-col gap-4">
                    <QRPaymentStandalone orderId={orderId} />
                    <AwaitPayment orderId={orderId} />
                </div>
            )}
        </div>
    )
}
