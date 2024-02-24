import { useGreenhouseProductList } from "@/features/marketplace/hooks/useGreenhouseProductList"
import { GreenhouseProductType } from "@/utils/types"
import { useParams } from "react-router-dom"
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react"

export const GreenhouseProducts = () => {
    const { id } = useParams()
    const greenhouseId = id ? parseInt(id) : null
    const { data: products } = useGreenhouseProductList(greenhouseId)

    console.log(id)

    return (
        <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
            {products &&
                products.map((product) => (
                    <GreenhouseProduct product={product} key={product.id} />
                ))}
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
            <CardFooter className="text-small justify-between flex">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center w-full flex-wrap">
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
