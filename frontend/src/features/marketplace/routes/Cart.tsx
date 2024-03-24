import { PageTitle } from "@/features/app/components/PageTitle"
import { useMarketplaceProductDetails } from "@/features/marketplace/hooks/useMarketplaceProductDetail"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"
import {
    ShoppingCartProductItem,
    ShoppingCartMarketplaceItem,
} from "@/features/marketplace/types"
import {
    GreenhouseDetailProductType,
    PickupOptionType,
    ProductMinMaxPriceType,
} from "@/utils/types"
import { Button, Input, Spinner, Divider } from "@nextui-org/react"
import { useEffect } from "react"
import { FaTrash } from "react-icons/fa"

import { Link } from "react-router-dom"

// import { useProfile } from "@/features/auth/hooks/useProfile"
import { Loading } from "@/components/Loading"
import { QRPaymentStandalone } from "@/features/orders/components/QRPayment"
import { AwaitPayment } from "@/features/orders/components/AwaitPayment"
// import { useCreateProductOrder } from "@/features/marketplace/hooks/useCreateProductOrder"
import { useProductMinMaxDetails } from "@/features/marketplace/hooks/useProductMinMaxDetails"
import { PreferredGreenhouse } from "@/features/marketplace/routes/Marketplace"
import { useGetPickupOptions } from "@/features/marketplace/hooks/useGetPickupOptions"
import { useProfile } from "@/features/auth/hooks/useProfile"
// import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail"

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
        setCurrentStep("step2")
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
            <div>Celkem: {sum}</div>
            <div className="flex gap-4">
                <Button color="secondary" onPress={goToNext}>
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

// const CartItemLocked = ({ type, item, data }: CartItemProps) => {
//     if (!data) {
//         return <Spinner color="primary" />
//     }
//     if (type === "product") {
//         return (
//             <div className="flex items-center gap-4">
//                 <div>{data?.name}</div>
//                 {/* <p className="whitespace-nowrap">{item.quantity}x</p> */}
//                 {/* <p className="whitespace-nowrap">{data?.price} / piece</p> */}
//                 <div className="text-lg font-bold text-primary">
//                     Price: {data?.min} - {data?.max}
//                 </div>
//             </div>
//         )
//     } else {
//         return (
//             <div className="flex items-center gap-4">
//                 <div>{data?.product?.name}</div>
//                 <p className="whitespace-nowrap">{item.quantity}x</p>
//                 <p className="whitespace-nowrap">{data?.price} / piece</p>
//                 <p>
//                     From:{" "}
//                     <Link
//                         className="text-secondary"
//                         to={`/app/greenhouses/${data.greenhouse.id}`}
//                     >
//                         {data.greenhouse.title}
//                     </Link>
//                 </p>
//                 <div className="text-lg font-bold text-primary">
//                     {parseFloat(data?.price) * item.quantity}
//                 </div>
//             </div>
//         )
//     }
// }

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

const Step2 = () => {
    const { items } = useShoppingCartStore()
    const { data: profile } = useProfile()
    const { mutate, data: pickupOptions } = useGetPickupOptions()
    console.log(pickupOptions)

    useEffect(() => {
        mutate({
            items,
            primaryGreenhouseId: profile?.profile
                ?.primary_greenhouseId as number,
        })
    }, [items])

    if (!pickupOptions) {
        return <Loading />
    }

    return pickupOptions.map((option) => <PickupOption key={option.title} option={option} />)
}

const PickupOption = ({ option }: { option: PickupOptionType }) => {
    const marketplaceProductQuery = useMarketplaceProductDetails(option.items)

    const allFinished = marketplaceProductQuery.every(
        (query) => query.isSuccess,
    )

    if (!allFinished) {
        return <Spinner color="primary" />
    }

    return option.items.map((item, index) => {
        return (
            <CartItemLocked
                key={item.marketplaceProduct}
                item={item}
                data={marketplaceProductQuery[index]?.data}
            />
        )
    })
}

