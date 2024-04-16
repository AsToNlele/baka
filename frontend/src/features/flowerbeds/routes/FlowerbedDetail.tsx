import { PageTitle } from "@/features/app/components/PageTitle"
import { useFlowerbedDetail } from "@/features/flowerbeds/hooks/useFlowerbedDetail"
import {
    Button,
    Card,
    CardBody,
    Image,
    Link,
    useDisclosure,
} from "@nextui-org/react"
import { useParams } from "react-router-dom"
import { parseIsoAndFormat } from "@/utils/utils"
import { FaEdit } from "react-icons/fa"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { EditFlowerbedModal } from "@/features/flowerbeds/components/EditFlowerbedModal"
import { GreenhouseImage } from "@/features/greenhouses/components/GreenhouseImage"

export const FlowerbedDetail = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { data } = useFlowerbedDetail(flowerbedId)

    const { data: profile } = useProfile()

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    const isCaretaker = profile?.caretaker_greenhouses.some(
        (g) => g.id === data?.greenhouse.id,
    )
    const isOwner = profile?.owned_greenhouses.some(
        (g) => g.id === data?.greenhouse.id,
    )
    const isSuperuser = profile?.superuser
    const hasAccess = isCaretaker || isOwner || isSuperuser

    return (
        <>
            <div className="flex gap-2">
                <PageTitle
                    title={`Flowerbed ${data?.name}`}
                    backPath={`/app/greenhouses/${data?.greenhouse.id}?tab=flowerbeds`}
                />
                {data && hasAccess && (
                    <>
                        <Button isIconOnly color="primary" onClick={onOpen}>
                            <FaEdit />
                        </Button>
                        <EditFlowerbedModal
                            isOpen={isOpen}
                            onClose={onClose}
                            onOpenChange={onOpenChange}
                            flowerbed={data}
                        />
                    </>
                )}
            </div>

            <div className="mt-8 flex flex-col flex-wrap gap-2 sm:flex-row">
                <div className="grid flex-1 auto-rows-max grid-cols-2 gap-8 sm:grid-cols-2">
                    <div className="">
                        {!data ? (
                            <div></div>
                        ) : data?.currentRent ? (
                            <>
                                <h2 className="text-xl font-semibold">
                                    Rented
                                </h2>
                                <h3 className="text-lg">From</h3>
                                <p>
                                    {parseIsoAndFormat(
                                        data?.currentRent.rented_from,
                                    )}
                                </p>
                                <h3 className="text-lg">To</h3>
                                <p>
                                    {parseIsoAndFormat(
                                        data?.currentRent.rented_to,
                                    )}
                                </p>
                                {data.extendable && (
                                    <Button
                                        color="secondary"
                                        as={Link}
                                        href={`/app/flowerbeds/${data.id}/extend-rent`}
                                    >
                                        Extend
                                    </Button>
                                )}
                                {!data.extendable && data.rents && (
                                    <>
                                        <h3 className="text-lg">Extended To</h3>
                                        <p>
                                            {parseIsoAndFormat(
                                                data.rents[
                                                    data.rents.length - 1
                                                ].rented_to!,
                                            )}
                                        </p>
                                    </>
                                )}
                            </>
                        ) : (
                            <Button
                                color="secondary"
                                as={Link}
                                href={`/app/flowerbeds/${data?.id}/rent`}
                            >
                                Rent
                            </Button>
                        )}
                    </div>
                    <div className="">
                        <h2 className="text-xl font-semibold">Dimensions</h2>
                        <p>Width {data?.dimension_width}cm</p>
                        <p>Length {data?.dimension_height}cm</p>
                    </div>
                    <div className="">
                        <h2 className="text-xl font-semibold">Ideal for</h2>
                        <p>{data?.idealPlants}</p>
                    </div>
                    <div className="">
                        <h2 className="text-xl font-semibold">
                            Available tools
                        </h2>
                        <p>{data?.tools}</p>
                    </div>
                </div>
                <Card className="flex-1">
                    <CardBody className="flex flex-wrap items-center gap-2 lg:flex-row">
                        <div className="flex w-full flex-1 flex-col justify-around gap-2 sm:flex-row lg:flex-col xl:justify-start">
                            <div className="">
                                <h2 className="text-xl font-semibold">
                                    {data?.greenhouse.title}
                                </h2>
                                Open
                            </div>
                            <div className="">
                                <h3 className="text-lg font-semibold">
                                    Address
                                </h3>
                                <p>
                                    {data?.greenhouse.greenhouse_address.street}
                                </p>
                                <p>
                                    {data?.greenhouse.greenhouse_address.city}{" "}
                                    {data?.greenhouse.greenhouse_address
                                        .city_part &&
                                        `, ${data?.greenhouse.greenhouse_address.city_part}`}
                                </p>
                                <p>
                                    {
                                        data?.greenhouse.greenhouse_address
                                            .zipcode
                                    }
                                </p>
                            </div>
                            <div className="flex">
                                <Button
                                    color="primary"
                                    as={Link}
                                    href={`/app/greenhouses/${data?.greenhouse.id}`}
                                >
                                    Detail
                                </Button>
                            </div>
                        </div>
                        <div className="lg:max-w-[60%]">
                            <GreenhouseImage
                                image={data?.greenhouse.image}
                                title={data?.greenhouse.title}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}
