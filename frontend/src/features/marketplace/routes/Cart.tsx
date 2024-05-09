// Author: Alexandr Celakovsky - xcelak00
import { PageTitle } from "@/features/app/components/PageTitle"
import { useMarketplaceProductDetails } from "@/features/marketplace/hooks/useMarketplaceProductDetail"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"
import {
    ShoppingCartProductItem,
    ShoppingCartMarketplaceItem,
} from "@/features/marketplace/types"
import {
    GreenhouseDetailProductType,
    LocalDiscount,
    PickupOptionType,
    ProductMinMaxPriceType,
} from "@/utils/types"
import {
    Button,
    Input,
    Spinner,
    Divider,
    RadioGroup,
    Radio,
} from "@nextui-org/react"
import { useEffect, useState } from "react"
import { FaTrash } from "react-icons/fa"

import { Link } from "react-router-dom"

import { Loading } from "@/components/Loading"
import { QRPaymentStandalone } from "@/features/orders/components/QRPayment"
import { AwaitPayment } from "@/features/orders/components/AwaitPayment"
import { useProductMinMaxDetails } from "@/features/marketplace/hooks/useProductMinMaxDetails"
import { PreferredGreenhouse } from "@/features/marketplace/routes/Marketplace"
import { useGetPickupOptions } from "@/features/marketplace/hooks/useGetPickupOptions"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { useCreateProductOrder } from "@/features/marketplace/hooks/useCreateProductOrder"
import { toast } from "sonner"
import { useOrderPickup } from "@/features/orders/hooks/useOrderPickup"
import { OrderPickupItem } from "@/features/orders/components/OrderPickupItem"
import { DiscountField } from "@/features/orders/components/DiscountField"

export const Cart = () => {
    return (
        <div className="flex flex-col gap-4">
            <MultistepForm />
        </div>
    )
}

