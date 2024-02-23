import { useOrderPayment } from "@/features/orders/hooks/useOrderPayment"
import { calculateQRString } from "@/features/orders/utils/calculations"
import QRCode from "react-qr-code"

type QRPaymentProps = {
    receiver: string
    vs: number
    amount: number
}

export const QRPayment = ({ receiver, vs, amount }: QRPaymentProps) => {
    if (!receiver || !vs || !amount) return null
    const qrString = calculateQRString(receiver, vs, amount)
    return <QRCode value={qrString} />
}

type QRPaymentStandaloneProps = {
    orderId: number
}

export const QRPaymentStandalone = ({ orderId }: QRPaymentStandaloneProps) => {
    const { data } = useOrderPayment(orderId)

    if (!data) return null

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            {"error" in data ? (
                null
            ) : "receiver" in data ? (
                <>
                    <QRPayment
                        receiver={data.receiver}
                        vs={orderId}
                        amount={parseFloat(data.amount)}
                    />

                    <div>
                        <p>BIC: {data.receiver}</p>
                        <p>VS: {data.vs}</p>
                        <p>Amount {data.amount}</p>
                    </div>
                </>
            ) : null}
        </div>
    )
}
