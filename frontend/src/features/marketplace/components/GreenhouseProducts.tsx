import { useGreenhouseProductList } from "@/features/marketplace/hooks/useGreenhouseProductList"
import { GreenhouseProductType } from "@/utils/types"
import { useParams } from "react-router-dom"
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    useDisclosure
} from "@nextui-org/react"
import { FaEdit, FaPlus, FaShoppingCart } from "react-icons/fa"
import { CreateGreenhouseProductModal } from "@/features/marketplace/components/CreateGreenhouseProductModal"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { EditGreenhouseProductInventoryModal } from "@/features/marketplace/components/EditGreenhouseProductInventoryModal"
import { useState } from "react"
import { EditGreenhouseMarketplaceProductModal } from "@/features/marketplace/components/EditGreenhouseMarketplaceProductModal"
import { ProductImage } from "@/features/marketplace/components/ProductImage"

export const GreenhouseProducts = () => {
    const { id } = useParams()
    const greenhouseId = id ? parseInt(id) : null
    const { data: products } = useGreenhouseProductList(greenhouseId)
    const [selectedMarketplaceProduct, setSelectedMarketplaceProduct] =
        useState<number | null>(null)

    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isOpenInventory,
        onOpenChange: onOpenInventoryChange,
        onOpen: onOpenInventory,
        onClose: onCloseInventory,
    } = useDisclosure()
    const {
        isOpen: isOpenEdit,
        onOpenChange: onOpenEditChange,
        onOpen: onOpenEdit,
        onClose: onCloseEdit,
    } = useDisclosure()
    const { data: profile } = useProfile()

    const isCaretaker = profile?.caretaker_greenhouses.some(
        (g) => g.id === greenhouseId,
    )
    const isOwner = profile?.owned_greenhouses.some(
        (g) => g.id === greenhouseId,
    )
    const isSuperuser = profile?.superuser
    const hasAccess = isCaretaker || isOwner || isSuperuser

    const handleEditMarketplaceProduct = (id: number) => {
        console.log(id)
        setSelectedMarketplaceProduct(id)
        onOpenEdit()
    }

    console.log(isOpenInventory)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">Products</h3>
                {hasAccess && products && (
                    <>
                        <Button
                            isIconOnly
                            color="primary"
                            size="sm"
                            onPress={onOpen}
                        >
                            <FaPlus />
                        </Button>
                        <Button
                            isIconOnly
                            color="secondary"
                            size="sm"
                            onPress={onOpenInventory}
                        >
                            <FaEdit />
                        </Button>
                        <EditGreenhouseProductInventoryModal
                            isOpen={isOpenInventory}
                            onOpenChange={onOpenInventoryChange}
                            onClose={onCloseInventory}
                            products={products}
                        />
                        <CreateGreenhouseProductModal
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            onClose={onClose}
                        />
                        <EditGreenhouseMarketplaceProductModal
                            isOpen={isOpenEdit}
                            onOpenChange={onOpenEditChange}
                            onClose={onCloseEdit}
                            marketplaceProductId={selectedMarketplaceProduct}
                            products={products}
                        />
                    </>
                )}
            </div>
            <div className="grid grow grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products &&
                    products.map((product) => (
                        <GreenhouseProduct
                            product={product}
                            key={product.id}
                            hasAccess={hasAccess === true}
                            editMarketplaceProduct={
                                handleEditMarketplaceProduct
                            }
                        />
                    ))}
            </div>
        </div>
    )
}

export const GreenhouseProduct = ({
    product,
    hasAccess,
    editMarketplaceProduct,
}: {
    product: GreenhouseProductType
    hasAccess: boolean | undefined
    editMarketplaceProduct: (id: number) => void
}) => {
    const { addItem } = useShoppingCartStore()
    return (
        <Card shadow="sm" className="h-full">
            <CardBody className="relative overflow-visible p-0">
                <ProductImage
                    image={product?.product?.image}
                    id={product?.id}
                    title={product?.product?.name}
                />
                {hasAccess && (
                    <Button
                        className="absolute left-0 top-0 z-10"
                        isIconOnly
                        color="primary"
                        onPress={() => editMarketplaceProduct(product.id!)}
                    >
                        <FaEdit />
                    </Button>
                )}
            </CardBody>
            <CardFooter className="flex justify-between text-small">
                <div className="flex flex-col">
                    <div className="flex w-full flex-wrap items-center justify-between">
                        <h1 className="text-lg">{product.product.name}</h1>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-default-500">${product.price}</p>
                        <p className="text-default-500">
                            {product.quantity} available
                        </p>
                    </div>
                </div>
                <div className="flex">
                    <Button
                        isIconOnly
                        color="primary"
                        onPress={() =>
                            addItem({
                                marketplaceProduct: product.id!,
                                quantity: 1,
                            })
                        }
                    >
                        <FaShoppingCart />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