const CartStep = () => {
    const { items, sum, setSum, setCurrentStep } = useShoppingCartStore()
    const productItems = items.filter(
        (item): item is ShoppingCartProductItem => "product" in item,
    )
    const marketplaceItems = items.filter(
        (item): item is ShoppingCartMarketplaceItem =>
            "marketplaceProduct" in item,
    )

    const marketplaceProductQuery =
        useMarketplaceProductDetails(marketplaceItems)
    const productQuery = useProductMinMaxDetails(productItems)

    const allFinished =
        marketplaceProductQuery.every((query) => query.isSuccess) &&
        productQuery.every((query) => query.isSuccess)

    useEffect(() => {
        const total = items.reduce((acc, item) => {
            let product
            // Product
            if ("product" in item) {
                product = productQuery.find((q) => q.data?.id === item.product)
                if (!product) return acc
                if (!product.data?.min) return acc
                return (
                    acc +
                    parseFloat(product?.data?.min.toString()) * item.quantity
                )
                // Marketplace product
            } else {
                product = marketplaceProductQuery.find(
                    (q) => q.data?.id === item.marketplaceProduct,
                )
                if (!product) return acc
                if (!product.data?.product) return acc
                return acc + parseFloat(product?.data?.price) * item.quantity
            }
        }, 0)
        setSum(total)
    }, [allFinished, setSum, items])

    const goToNext = () => {
        if (items.length > 0) setCurrentStep("step2")
    }

    return (
        <div className="flex flex-col gap-4">
            <PageTitle title="Cart" />
            <PreferredGreenhouse />
            <div className="mt-4 text-xl">Items</div>
            <div className="flex flex-col items-start gap-2">
                {items.map((item) => {
                    if ("product" in item) {
                        return (
                            <CartItem
                                key={item.product}
                                type="product"
                                item={item}
                                data={
                                    productQuery.find(
                                        (q) => q.data?.id === item.product,
                                    )?.data
                                }
                            />
                        )
                    }
                    return (
                        <CartItem
                            key={item.marketplaceProduct}
                            type="marketplaceProduct"
                            item={item}
                            data={
                                marketplaceProductQuery.find(
                                    (q) =>
                                        q.data?.id === item.marketplaceProduct,
                                )?.data
                            }
                        />
                    )
                })}
            </div>
            <div>Total: ~{sum}</div>
            <div className="flex gap-4">
                <Button
                    color={items.length > 0 ? "secondary" : "default"}
                    onPress={goToNext}
                    disabled={items.length < 1}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

type CartItemProps =
    | {
          type: "product"
          item: ShoppingCartProductItem
          data: ProductMinMaxPriceType | undefined
      }
    | {
          type: "marketplaceProduct"
          item: ShoppingCartMarketplaceItem
          data: GreenhouseDetailProductType | undefined
      }

type CartItemLockedProps = {
    item: ShoppingCartMarketplaceItem
    data: GreenhouseDetailProductType | undefined
}

const CartItemLocked = ({ item, data }: CartItemLockedProps) => {
    if (!data) {
        return <Spinner color="primary" />
    }
    return (
        <div className="flex items-center gap-4">
            <div>{data?.product?.name}</div>
            <p className="whitespace-nowrap">{item.quantity}x</p>
            <p className="whitespace-nowrap">{data?.price} / piece</p>
            <p>
                From:{" "}
                <Link
                    className="text-secondary"
                    to={`/app/greenhouses/${data.greenhouse.id}`}
                >
                    {data.greenhouse.title}
                </Link>
            </p>
            <div className="text-lg font-bold text-primary">
                {parseFloat(data?.price) * item.quantity}
            </div>
        </div>
    )
}

const CartItem = ({ type, item, data }: CartItemProps) => {
    const { changeQuantity, removeItem } = useShoppingCartStore()
    if (!data) {
        return <Spinner color="primary" />
    }
    if (type === "product") {
        return (
            <div className="flex items-center gap-4">
                <div>{data?.name}</div>
                <Input
                    type="number"
                    value={item.quantity.toString()}
                    className="w-14"
                    onChange={(e) =>
                        changeQuantity(
                            item.product,
                            parseInt(e.target.value),
                            type,
                        )
                    }
                />
                <p className="whitespace-nowrap">
                    {data.min} - {data.max} / piece
                </p>
                <Button
                    isIconOnly
                    onPress={() => removeItem(item.product, type)}
                >
                    <FaTrash />
                </Button>
                <div className="text-lg font-bold text-primary">
                    Price: {data?.min} - {data?.max}
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex items-center gap-4">
                <div>{data?.product?.name}</div>
                <Input
                    type="number"
                    value={item.quantity.toString()}
                    className="w-14"
                    onChange={(e) =>
                        changeQuantity(
                            item.marketplaceProduct,
                            parseInt(e.target.value),
                            type,
                        )
                    }
                />
                <p className="whitespace-nowrap">{data?.price} / piece</p>
                <p>
                    From:{" "}
                    <Link
                        className="text-secondary"
                        to={`/app/greenhouses/${data.greenhouse.id}`}
                    >
                        {data.greenhouse.title}
                    </Link>
                </p>
                <Button
                    isIconOnly
                    onPress={() => removeItem(item.marketplaceProduct, type)}
                >
                    <FaTrash />
                </Button>
                <div className="text-lg font-bold text-primary">
                    {parseFloat(data?.price) * item.quantity}
                </div>
            </div>
        )
    }
}

export const RentFlowerbed = () => {
    return <div className="flex flex-col gap-4"></div>
}

// Pickup options
const Step2 = () => {
    const { items, setCurrentStep } = useShoppingCartStore()
    const { data: profile } = useProfile()
    const { mutate, data: pickupOptions, isError } = useGetPickupOptions()
    const [selected, setSelected] = useState<string>("")
    const [discount, setDiscount] = useState<LocalDiscount | null>(null)

    const { mutate: createOrder } = useCreateProductOrder()

    const finalPickupOption = pickupOptions?.find(
        (option) => option.title === selected,
    )

    const totalAfterDiscount = () => Math.max(finalPickupOption?.sum ?? 0 - (discount?.discount_value ?? 0), 0)

    const goToNext = () => {
        if (!finalPickupOption) {
            toast.error("Invalid pickup option selected")
            return
        }
        if (!finalPickupOption?.items) {
            toast.error("No items in pickup option")
            return
        }
        const items = finalPickupOption!.items!
        createOrder({ data: { items } })
    }

    useEffect(() => {
        if (isError) {
            setCurrentStep("step1")
        }
    }, [isError])

    useEffect(() => {
        mutate({
            items,
            primaryGreenhouseId: profile?.profile
                ?.primary_greenhouseId as number,
        })
    }, [items])

    useEffect(() => {
        if (pickupOptions) {
            // Select first as default
            setSelected(pickupOptions[0].title)
        }
    }, [pickupOptions])

    if (!pickupOptions) {
        return <Loading />
    }

    return (
        <div className="flex flex-col items-start gap-4">
            <PickupOptions
                options={pickupOptions}
                selectedOption={selected}
                setSelectedOption={setSelected}
            />
            {finalPickupOption && (
                <>
                    <DiscountField discount={discount} setDiscount={setDiscount} buttonRight />
                    <div className="flex">
                        <h2 className="text-lg font-bold">Total:</h2>
                        <p className="text-xl">
                            <span className="text-secondary">
                                {finalPickupOption.sum}
                            </span>
                            {discount && (
                                <>
                                    <span className="text-success">
                                        {" "}
                                        - {discount.discount_value}
                                    </span>
                                    <span className="text-success">
                                        {" "}
                                        <span className="text-secondary">=</span> {totalAfterDiscount()}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </>
            )}

            <div className="flex gap-4">
                <Button onPress={() => setCurrentStep("step1")}>
                    Previous
                </Button>
                <Button color="primary" onPress={goToNext}>
                    Confirm order
                </Button>
            </div>
        </div>
    )
}

type PickuOptionsProps = {
    options: PickupOptionType[] | undefined
    selectedOption: string
    setSelectedOption: (option: string) => void
}

const PickupOptions = ({
    options,
    selectedOption,
    setSelectedOption,
}: PickuOptionsProps) => {
    const selectedOptionData = options?.find(
        (option) => option.title === selectedOption,
    )
    return (
        <div className="flex flex-col gap-8">
            <RadioGroup
                label="Pickup options"
                value={selectedOption}
                onValueChange={setSelectedOption}
            >
                {options?.map((option) => (
                    <Radio key={option.title} value={option.title}>
                        {option.title.charAt(0).toUpperCase() +
                            option.title.slice(1).toLowerCase()}
                    </Radio>
                ))}
            </RadioGroup>

            {selectedOptionData && (
                <PickupOptionItems option={selectedOptionData!} />
            )}
        </div>
    )
}

const PickupOptionItems = ({ option }: { option: PickupOptionType }) => {
    const marketplaceProductQuery = useMarketplaceProductDetails(option.items)

    const allFinished = marketplaceProductQuery.every(
        (query) => query.isSuccess,
    )

    if (!allFinished) {
        return <Spinner color="primary" />
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {option.items.map((item, index) => {
                    return (
                        <CartItemLocked
                            key={item.marketplaceProduct}
                            item={item}
                            data={marketplaceProductQuery[index]?.data}
                        />
                    )
                })}
            </div>
        </div>
    )
}

const Step3 = () => {
    const { orderId, setCurrentStep } = useShoppingCartStore()
    if (!orderId) {
        return <Loading />
    }
    const goToNext = () => {
        setCurrentStep("step4")
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <QRPaymentStandalone orderId={orderId} />
            <AwaitPayment orderId={orderId} />
            {orderId && (
                <Button className="" onPress={goToNext}>
                    Continue
                </Button>
            )}
        </div>
    )
}

const Step4 = () => {
    const { orderId } = useShoppingCartStore()
    const { data } = useOrderPickup(orderId)

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

const MultistepForm = () => {
    const { currentStep } = useShoppingCartStore()
    return (
        <div>
            <div className="mb-2 flex justify-center gap-4">
                <div
                    className={`${
                        currentStep === "step1" ? "text-black" : "text-gray-500"
                    }`}
                >
                    Cart
                </div>
                <div
                    className={`${
                        currentStep === "step2" ? "text-black" : "text-gray-500"
                    }`}
                >
                    Pickup options
                </div>
                <div
                    className={`${
                        currentStep === "step3" ? "text-black" : "text-gray-500"
                    }`}
                >
                    Payment
                </div>
                <div
                    className={`${
                        currentStep === "step4" ? "text-black" : "text-gray-500"
                    }`}
                >
                    Pickup
                </div>
            </div>
            <Divider />
            <div className="mt-4">
                {currentStep === "step1" && <CartStep />}
                {currentStep === "step2" && <Step2 />}
                {currentStep === "step3" && <Step3 />}
                {currentStep === "step4" && <Step4 />}
            </div>
        </div>
    )
}
