import { useParams, useSearchParams } from "react-router-dom"
import { useGreenhouseDetail } from "../hooks/useGreenhouseDetail"
import { PageTitle } from "@/features/app/components/PageTitle"
import {
    Button,
    Card,
    CardBody,
    Tab,
    Tabs,
    useDisclosure,
} from "@nextui-org/react"
import "leaflet/dist/leaflet.css"
import { Key, useEffect } from "react"
import { FaEdit, FaImage, FaUsersCog } from "react-icons/fa"
import { EditGreenhouseModal } from "@/features/greenhouses/components/EditGreenhouseModal"
import { useProfile } from "@/features/auth/hooks/useProfile"
import { GreenhouseProducts } from "@/features/marketplace/components/GreenhouseProducts"
import { dayNumberToDay, formatTime } from "@/utils/utils"
import { SetGreenhouseUsersModal } from "@/features/greenhouses/components/SetGreenhouseUsersModal"
import { FlowerbedTab } from "@/features/flowerbeds/components/FlowerbedTab"
import { GreenhouseImage } from "@/features/greenhouses/components/GreenhouseImage"
import { GreenhouseImageUploadModal } from "@/features/greenhouses/components/GreenhouseImageUploadModal"
import { Map } from "@/features/greenhouses/components/Map"
import { GreenhouseStats } from "@/features/greenhouses/components/GreenhouseStats"

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
    const {
        isOpen: isUsersOpen,
        onOpen: onOpenUsers,
        onClose: onCloseUsers,
    } = useDisclosure()
    const {
        isOpen: isImageOpen,
        onOpen: onOpenImage,
        onClose: onCloseImage,
    } = useDisclosure()

    const { data: user } = useProfile()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!data) {
        return <div>Greenhouse not found</div>
    }

    const userIsAdminOrOwnerOrCareTaker = () =>
        user?.superuser ||
        user?.profile?.id === data.owner ||
        user?.profile?.id === data.caretaker

    const userIsAdminOrOwner = () =>
        user?.superuser || user?.profile?.id === data.owner

    const mapPosition = [
        parseFloat(data?.greenhouse_address?.latitude + "") ?? 0,
        parseFloat(data?.greenhouse_address?.longitude + "") ?? 0,
    ]

    return (
        <>
            <div className="mb-8 flex gap-2">
                <PageTitle title={data.title!} />
                {userIsAdminOrOwnerOrCareTaker() && (
                    <>
                        <Button color="secondary" isIconOnly onPress={onOpen}>
                            <FaEdit />
                        </Button>
                        <Button
                            color="warning"
                            isIconOnly
                            onPress={onOpenUsers}
                            size="md"
                        >
                            <FaUsersCog size={20} />
                        </Button>
                        <Button
                            color="primary"
                            isIconOnly
                            onPress={onOpenImage}
                            size="md"
                        >
                            <FaImage size={20} />
                        </Button>

                        <EditGreenhouseModal
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            onClose={onClose}
                        />

                        <SetGreenhouseUsersModal
                            isOpen={isUsersOpen}
                            onOpenChange={onOpenUsers}
                            onClose={onCloseUsers}
                        />

                        <GreenhouseImageUploadModal
                            isOpen={isImageOpen}
                            onOpenChange={onOpenImage}
                            onClose={onCloseImage}
                            greenhouseId={greenhouseId}
                        />
                    </>
                )}
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
                <div className="flex flex-1 justify-center">
                    <GreenhouseImage image={data.image} title={data.title} />
                </div>
                <div className="flex flex-1 flex-col gap-8">
                    <div className="flex flex-wrap justify-between gap-8 sm:justify-around lg:justify-evenly">
                        <div className="flex-col">
                            <h2 className="mb-2 flex-1 text-lg font-semibold">
                                Opening hours
                            </h2>
                            {/* <p>Open</p> */}
                            <div className="mt-2 flex flex-col gap-2">
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
                            </div>
                        </div>
                        <div className="flex justify-center md:col-span-1 md:col-start-3 xl:col-span-2">
                            <div className="flex flex-col">
                                <h2 className="mb-2 text-lg font-semibold">
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
                    <Map position={[mapPosition[0], mapPosition[1]]} />
                </div>
            </div>
            <Tabs
                defaultSelectedKey="flowerbeds"
                selectedKey={searchParams.get("tab")}
                onSelectionChange={setTab}
                aria-label="Tabs"
                className="mt-10"
            >
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
                            {data && (
                                <FlowerbedTab
                                    flowerbeds={data.flowerbeds!}
                                    greenhouseId={greenhouseId!}
                                    greenhouse={data}
                                />
                            )}
                        </CardBody>
                    </Card>
                </Tab>
                {userIsAdminOrOwner() && (
                    <Tab key="stats" title="Stats">
                        <Card>
                            <GreenhouseStats
                                greenhouseId={greenhouseId!}
                            />
                        </Card>
                    </Tab>
                )}
            </Tabs>
        </>
    )
}
