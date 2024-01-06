import { Card, CardBody, CardFooter, Image } from "@nextui-org/react"
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa"

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

export const Greenhouse = ({ item }: { item: any }) => {
    const {
        title,
        location,
        img,
        // rating, freePlaces
    } = item

    const rating = Math.round(Math.random() * 5 * 10) / 10 + 1
    const freePlaces = Math.floor(Math.random() * 5)

    return (
        <Card shadow="sm" isPressable>
            <CardBody className="overflow-visible p-0">
                <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={title}
                    className="w-full object-cover"
                    src={img}
                />
            </CardBody>
            <CardFooter className="text-small justify-between flex flex-col">
                <div className="flex justify-between items-center w-full flex-wrap">
                    <h1 className="text-lg">{title}</h1>
                    <StarRating rating={rating} />
                </div>
                <div className="flex justify-between h-full pt-1 w-full flex-wrap">
                    <p className="text-default-500">
                        {location ?? "Brno, Cernovice"}
                    </p>
                    <FreePlaces count={freePlaces} />
                </div>
            </CardFooter>
        </Card>
    )
}
