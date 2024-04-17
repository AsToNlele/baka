import { GreenhouseImage } from "@/features/greenhouses/components/GreenhouseImage"
import { Card, CardBody, CardFooter, Link } from "@nextui-org/react"
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa"
import { GreenhouseType } from "utils/types"

const StarRating = ({ rating }: { rating: number }) => {
    const ratingToArray = Array(5)
        .fill(0)
        .map((_, index) =>
            rating - index >= 1 ? 1 : rating - index >= 0.5 ? 0.5 : 0
        )

    return (
        <div className="flex">
            {ratingToArray.map((item, index) => (
                <div key={index} className="flex items-center">
                    {item === 1 ? (
                        <FaStar className="text-primary-500" />
                    ) : item === 0.5 ? (
                        <FaStarHalfAlt className="text-primary-500" />
                    ) : (
                        <FaRegStar className="text-primary-500" />
                    )}
                </div>
            ))}
        </div>
    )
}

const FreePlaces = ({ count }: { count: number }) =>
    count > 0 ? (
        <p className="text-default-500">
            {count} free place{count > 1 && "s"}{" "}
        </p>
    ) : (
        <p className="text-default-500">Full</p>
    )

export const Greenhouse = ({ item }: { item: GreenhouseType }) => {
    const { title, greenhouse_address, available_flowerbeds } = item

    const rating = Math.round(Math.random() * 5 * 10) / 10 + 1
    const freePlaces = parseInt(`${available_flowerbeds}`) || 0

    const address = greenhouse_address
        ? `${greenhouse_address.city}, ${greenhouse_address.city_part}`
        : "Brno, Cernovice"

    return (
        <Card
            shadow="sm"
            isPressable
            className="h-full"
            as={Link}
            href={`greenhouses/${item.id}?tab=flowerbeds`}
        >
            <CardBody className="overflow-visible p-0">
                <GreenhouseImage image={item.image} title={title} />
            </CardBody>
            <CardFooter className="flex flex-col justify-between text-small">
                <div className="flex w-full flex-wrap items-center justify-between">
                    <h1 className="text-lg">{title}</h1>
                    <StarRating rating={rating} />
                </div>
                <div className="flex size-full flex-wrap justify-between pt-1">
                    <p className="text-default-500">{address}</p>
                    <FreePlaces count={freePlaces} />
                </div>
            </CardFooter>
        </Card>
    )
}
