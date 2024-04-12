import { useGreenhouseProductList } from "@/features/marketplace/hooks/useGreenhouseProductList"
import { GreenhouseProductType } from "@/utils/types"
import { useParams } from "react-router-dom"
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Image,
    useDisclosure,
} from "@nextui-org/react"
import { FaEdit, FaPlus, FaShoppingCart } from "react-icons/fa"
import { CreateGreenhouseProductModal } from "@/features/marketplace/components/CreateGreenhouseProductModal"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { EditGreenhouseProductInventoryModal } from "@/features/marketplace/components/EditGreenhouseProductInventoryModal"

export const GreenhouseProducts = () => {
    const { id } = useParams()
    const greenhouseId = id ? parseInt(id) : null
    const { data: products } = useGreenhouseProductList(greenhouseId)

    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isOpenInventory,
        onOpenChange: onOpenInventoryChange,
        onOpen: onOpenInventory,
        onClose: onCloseInventory,
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

    console.log(isOpenInventory)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">Products</h3>
                {hasAccess && (
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
                    </>
                )}
            </div>
            <div className="grid grow grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products &&
                    products.map((product) => (
                        <GreenhouseProduct product={product} key={product.id} />
                    ))}
            </div>
        </div>
    )
}

export const GreenhouseProduct = ({
    product,
}: {
    product: GreenhouseProductType
}) => {
    const { addItem } = useShoppingCartStore()
    return (
        <Card shadow="sm" className="h-full">
            <CardBody className="overflow-visible p-0">
                <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    className="w-full object-cover"
                    src={`https://placedog.net/300/200?id=${product.id!}`}
                />
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
