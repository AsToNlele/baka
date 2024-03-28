import { PageTitle } from "@/features/app/components/PageTitle"
import { useMyFlowerbedList } from "@/features/flowerbeds/hooks/useMyFlowerbedList"
import { FlowerbedType } from "@/utils/types"
import { Card, CardBody, CardFooter, Image, Link } from "@nextui-org/react"

export const MyFlowerbedList = () => {
    const { data } = useMyFlowerbedList()
    return (
        <div className="flex flex-col gap-8">
            <PageTitle title="My Flowerbeds" />
            <FlowerbedList flowerbeds={data || []} />
        </div>
    )
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
                    src={`https://placedog.net/800/600?id=${flowerbed.id!}`}
                // src={`https://placekitten.com/400/300?image=${
                //     flowerbed.id! % 17
                // }`}
                />
            </CardBody>
            <CardFooter className="justify-between text-small">
                <b>{flowerbed.name}</b>
                <span>{flowerbed.greenhouse.title}</span>
            </CardFooter>
        </Card>
    )
}

type FlowerbedListProps = {
    flowerbeds: readonly FlowerbedType[]
}

export const FlowerbedList = ({ flowerbeds }: FlowerbedListProps) => {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {flowerbeds.map((flowerbed) => (
                <Flowerbed key={flowerbed.id} flowerbed={flowerbed} />
            ))}
        </div>
    )
}
