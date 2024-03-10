import { PageTitle } from "@/features/app/components/PageTitle"
import { useFlowerbedDetail } from "@/features/flowerbeds/hooks/useFlowerbedDetail"
import { Button, Card, CardBody, Image, Link } from "@nextui-org/react"
import { useParams } from "react-router-dom"
import { parseIsoAndFormat } from "@/utils/utils"

export const FlowerbedDetail = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { data } = useFlowerbedDetail(flowerbedId)

    return (
        <>
            <PageTitle
                title={`Flowerbed ${data?.name}`}
                backPath={`/app/greenhouses/${data?.greenhouse.id}?tab=flowerbeds`}
            />

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
                                        data?.currentRent.rented_from
                                    )}
                                </p>
                                <h3 className="text-lg">To</h3>
                                <p>
                                    {parseIsoAndFormat(
                                        data?.currentRent.rented_to
                                    )}
                                </p>
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
                            <Image
                                classNames={{
                                    wrapper: "w-full",
                                    img: "w-full aspect-4/3",
                                }}
                                src={`https://placedog.net/800/600?id=${data?.greenhouse.id}`}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}
