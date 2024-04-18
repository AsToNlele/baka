import { useProfile } from "@/features/auth/hooks/useProfile"
import { FlowerbedImage } from "@/features/flowerbeds/components/FlowerbedImage"
import { useIsAdmin } from "@/hooks/isAdmin"
import { FlowerbedType, GreenhouseType } from "@/utils/types"
import { Card, CardBody, CardFooter, Link } from "@nextui-org/react"

type FlowerbedListProps = {
    flowerbeds: readonly FlowerbedType[]
    greenhouseId?: number | string // If not set, expect to be in My Flowerbeds page
    greenhouse: GreenhouseType
}

const FlowerbedStatus = ({ flowerbed }: { flowerbed: FlowerbedType }) => {
    if (flowerbed.disabled) {
        return "Disabled"
    } else if (flowerbed.currentRent) {
        return "Leased"
    } else {
        return "Available"
    }
}

const Flowerbed = ({ flowerbed }: { flowerbed: FlowerbedType }) => {
    // const isRenter = flowerbed.currentRent
    return (
        <Card
            shadow="sm"
            isPressable
            as={Link}
            href={`/app/flowerbeds/${flowerbed.id}`}
        >
            <CardBody className="overflow-visible p-0">
                <FlowerbedImage id={flowerbed.id} title={flowerbed.name} />
            </CardBody>
            <CardFooter className="justify-between text-small">
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
    greenhouse,
}: FlowerbedListProps) => {
    const { data: user } = useProfile()
    const userIsAdminOrOwnerOrCareTaker = () =>
        greenhouse
            ? user?.superuser ||
            user?.profile?.id === greenhouse.owner ||
            user?.profile?.id === greenhouse.caretaker
            : false

    if (!flowerbeds) {
        return null
    }

    let filteredFlowerbeds = flowerbeds

    console.log(user.data)
    console.log(userIsAdminOrOwnerOrCareTaker())

    // filter out disabled flowerbeds
    if ((greenhouse && !user) || !userIsAdminOrOwnerOrCareTaker()) {
        filteredFlowerbeds = filteredFlowerbeds.filter(
            (flowerbed) => !flowerbed.disabled,
        )
    }

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filteredFlowerbeds?.map((flowerbed) => (
                <Flowerbed key={flowerbed.id} flowerbed={flowerbed} />
            ))}
        </div>
    )
}
