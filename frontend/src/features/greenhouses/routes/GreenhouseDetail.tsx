import { useParams, useSearchParams } from "react-router-dom"
import { useGreenhouseDetail } from "../hooks/useGreenhouseDetail"
import { PageTitle } from "@/features/app/components/PageTitle"
import {
    Button,
    Card,
    CardBody,
    Image,
    Tab,
    Tabs,
    useDisclosure,
} from "@nextui-org/react"
import { Key, useEffect } from "react"
import { FlowerbedList } from "@/features/flowerbeds/components/FlowerbedList"
import { FaEdit } from "react-icons/fa"
import { EditGreenhouseModal } from "@/features/greenhouses/components/EditGreenhouseModal"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { format } from "date-fns"
import { GreenhouseProducts } from "@/features/marketplace/components/GreenhouseProducts"

export const GreenhouseDetail = () => {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        if (!searchParams.get("tab")) {
            setSearchParams((prev) => {
                prev.set("tab", "flowerbeds")
                return prev
            })
        }
    }, [searchParams, setSearchParams])

    const setTab = (key: Key) => {
        setSearchParams((prev) => {
            prev.set("tab", key.toString())
            return prev
        })
    }

    const greenhouseId = id ? parseInt(id) : null
    const { data, isLoading } = useGreenhouseDetail(greenhouseId)
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

    const { data: user } = useProfile()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!data) {
        return <div>Greenhouse not found</div>
    }

    const userIsOwnerOrCareTaker = () =>
        user?.profile?.id === data.owner || user?.profile?.id === data.caretaker

    const dayNumberToDay = (dayNumber: number) => {
        switch (dayNumber) {
            case 0:
                return "Sunday"
            case 1:
                return "Monday"
            case 2:
                return "Tuesday"
            case 3:
                return "Wednesday"
            case 4:
                return "Thursday"
            case 5:
                return "Friday"
            case 6:
                return "Saturday"
            default:
                return "Unknown"
        }
    }

    const formatTime = (timeString: string) => {
        const date = new Date(
            0,
            0,
            0,
            parseInt(timeString.split(":")[0]),
            parseInt(timeString.split(":")[1]),
        )
        return format(date, "HH:mm")
        // const [hours, minutes] = timeString.split(":")
        // return new Date(0, 0, 0, parseInt(hours), parseInt(minutes))
    }

    return (
        <>
            <div className="flex gap-2 mb-8">
                <PageTitle title={data.title!} />
                {userIsOwnerOrCareTaker() && (
                    <Button color="secondary" isIconOnly onPress={onOpen}>
                        <FaEdit />
                    </Button>
                )}
            </div>

            <EditGreenhouseModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
            />

            <div className="flex gap-8 flex-col md:flex-row">
                <div className="flex-1 flex justify-center">
                    <Image
                        classNames={{
                            wrapper: "w-full",
                            img: "w-full aspect-4/3",
                        }}
                        src={`https://placedog.net/800/600?id=${data.id!}`}
                        height={160}
                    />
                </div>
                <div className="flex flex-col flex-1 gap-8">
                    <div className="flex flex-wrap gap-8 justify-between sm:justify-around lg:justify-evenly">
                        <div className="flex-col">
                            <h2 className="text-lg font-semibold mb-2 flex-1">
                                Opening hours
                            </h2>
                            {/* <p>Open</p> */}
                            <div className="flex flex-col mt-2 gap-2">
                                {data?.greenhouse_business_hours?.map((day) => (
                                    <div
                                        className="flex justify-between gap-2"
                                        key={`${day.id}${day.day}`}
                                    >
                                        <p>{dayNumberToDay(day.day)}</p>
                                        <div>
                                            {day.greenhouse_business_hour_periods.map(
                                                (period) => (
                                                    <p
                                                        key={`${period.id}${period.open}${period.close}`}
                                                    >
                                                        {formatTime(
                                                            period.open,
                                                        )}{" "}
                                                        -{" "}
                                                        {formatTime(
                                                            period.close,
                                                        )}
                                                    </p>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* <div className="flex flex-col"> */}
                                {/*     <p>Monday</p> */}
                                {/*     <p>Tuesday</p> */}
                                {/*     <p>Wednesday</p> */}
                                {/*     <p>Thursday</p> */}
                                {/*     <p>Friday</p> */}
                                {/* </div> */}
                                {/* <div className="flex flex-col whitespace-nowrap"> */}
                                {/*     <p>9:00 - 17:00</p> */}
                                {/*     <p>9:00 - 17:00</p> */}
                                {/*     <p>9:00 - 17:00</p> */}
                                {/*     <p>9:00 - 17:00</p> */}
                                {/*     <p>9:00 - 17:00</p> */}
                                {/* </div> */}
                            </div>
                        </div>
                        <div className="md:col-start-3 md:col-span-1 xl:col-span-2 flex justify-center">
                            <div className="flex flex-col">
                                <h2 className="text-lg font-semibold mb-2">
                                    Address
                                </h2>
                                <p>{data?.greenhouse_address?.street}</p>
                                <p>
                                    {data?.greenhouse_address?.city}{" "}
                                    {data?.greenhouse_address?.city_part &&
                                        `, ${data.greenhouse_address?.city_part}`}
                                </p>
                                <p>{data?.greenhouse_address?.zipcode}</p>
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
            <Tabs
                defaultSelectedKey="flowerbeds"
                selectedKey={searchParams.get("tab")}
                onSelectionChange={setTab}
                aria-label="Tabs"
                className="mt-10"
            >
                <Tab key="overview" title="Overview">
                    <Card className="rounded-t">
                        <CardBody>Hello there</CardBody>
                    </Card>
                </Tab>
                <Tab key="marketplace" title="Marketplace">
                    <Card>
                        <CardBody>
                            <GreenhouseProducts />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="flowerbeds" title="Flowerbeds">
                    <Card>
                        <CardBody>
                            <FlowerbedList
                                flowerbeds={data.flowerbeds!}
                                greenhouseId={id}
                            />
                        </CardBody>
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
