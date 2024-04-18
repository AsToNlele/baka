
import { imageUrl } from "@/utils/utils"
import { Image } from "@nextui-org/react"

type FlowerbedImageProps = {
    id?: number | null
    title?: string | undefined | null
}

const getFlowerbedImageUrl = (flowerbedId: number | null | undefined) => {
    const imageId = flowerbedId ? flowerbedId % 10 : 0 % 10
    const imageName = `flowerbed-images/flowerbed-${imageId}.jpg`
    return imageUrl(imageName)
}

export const FlowerbedImage = ({ id, title }: FlowerbedImageProps) => {
    return (
        <Image
            shadow="sm"
            radius="lg"
            width="300"
            height="200"
            alt={title ?? "Flowerbed"}
            className="w-full object-cover"
            src={getFlowerbedImageUrl(id)}
            removeWrapper
        />
    )
}
