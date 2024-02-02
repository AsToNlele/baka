import { PageTitle } from "@/features/app/components/PageTitle"
import { useFlowerbedDetail } from "@/features/flowerbeds/hooks/useFlowerbedDetail"
import { Button, Card, CardBody, Image, Link } from "@nextui-org/react"
import { useParams } from "react-router-dom"
import { intlFormat } from "date-fns"

export const FlowerbedDetail = () => {
    const { id } = useParams()
    const flowerbedId = id ? parseInt(id) : null
    const { data, isLoading } = useFlowerbedDetail(flowerbedId)

    console.log({ data, isLoading })

    return (
        <>
            <PageTitle
                title={`Flowerbed ${data?.name}`}
                backPath={`/app/greenhouses/${data?.greenhouse.id}?tab=flowerbeds`}
            />

            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 gap-8 auto-rows-max">
                    <div className="">
                        <h2 className="text-xl font-semibold">Leased</h2>
                        <p>
                            From{" "}
                            {data?.currentLease &&
                                intlFormat(data?.currentLease.leased_from)}
                        </p>
                        <p>
                            To{" "}
                            {data?.currentLease &&
                                intlFormat(data?.currentLease.leased_to)}
                        </p>
                    </div>
                    <div className="">
                        <h2 className="text-xl font-semibold">Dimensions</h2>
                        <p>Width 50cm</p>
                        <p>Length 100cm</p>
                    </div>
                    <div className="">
                        <h2 className="text-xl font-semibold">Ideal for</h2>
                        <p>Tomatoes</p>
                        <p>Peppers</p>
                    </div>
                    <div className="">
                        <h2 className="text-xl font-semibold">
                            Available tools
                        </h2>
                        <p>Shovel</p>
                    </div>
                </div>
                <Card className="flex-1">
                    <CardBody className="flex flex-wrap lg:flex-row gap-2 items-center">
                        <div className="w-full justify-around xl:justify-start gap-2 flex flex-col sm:flex-row lg:flex-col flex-1">
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
