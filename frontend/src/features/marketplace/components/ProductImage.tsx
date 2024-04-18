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

const getProductImageUrl = (image: string | undefined | null, id: number | null | undefined) => {
    if (!image) {
        return getFallbackProductImageUrl(id)
    }
    return imageUrl(image ?? "")
}

export const ProductImage = ({ image, id, title }: ProductImageProps) => {
    console.log({ image, id, title })
    return (
        <Image
            shadow="sm"
            radius="lg"
            width="300"
            height="200"
            alt={title ?? "Product"}
            className="w-full object-cover"
            src={getProductImageUrl(image, id)}
            fallbackSrc={getFallbackProductImageUrl(id)}
            removeWrapper
        />
    )
}
