// Author: Alexandr Celakovsky - xcelak00
import { ProductImage } from "@/features/marketplace/components/ProductImage"
import { GetPickupLocationsType } from "@/utils/types"
import { dayNumberToDay, formatTime } from "@/utils/utils"
import { Card, CardBody } from "@nextui-org/react"

export const OrderPickupItem = ({ pickup }: { pickup: GetPickupLocationsType }) => {
    return (
        <div>
            <div className="flex flex-col gap-16 md:flex-row">
                <div className="flex flex-1 flex-col gap-8">
                    <h2 className="text-center text-xl font-semibold">
                        {pickup.greenhouse?.title}
                    </h2>
                    <div className="flex flex-wrap justify-between gap-8 sm:justify-around lg:justify-evenly">
                        <div className="flex-col">
                            <h2 className="mb-2 flex-1 text-lg font-semibold">
                                Opening hours
                            </h2>
                            <div className="mt-2 flex flex-col gap-2">
                                {pickup.greenhouse?.greenhouse_business_hours?.map(
                                    (day) => (
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
                                    ),
                                )}
                            </div>
                        </div>
                        <div className="flex justify-center md:col-span-1 md:col-start-3 xl:col-span-2">
                            <div className="flex flex-col">
                                <h2 className="mb-2 text-lg font-semibold">
                                    Address
                                </h2>
                                <p>
                                    {
                                        pickup.greenhouse?.greenhouse_address
                                            ?.street
                                    }
                                </p>
                                <p>
                                    {pickup.greenhouse.greenhouse_address?.city}{" "}
                                    {pickup.greenhouse.greenhouse_address
                                        ?.city_part &&
                                        `, ${pickup.greenhouse.greenhouse_address?.city_part}`}
                                </p>
                                <p>
                                    {
                                        pickup.greenhouse?.greenhouse_address
                                            ?.zipcode
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="h-full md:min-h-48">
                        <Card className="h-full max-h-[300px]">
                            <iframe
                                className="size-full"
                                src={`https://maps.google.com/maps?q=${pickup.greenhouse.greenhouse_address.latitude},${pickup.greenhouse.greenhouse_address.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </Card>
                    </div>
                </div>
                <div className="flex flex-1 flex-col justify-start">
                    <div>
                        <h2 className="text-xl font-semibold">Items</h2>
                        <div className="flex flex-col gap-4">
                            {pickup.items.map((item) => (
                                <Card shadow="sm" key={item.id}>
                                    <CardBody className="justify-between overflow-visible object-cover p-0">
                                        <div className="flex h-full justify-between gap-2">
                                            <ProductImage
                                                id={item.productId}
                                                image={item?.productImage}
                                                title={item?.productName}
                                            />
                                            <div className="flex flex-1 flex-col items-center justify-center">
                                                <div>
                                                    <h1 className="text-lg">
                                                        {item.productName}
                                                    </h1>
                                                    <p className="text-default-500">
                                                        {item.quantity}x
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
