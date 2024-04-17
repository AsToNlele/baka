import { imageUrl } from "@/utils/utils"
import { Image } from "@nextui-org/react"

type GreenhouseImageProps = {
    image: string | undefined | null
    title?: string | undefined | null
}
export const GreenhouseImage = ({ image, title }: GreenhouseImageProps) => {
    return (
        <Image
            shadow="sm"
            radius="lg"
            width="300"
            height="200"
            alt={title ?? "Greenhouse"}
            className="w-full object-cover"
            src={`${imageUrl(image!) === "" ? imageUrl("fallback-greenhouse.jpg") : imageUrl(image!)}`}
            fallbackSrc={`${imageUrl("fallback-greenhouse.jpg")}`}
            removeWrapper
        />
    )
}