export const StepStep2 = () => {
    return "Step2"
    // const { setCurrentStep, items, sum } = useShoppingCartStore()
    // const { mutate } = useCreateProductOrder()
    //
    // const goToNext = () => {
    //     // setCurrentStep("step3")
    //     console.log("ITEMS", items)
    //     mutate({ data: { items } })
    // }
    //
    // const { data: profileData } = useProfile()
    // console.log(profileData)
    //
    // const query = useMarketplaceProductDetails(items)
    //
    // return (
    //     <>
    //         <div className="mx-auto flex flex-col gap-4 lg:mx-24">
    //             <div className="grid grid-cols-2 gap-4">
    //                 <div>
    //                     <h2 className="text-xl font-bold">Full name: </h2>
    //                     <p>
    //                         {profileData?.first_name || "Test"}{" "}
    //                         {profileData?.last_name || "User"}
    //                     </p>
    //                     <h2 className="text-xl font-bold">Email:</h2>
    //                     <p>{profileData?.email || "test@email.com"}</p>
    //                 </div>
    //                 <div></div>
    //             </div>
    //             <Divider />
    //             {/* Price summary */}
    //             <div className="grid grid-cols-2 gap-4">
    //                 <div>
    //                     <h2 className="text-xl font-bold">Items:</h2>
    //                     {items.map((item, index) => {
    //                         return (
    //                             <CartItemLocked
    //                                 key={item.marketplaceProduct}
    //                                 item={item}
    //                                 data={query[index]?.data}
    //                             />
    //                         )
    //                     })}
    //                 </div>
    //                 <div>
    //                     {/* <h2 className="text-xl font-bold">Price per day:</h2> */}
    //                     {/* <p>{Number.parseFloat(data?.pricePerDay ?? "0")}</p> */}
    //                 </div>
    //             </div>
    //             <Divider />
    //             <div className="grid grid-cols-2 gap-4">
    //                 <div></div>
    //                 <div className="flex flex-col">
    //                     <h2 className="text-lg font-bold">Total:</h2>
    //                     <p className="text-xl text-secondary">{sum}</p>
    //                 </div>
    //             </div>
    //             <div className="flex gap-4">
    //                 <Button onPress={() => setCurrentStep("step1")}>
    //                     Previous
    //                 </Button>
    //                 <Button color="secondary" onPress={goToNext}>
    //                     Confirm
    //                 </Button>
    //             </div>
    //         </div>
    //     </>
    // )
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
    return <div>TBD</div>
    // const { orderId, items } = useShoppingCartStore()
    // const { data } = useOrderDetail(orderId)
    // console.log(data)
    //
    // // return <div>Step 4</div>
    // return (
    //     <div className="flex flex-col gap-8">
    //         <h1 className="text-xl font-bold">Please pickup your order!</h1>
    //         {data &&
    //             data.items.map((item) => {
    //                 return (
    //                     <div key={item.id} className="flex gap-2">
    //                         <Image
    //                             shadow="sm"
    //                             radius="lg"
    //                             width="300px"
    //                             className="w-full object-cover"
    //                             src={`https://placedog.net/300/200?id=${item.id!}`}
    //                         />
    //                         <p>{item.productName}</p>
    //                         <p>{item.quantity}x</p>
    //                         <p>From {item.greenhouseName}</p>
    //                     </div>
    //                 )
    //             })}
    //     </div>
    // )
}

const MultistepForm = () => {
    const { currentStep } = useShoppingCartStore()
    return (
        <div>
            <div className="mb-2 flex justify-center gap-4">
                <div
                    className={`${currentStep === "step1" ? "text-black" : "text-gray-500"
                        }`}
                >
                    Cart
                </div>
                <div
                    className={`${currentStep === "step2" ? "text-black" : "text-gray-500"
                        }`}
                >
                    Pickup options
                </div>
                <div
                    className={`${currentStep === "step3" ? "text-black" : "text-gray-500"
                        }`}
                >
                    Payment
                </div>
                <div
                    className={`${currentStep === "step4" ? "text-black" : "text-gray-500"
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
