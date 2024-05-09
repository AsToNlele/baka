import { useOrderPayment } from "@/features/orders/hooks/useOrderPayment"
import { calculateQRString } from "@/features/orders/utils/calculations"
import QRCode from "react-qr-code"

type QRPaymentProps = {
    receiver: string
    receiver_iban: string
    vs: number
    amount: number
}

export const QRPayment = ({
    receiver,
    receiver_iban,
    vs,
    amount,
}: QRPaymentProps) => {
    if (!receiver || !vs || !amount || !receiver_iban) return null
    const qrString = calculateQRString(receiver_iban, vs, amount)
    return <QRCode value={qrString} />
}

type QRPaymentStandaloneProps = {
    orderId: number
}

export const QRPaymentStandalone = ({ orderId }: QRPaymentStandaloneProps) => {
    const { data } = useOrderPayment(orderId)

    if (!data) return null

    return (
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            {"error" in data ? null : "receiver" in data ? (
                <>
                    <QRPayment
                        receiver_iban={data.receiver_iban}
                        receiver={data.receiver}
                        vs={orderId}
                        amount={parseFloat(data.amount)}
                    />

                    <div>
                        <p>Bank Account: {data.receiver}</p>
                        <p>VS: {data.vs}</p>
                        <p>Amount {data.amount}</p>
                    </div>
                </>
            ) : null}
        </div>
    )
}
