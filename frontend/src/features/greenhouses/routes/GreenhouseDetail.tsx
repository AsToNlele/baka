import { useParams } from "react-router-dom"
import { useGreenhouseDetail } from "../hooks/useGreenhouseDetail"
import { PageTitle } from "@/features/app/components/PageTitle"
import { Card, CardBody, Divider, Image, Tab, Tabs } from "@nextui-org/react"

export const GreenhouseDetail = () => {
    const { id } = useParams()

    const greenhouseId = id ? parseInt(id) : null
    console.log({ greenhouseId })
    const { data, isLoading } = useGreenhouseDetail(greenhouseId)

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!data) {
        return <div>Greenhouse not found</div>
    }

    return (
        <>
            <PageTitle title={data.title!} />

            <div className="flex gap-8 flex-col md:flex-row">
                <div className="flex-1 flex justify-center">
                    <Image
                        classNames={{
                            wrapper: "w-full",
                            img: "w-full aspect-4/3",
                        }}
                        src={`https://placedog.net/800/600`}
                        height={160}
                    />
                </div>
                <div className="flex flex-col flex-1 gap-8">
                    <div className="flex flex-wrap gap-8 justify-between sm:justify-around lg:justify-evenly">
                        <div className="flex-col">
                            <h2 className="text-lg font-semibold mb-2 flex-1">
                                Opening hours
                            </h2>
                            <p>Open</p>
                            <div className="flex mt-2 gap-2">
                                <div className="flex flex-col">
                                    <p>Monday</p>
                                    <p>Tuesday</p>
                                    <p>Wednesday</p>
                                    <p>Thursday</p>
                                    <p>Friday</p>
                                </div>
                                <div className="flex flex-col whitespace-nowrap">
                                    <p>9:00 - 17:00</p>
                                    <p>9:00 - 17:00</p>
                                    <p>9:00 - 17:00</p>
                                    <p>9:00 - 17:00</p>
                                    <p>9:00 - 17:00</p>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-start-3 md:col-span-1 xl:col-span-2 flex justify-center">
                            <div className="flex flex-col">
                                <h2 className="text-lg font-semibold mb-2">
                                    Address
                                </h2>
                                <p>{data.greenhouse_address.street}</p>
                                <p>
                                    {data.greenhouse_address.city}{" "}
                                    {data.greenhouse_address.city_part &&
                                        `, ${data.greenhouse_address.city_part}`}
                                </p>
                                <p>{data.greenhouse_address.zipcode}</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:min-h-48 h-full">
                        <Card className="h-full">
                            <iframe
                                className="w-full h-full"
                                src={`https://maps.google.com/maps?q=${data.greenhouse_address.latitude},${data.greenhouse_address.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </Card>
                    </div>
                </div>
            </div>
            {/* <Divider className="my-8" /> */}
            <Tabs aria-label="Options" className="mt-10">
                <Tab key="overview" title="Overview">
                    <Card>
                        <CardBody>Hello there</CardBody>
                    </Card>
                </Tab>
                <Tab key="marketplace" title="Marketplace">
                    <Card>
                        <CardBody>Hello there</CardBody>
                    </Card>
                </Tab>
                <Tab key="flowerbeds" title="Flowerbeds">
                    <Card>
                        <CardBody>Hello there</CardBody>
                    </Card>
                </Tab>
                <Tab key="rules" title="Rules">
                    <Card>
                        <CardBody>Hello there</CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </>
    )
}
