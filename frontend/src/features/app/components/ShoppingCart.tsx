import { useMarketplaceProductDetails } from "@/features/marketplace/hooks/useMarketplaceProductDetail"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"
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
    const { items, sum } = useShoppingCartStore()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const query = useMarketplaceProductDetails(items)

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
                        onClick={() => navigate("/app/marketplace/cart")}
                        onPress={() => navigate("/app/marketplace/cart")}
                    >
                        <FaShoppingCart />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col gap-2 px-1 py-2">
                        {items.map((item, index) => {
                            return (
                                <div className="flex" key={item.marketplaceProduct}>
                                    {query[index]?.data?.product.name} x{" "}
                                    {item.quantity}
                                </div>
                            )
                        })}
                        <div>Celkem: {sum} Kč</div>
                        <Button
                            onPress={() => navigate("/app/marketplace/cart")}
                        >
                            Go to cart
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
