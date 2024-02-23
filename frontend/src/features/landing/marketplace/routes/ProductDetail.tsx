import { PageTitle } from "@/features/app/components/PageTitle"
import { useProductDetail } from "@/features/landing/marketplace/hooks/useProductDetail"
import { useProductListingsList } from "@/features/landing/marketplace/hooks/useProductListingsList"
import { ProductListingType } from "@/utils/types"
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react"
import { useParams } from "react-router-dom"

export const ProductDetail = () => {
    const { id } = useParams()
    const productId = id ? parseInt(id) : null
    const { data: product } = useProductDetail(productId)
    const { data: listings } = useProductListingsList(productId)
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col gap-4">
                    <PageTitle
                        title={`${product?.name}`}
                        backPath={`/app/marketplace/`}
                    />
                    <p>{product?.description}</p>
                </div>
                <div className="flex flex-1 justify-center">
                    <div className="max-w-[400px] md:max-w-[60%] lg:max-w-[60%] xl:max-w-[600px]">
                        <Image
                            classNames={{
                                wrapper: "w-full",
                                img: "w-full aspect-4/3",
                            }}
                            src={`https://placedog.net/800/600?id=${product?.id}`}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Listings</h2>
                {listings && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
    return (
        <Card shadow="sm" className="h-full">
            <CardBody className="overflow-visible p-0">
                <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    className="w-full object-cover"
                    src={`https://placedog.net/300/200?id=${listing.id!}`}
                />
            </CardBody>
            <CardFooter className="text-small justify-between flex">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center w-full flex-wrap">
                        <h1 className="text-lg">{listing.greenhouse.title}</h1>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-default-500">${listing.price}</p>
                        <p className="text-default-500">
                            {listing.quantity} available
                        </p>
                    </div>
                </div>
                <div className="flex">{/* TODO ADD TO CART */}</div>
            </CardFooter>
        </Card>
    )
}
