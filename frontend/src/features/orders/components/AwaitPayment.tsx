import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail"
import { Button, Spinner } from "@nextui-org/react"
import { useEffect } from "react"
import { FaCheckCircle } from "react-icons/fa"
import { Link } from "react-router-dom"

type AwaitPaymentProps = {
    orderId: number
}
export const AwaitPayment = ({ orderId }: AwaitPaymentProps) => {
    const { data, refetch } = useOrderDetail(orderId)

    // if (!data) {
    //     return <div>Loading...</div>;
    // }
    //
    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            {data && data.status === "paid" ? (
                <div className="flex flex-col justify-center items-center">
                    <FaCheckCircle size={50} color="green" />
                    <h3 className="text-lg font-semibold text-center mt-4">
                        Order is paid
                    </h3>
                    {data?.type === "flowerbed" ? (
                        <Button
                            className="self-center"
                            as={Link}
                            color="primary"
                            to={`/app/flowerbeds/${data?.rent?.flowerbed?.id}`}
                        >
                            Go to flowerbed
                        </Button>
                    ) : null}
                </div>
            ) : (
                <div className="flex flex-col">
                    <Spinner size="lg" color="primary" />
                    <h3 className="text-lg font-semibold text-center mt-4">
                        Awaiting payment
                    </h3>
                </div>
            )}
        </div>
    )
}
