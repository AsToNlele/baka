import { PageTitle } from "@/features/app/components/PageTitle"
import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail"
import { parseIsoAndFormat, upperCaseFirstLetter } from "@/utils/utils"
import { Button, Divider, useDisclosure } from "@nextui-org/react"
import { useParams } from "react-router-dom"
import { QRPaymentStandalone } from "@/features/orders/components/QRPayment"
import { AwaitPayment } from "@/features/orders/components/AwaitPayment"
import { useOrderPickup } from "@/features/orders/hooks/useOrderPickup"
import { Loading } from "@/components/Loading"
import { OrderPickupItem } from "@/features/orders/components/OrderPickupItem"
import { useIsAdmin } from "@/hooks/isAdmin"
import { FaEdit } from "react-icons/fa"
import { EditOrderModal } from "@/features/orders/components/EditOrderModal"

const OrderPickupDetail = ({ productOrderId }: { productOrderId: number }) => {
    const { data } = useOrderPickup(productOrderId)

    if (!data) {
        return <Loading />
    }

    return (
        <div className="flex flex-col gap-16">
            {data.map((pickup) => (
                <OrderPickupItem key={pickup.greenhouse.id} pickup={pickup} />
            ))}
        </div>
    )
}

export const OrderDetail = () => {
    const { id } = useParams()
    const orderId = id ? parseInt(id) : null
    const { data } = useOrderDetail(orderId)
    const isAdmin = useIsAdmin()

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <PageTitle title={`Order #${orderId}`} />
                {isAdmin && data && (
                    <>
                        <Button color="secondary" isIconOnly onPress={onOpen}>
                            <FaEdit />
                        </Button>
                        <EditOrderModal
                            isOpen={isOpen}
                            onClose={onClose}
                            onOpenChange={onOpenChange}
                            order={data}
                        />
                    </>
                )}
            </div>
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
                                            data.rent.rented_from!,
                                        )}
                                    </p>
                                    <p>
                                        Rented to{" "}
                                        {parseIsoAndFormat(
                                            data.rent.rented_to!,
                                        )}
                                    </p>
                                </div>
                                <div className="flex-col">
                                    <p>Price: {data.final_price}</p>
                                </div>
                            </div>
                        ) : data.type === "product" ? (
                            <div className="flex flex-col gap-4">
                                {data?.items.map((item) => (
                                    <div className="flex gap-4" key={item.id}>
                                        <div className="flex-col">
                                            <p>Product: {item.productName}</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="flex-col">
                                            <p>Price: {item.price}</p>
                                        </div>
                                    </div>
                                ))}
                                <Divider />
                                <p>Total price: {data.final_price}</p>
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
            {data?.type === "product" && (
                <>
                    <h2 className="mt-8 text-2xl">Pickup details</h2>
                    <OrderPickupDetail productOrderId={orderId!} />
                </>
            )}
        </div>
    )
}
