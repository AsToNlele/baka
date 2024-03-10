import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Image,
    Link,
    useDisclosure,
} from "@nextui-org/react"
import { PageTitle } from "@/features/app/components/PageTitle"
import { ProductType } from "@/utils/types"
import { useProductList } from "@/features/marketplace/hooks/useProductList"
import { FaPlus } from "react-icons/fa"
import { CreateSharedProductModal } from "@/features/marketplace/components/CreateSharedProductModal"

export const Marketplace = () => {
    const { data: products } = useProductList()

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    return (
        <div className="flex flex-col gap-4">
            <PageTitle title="Marketplace" />

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Products</h2>
                    <Button isIconOnly color="primary" size="sm" onPress={onOpen}>
                        <FaPlus />
                    </Button>
                    <CreateSharedProductModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        onClose={onClose}
                    />
                </div>
                {products && <ProductList products={products} />}
            </div>
        </div>
    )
}

const Product = ({ product }: { product: ProductType }) => {
    return (
        <Card
            shadow="sm"
            isPressable
            as={Link}
            href={`/app/marketplace/products/${product.id}`}
        >
            <CardBody className="overflow-visible p-0">
                <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={product.name!}
                    src={`https://placekitten.com/400/300?image=${product.id! % 17
                        }`}
                />
            </CardBody>
            <CardFooter className="justify-between text-small">
                <b>{product.name}</b>
                <p className="text-default-500">
                    {/* <FlowerbedStatus product={flowerbed} /> */}
                </p>
            </CardFooter>
        </Card>
    )
}

const ProductList = ({ products }: { products: ProductType[] }) => {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <Product key={product.id} product={product} />
            ))}
        </div>
    )
}
