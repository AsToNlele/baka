import { Card, CardBody, CardFooter, Image, Link } from "@nextui-org/react"
import { PageTitle } from "@/features/app/components/PageTitle"
import { ProductType } from "@/utils/types"
import { useProductList } from "@/features/marketplace/hooks/useProductList"

export const Marketplace = () => {
    const { data: products } = useProductList()
    console.log(products)
    return (
        <div className="flex flex-col gap-4">
            <PageTitle title="Marketplace" />

            {products && <ProductList products={products} />}
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
                    src={`https://placekitten.com/400/300?image=${
                        product.id! % 17
                    }`}
                />
            </CardBody>
            <CardFooter className="text-small justify-between">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product) => (
                <Product key={product.id} product={product} />
            ))}
        </div>
    )
}
