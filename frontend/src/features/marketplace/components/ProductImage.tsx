// Author: Alexandr Celakovsky - xcelak00
import { imageUrl } from "@/utils/utils"
import { Image } from "@nextui-org/react"

type ProductImageProps = {
    image: string | undefined | null
    id: number | null | undefined
    title?: string | undefined | null
}

const getFallbackProductImageUrl = (productId: number | null | undefined) => {
    const imageId = productId ? productId % 10 : 0 % 10
    const imageName = `fallback-product-images/product-${imageId}.png`
    return imageUrl(imageName)
}

const getProductImageUrl = (
    image: string | undefined | null,
    id: number | null | undefined,
) => {
    if (!image) {
        return getFallbackProductImageUrl(id)
    }
    return imageUrl(image ?? "")
}

export const ProductImage = ({ image, id, title }: ProductImageProps) => {
    return (
        <div className="max-h-[300px] max-w-[400px]">
            <Image
                shadow="sm"
                radius="lg"
                alt={title ?? "Product"}
                className="size-full object-contain"
                src={getProductImageUrl(image, id)}
                fallbackSrc={getFallbackProductImageUrl(id)}
                removeWrapper
            />
        </div>
    )
}
