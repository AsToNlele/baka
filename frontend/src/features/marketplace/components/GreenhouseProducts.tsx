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
import { FaPlus } from "react-icons/fa"
import { CreateGreenhouseProductModal } from "@/features/marketplace/components/CreateGreenhouseProductModal"

export const GreenhouseProducts = () => {
    const { id } = useParams()
    const greenhouseId = id ? parseInt(id) : null
    const { data: products } = useGreenhouseProductList(greenhouseId)

    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">Products</h3>
                <Button isIconOnly color="primary" size="sm" onPress={onOpen}>
                    <FaPlus />
                </Button>
                <CreateGreenhouseProductModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onClose={onClose}
                />
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
                <div className="flex">{/* TODO ADD TO CART */}</div>
            </CardFooter>
        </Card>
    )
}
