import { useMarketplaceProductDetails } from "@/features/marketplace/hooks/useMarketplaceProductDetail"
import { useProductMinMaxDetails } from "@/features/marketplace/hooks/useProductMinMaxDetails"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"
import {
    ShoppingCartMarketplaceItem,
    ShoppingCartProductItem,
} from "@/features/marketplace/types"
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react"
import { useState } from "react"
import { FaShoppingCart } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export const ShoppingCart = () => {
    const { items, sum, setCurrentStep } = useShoppingCartStore()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

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

    const onCartClick = () => {
        setCurrentStep("step1")
        navigate("/app/marketplace/cart")
    }

    return (
        <div>
            <Popover
                isOpen={isOpen}
                placement="bottom"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onOpenChange={(open) => setIsOpen(open)}
            >
                <PopoverTrigger>
                    <Button
                        isIconOnly
                        color="secondary"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                        onClick={onCartClick}
                        onPress={onCartClick}
                    >
                        <FaShoppingCart />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col gap-2 px-1 py-2">
                        {items.map((item) => {
                            if ("product" in item) {
                                return (
                                    <div className="flex" key={item.product}>
                                        {
                                            productQuery.find(
                                                (q) =>
                                                    q.data?.id === item.product,
                                            )?.data?.name
                                        }{" "}
                                        x {item.quantity}
                                    </div>
                                )
                            }
                            return (
                                <div
                                    className="flex"
                                    key={item.marketplaceProduct}
                                >
                                    {
                                        marketplaceProductQuery.find(
                                            (q) =>
                                                q.data?.id ===
                                                item.marketplaceProduct,
                                        )?.data?.product.name
                                    }{" "}
                                    x {item.quantity}
                                </div>
                            )
                        })}
                        <div>Total: ~{sum}</div>
                        <Button onPress={onCartClick}>Go to cart</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
