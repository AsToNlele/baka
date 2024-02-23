import { PageTitle } from "@/features/app/components/PageTitle"
import { useProductDetail } from "@/features/landing/marketplace/hooks/useProductDetail"
import { Image } from "@nextui-org/react"
import { useParams } from "react-router-dom"

export const ProductDetail = () => {
    const { id } = useParams()
    const productId = id ? parseInt(id) : null
    const { data } = useProductDetail(productId)
    return (
        <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-col gap-4">
                <PageTitle
                    title={`${data?.name}`}
                    backPath={`/app/marketplace/`}
                />
                <p>{data?.description}</p>
            </div>
            <div className="flex flex-1 justify-center">
                <div className="max-w-[400px] md:max-w-[60%] lg:max-w-[60%] xl:max-w-[600px]">
                    <Image
                        classNames={{
                            wrapper: "w-full",
                            img: "w-full aspect-4/3",
                        }}
                        src={`https://placedog.net/800/600?id=${data?.id}`}
                    />
                </div>
            </div>
        </div>
    )
}
