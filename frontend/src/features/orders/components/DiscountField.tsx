// Author: Alexandr Celakovsky - xcelak00
import { useCheckDiscountCode } from "@/features/orders/hooks/useCheckDiscountCode"
import { LocalDiscount } from "@/utils/types"
import { Button, Input } from "@nextui-org/react"
import { useState } from "react"
import { FaX } from "react-icons/fa6"

export const DiscountField = ({
    discount,
    setDiscount,
    buttonRight = false
}: {
    discount: LocalDiscount | null
    setDiscount: (discount: LocalDiscount | null) => void
    buttonRight?: boolean
}) => {
    const [discountInputValue, SetdiscountInputValue] = useState<string>("")
    const checkDiscount = useCheckDiscountCode()
    const checkDiscountAvailability = () => {
        checkDiscount.mutate(
            { code: discountInputValue },
            {
                onSuccess: (data) => {
                    setDiscount({
                        code: data.data.code,
                        discount_value: parseFloat(data.data.discount_value),
                    })
                },
            },
        )
    }

    return (
        <>
            {discount && (
                <div>
                    <h2 className="text-lg font-bold">Discount:</h2>
                    <span>
                        {discount.code} Saves:{" "}
                        <span className="text-success">
                            {discount.discount_value}
                        </span>
                        <Button
                            size="sm"
                            isIconOnly
                            onPress={() => setDiscount(null)}
                        >
                            <FaX />
                        </Button>
                    </span>
                </div>
            )}
            <div className={ `flex ${buttonRight ? "" : "flex-wrap"} items-center justify-center gap-2` }>
                <Input
                    label="Discount code"
                    onValueChange={SetdiscountInputValue}
                    value={discountInputValue}
                />
                <Button onPress={checkDiscountAvailability} size="sm">
                    Apply
                </Button>
            </div>
        </>
    )
}
