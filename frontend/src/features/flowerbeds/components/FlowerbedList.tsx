import { FlowerbedType } from "@/utils/types"
import { Card, CardBody, CardFooter, Image, Link } from "@nextui-org/react"

type FlowerbedListProps = {
    flowerbeds: readonly FlowerbedType[]
    greenhouseId?: number | string // If not set, expect to be in My Flowerbeds page
}

const FlowerbedStatus = ({ flowerbed }: { flowerbed: FlowerbedType }) => {
    if (flowerbed.disabled) {
        return "Disabled"
    } else if (flowerbed.currentLease) {
        return "Leased"
    } else {
        return "Available"
    }
}

const Flowerbed = ({ flowerbed }: { flowerbed: FlowerbedType }) => {
    return (
        <Card
            shadow="sm"
            isPressable
            as={Link}
            href={`/app/flowerbeds/${flowerbed.id}`}
        >
            <CardBody className="overflow-visible p-0">
                <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={flowerbed.name!}
                    src={`https://placekitten.com/400/300?image=${flowerbed.id}`}
                />
            </CardBody>
            <CardFooter className="text-small justify-between">
                <b>{flowerbed.name}</b>
                <p className="text-default-500">
                    <FlowerbedStatus flowerbed={flowerbed} />
                </p>
            </CardFooter>
        </Card>
    )
}

export const FlowerbedList = ({
    flowerbeds,
} // greenhouseId,
    : FlowerbedListProps) => {
    // const hasGreenhouseId = greenhouseId !== undefined

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {flowerbeds.map((flowerbed) => (
                <Flowerbed key={flowerbed.id} flowerbed={flowerbed} />
            ))}
        </div>
    )
}
