import { PageTitle } from "@/features/app/components/PageTitle"
import { useMarketplaceProductDetails } from "@/features/marketplace/hooks/useMarketplaceProductDetail"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"
import { ShoppingCartItem } from "@/features/marketplace/types"
import { GreenhouseProductType } from "@/utils/types"
import { Button, Input, Spinner, Divider } from "@nextui-org/react"
import { useEffect } from "react"
import { FaTrash } from "react-icons/fa"

import { Link } from "react-router-dom"

import { useProfile } from "@/features/auth/hooks/useProfile"
import { Loading } from "@/components/Loading"
import { QRPaymentStandalone } from "@/features/orders/components/QRPayment"
import { AwaitPayment } from "@/features/orders/components/AwaitPayment"
import { useCreateProductOrder } from "@/features/marketplace/hooks/useCreateProductOrder"

export const Cart = () => {
    return (
        <div className="flex flex-col gap-4">
            <MultistepForm />
        </div>
    )
}

const CartStep = () => {
    const { items, sum, setSum, setCurrentStep } = useShoppingCartStore()
    const query = useMarketplaceProductDetails(items)
    const allFinished = query.every((query) => query.isSuccess)

    useEffect(() => {
        const total = items.reduce((acc, item) => {
            const product = query.find((q) => q.data?.id === item.marketplaceProduct)
            if (!product) return acc
            if (!product.data?.product) return acc
            return acc + parseFloat(product?.data?.price) * item.quantity
        }, 0)
        setSum(total)
    }, [allFinished, setSum, items])

    const goToNext = () => {
        setCurrentStep("step2")
    }

    return (
        <div className="flex flex-col gap-4">
            <PageTitle title="Cart" />
            <div className="flex flex-col items-start gap-2">
                {items.map((item, index) => {
                    return (
                        <CartItem
                            key={item.marketplaceProduct}
                            item={item}
                            data={query[index]?.data}
                        />
                    )
                })}
            </div>
            <div>Celkem: {sum}</div>
            <div className="flex gap-4">
                <Button color="secondary" onPress={goToNext}>
                    Next
                </Button>
            </div>
        </div>
    )
}

type CartItemProps = {
    item: ShoppingCartItem
    data: GreenhouseProductType | undefined
}

const CartItemLocked = ({ item, data }: CartItemProps) => {
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

const CartItem = ({ item, data }: CartItemProps) => {
    const { changeQuantity, removeItem } = useShoppingCartStore()
    if (!data) {
        return <Spinner color="primary" />
    }
    return (
        <div className="flex items-center gap-4">
            <div>{data?.product?.name}</div>
            <Input
                type="number"
                value={item.quantity.toString()}
                className="w-14"
                onChange={(e) =>
                    changeQuantity(item.marketplaceProduct, parseInt(e.target.value))
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
            <Button isIconOnly onPress={() => removeItem(item.marketplaceProduct)}>
                <FaTrash />
            </Button>
            <div className="text-lg font-bold text-primary">
                {parseFloat(data?.price) * item.quantity}
            </div>
        </div>
    )
}

export const RentFlowerbed = () => {
    return <div className="flex flex-col gap-4"></div>
}

const Step2 = () => {
    const { setCurrentStep, items, sum } = useShoppingCartStore()
    const {mutate} = useCreateProductOrder()

    const goToNext = () => {
        // setCurrentStep("step3")
        console.log("ITEMS", items)
        mutate({data:{items}})
    }

    const { data: profileData } = useProfile()
    console.log(profileData)

    const query = useMarketplaceProductDetails(items)

    return (
        <>
            <div className="mx-auto flex flex-col gap-4 lg:mx-24">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Full name: </h2>
                        <p>
                            {profileData?.first_name || "Test"}{" "}
                            {profileData?.last_name || "User"}
                        </p>
                        <h2 className="text-xl font-bold">Email:</h2>
                        <p>{profileData?.email || "test@email.com"}</p>
                    </div>
                    <div></div>
                </div>
                <Divider />
                {/* Price summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Items:</h2>
                        {items.map((item, index) => {
                            return (
                                <CartItemLocked
                                    key={item.marketplaceProduct}
                                    item={item}
                                    data={query[index]?.data}
                                />
                            )
                        })}
                    </div>
                    <div>
                        {/* <h2 className="text-xl font-bold">Price per day:</h2> */}
                        {/* <p>{Number.parseFloat(data?.pricePerDay ?? "0")}</p> */}
                    </div>
                </div>
                <Divider />
                <div className="grid grid-cols-2 gap-4">
                    <div></div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">Total:</h2>
                        <p className="text-xl text-secondary">
                            {sum}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button onPress={() => setCurrentStep("step1")}>
                        Previous
                    </Button>
                    <Button color="secondary" onPress={goToNext}>
                        Confirm
                    </Button>
                </div>
            </div>
        </>
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
        <div className="flex flex-col gap-4 items-center">
            <QRPaymentStandalone orderId={orderId} />
            <AwaitPayment orderId={orderId} />
            {orderId && <Button className="" onPress={goToNext}>Continue</Button>}
        </div>
    )
}

const Step4 = () => {
    return <div>Step 4</div>
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
                    Summary
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
                    Final
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
