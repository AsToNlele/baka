// Author: Alexandr Celakovsky - xcelak00
import { PageTitle } from "@/features/app/components/PageTitle"
import { GreenhouseImage } from "@/features/greenhouses/components/GreenhouseImage"
import { ProductImage } from "@/features/marketplace/components/ProductImage"
import { useProductDetail } from "@/features/marketplace/hooks/useProductDetail"
import { useProductListingsList } from "@/features/marketplace/hooks/useProductListingsList"
import { useShoppingCartStore } from "@/features/marketplace/stores/useShoppingCartStore"
import { ProductListingType } from "@/utils/types"
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react"
import { FaShoppingCart } from "react-icons/fa"
import { useParams } from "react-router-dom"

export const ProductDetail = () => {
    const { id } = useParams()
    const productId = id ? parseInt(id) : null
    const { data: product } = useProductDetail(productId)
    const { data: listings } = useProductListingsList(productId)
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row">
                <div className="flex flex-col gap-4">
                    <PageTitle
                        title={`${product?.name}`}
                        backPath={`/app/marketplace/`}
                    />
                    <p>{product?.description}</p>
                </div>
                <div className="flex flex-1 justify-center">
                    <div className="max-w-[400px] md:max-w-[60%] lg:max-w-[60%] xl:max-w-[600px]">
                        <ProductImage
                            image={product?.image}
                            id={product?.id}
                            title={product?.name}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Listings</h2>
                {listings && (
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {listings.map((listing) => (
                            <ProductListing
                                listing={listing}
                                key={listing.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

type ProductListingProps = {
    listing: ProductListingType
}

const ProductListing = ({ listing }: ProductListingProps) => {
    const { addItem } = useShoppingCartStore()
    return (
        <Card shadow="sm" className="h-full">
            <CardBody className="overflow-visible p-0">
                <GreenhouseImage
                    title={listing.greenhouse.title}
                    image={listing.greenhouse.image}
                />
            </CardBody>
            <CardFooter className="flex justify-between text-small">
                <div className="flex flex-col">
                    <div className="flex w-full flex-wrap items-center justify-between">
                        <h1 className="text-lg">{listing.greenhouse.title}</h1>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-default-500">${listing.price}</p>
                        <p className="text-default-500">
                            {listing.quantity} available
                        </p>
                    </div>
                </div>
                <div className="flex">
                    <Button
                        isIconOnly
                        color="primary"
                        onPress={() =>
                            addItem({
                                marketplaceProduct: listing.id!,
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
