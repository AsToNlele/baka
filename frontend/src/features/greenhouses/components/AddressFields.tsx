import { EditGreenhouseInputs } from "@/features/greenhouses/components/EditGreenhouseModal"
import { Input } from "@nextui-org/react"
import { Control, Controller, ControllerRenderProps } from "react-hook-form"

import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import Leaflet, { LatLng, Map } from "leaflet"

import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { GreenhouseDetailResponse } from "@/utils/types"

const DefaultIcon = Leaflet.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [26, 42],
    iconAnchor: [13, 42],
    popupAnchor: [0, -42],
})

Leaflet.Marker.prototype.options.icon = DefaultIcon

export const AddressFieldsCreate = ({
    register,
}: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    register: any
}) => {
    return (
        <>
            <Input
                label="Country"
                placeholder="Country"
                {...register("greenhouse_address.country")}
                defaultValue={"CZ"}
            />
            <Input
                label="City"
                placeholder="City"
                {...register("greenhouse_address.city")}
            />
            <Input
                label="City part"
                placeholder="City part"
                {...register("greenhouse_address.city_part")}
            />
            <Input
                label="Street"
                placeholder="Street"
                {...register("greenhouse_address.street")}
            />
            <Input
                type="number"
                label="Zipcode"
                placeholder="Zipcode"
                {...register("greenhouse_address.zipcode")}
            />{" "}
            <Input
                label="Latitude"
                placeholder="Latitude"
                {...register("greenhouse_address.latitude")}
            />
            <Input
                label="Longitude"
                placeholder="Longitude"
                {...register("greenhouse_address.longitude")}
            />
        </>
    )
}

export const AddressFields = ({
    register,
    data,
    control,
}: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    register: any
    data: GreenhouseDetailResponse | null
    control: Control<EditGreenhouseInputs, any>
}) => {
    return (
        <>
            <Input
                label="Country"
                placeholder="Country"
                {...register("greenhouse_address.country")}
                defaultValue={data?.greenhouse_address.country ?? ""}
            />
            <Input
                label="City"
                placeholder="City"
                {...register("greenhouse_address.city")}
                defaultValue={data?.greenhouse_address.city ?? ""}
            />
            <Input
                label="City part"
                placeholder="City part"
                {...register("greenhouse_address.city_part")}
                defaultValue={data?.greenhouse_address.city_part ?? ""}
            />
            <Input
                label="Street"
                placeholder="Street"
                {...register("greenhouse_address.street")}
                defaultValue={data?.greenhouse_address.street ?? ""}
            />
            <Input
                type="number"
                label="Zipcode"
                placeholder="Zipcode"
                {...register("greenhouse_address.zipcode")}
                defaultValue={data?.greenhouse_address.zipcode ?? ""}
            />{" "}
            {data && <MapWithGeolocation control={control} data={data} />}
        </>
    )
}

export const MapWithGeolocation = ({
    control,
    data,
}: {
    control: Control<EditGreenhouseInputs, any>
    data: GreenhouseDetailResponse
}) => {
    return (
        <Controller
            name={"greenhouse_address"}
            control={control}
            defaultValue={{
                latitude: "0",
                longitude: "0",
            }}
            render={({ field }) => {
                console.log(
                    parseFloat(data?.greenhouse_address?.latitude ?? "0") ?? 0,
                )
                const initialPosition = new LatLng(
                    parseFloat(
                        data?.greenhouse_address?.latitude?.toString() ?? "0",
                    ) ?? 0,
                    parseFloat(
                        data?.greenhouse_address?.longitude?.toString() ?? "0",
                    ) ?? 0,
                )
                return (
                    <>
                        <Input
                            label="Latitude"
                            placeholder="Latitude"
                            value={field.value.latitude!}
                            onChange={(e) =>
                                field.onChange({
                                    ...field.value,
                                    latitude: e.target.value,
                                })
                            }
                        />
                        <Input
                            label="Longitude"
                            placeholder="Longitude"
                            value={field.value.longitude!}
                            onChange={(e) =>
                                field.onChange({
                                    ...field.value,
                                    longitude: e.target.value,
                                })
                            }
                        />
                        <ControllableMap
                            field={field}
                            initialPosition={initialPosition}
                        />
                    </>
                )
            }}
        />
    )
}

const ControllableMap = ({
    field,
    initialPosition,
}: {
    field: ControllerRenderProps<EditGreenhouseInputs, "greenhouse_address">
    initialPosition: LatLng
}) => {
    const [map, setMap] = useState<Map | null>(null)
    const markerRef = useRef<Leaflet.Marker<any>>(null)

    const onMove = useCallback(() => {
        if (map && markerRef.current) {
            console.log("PRE")
            const position = map.getCenter()
            console.log("POS",position)
            field.onChange({
                ...field.value,
                latitude: position.lat,
                longitude: position.lng,
            })
        }
    }, [map])

    useEffect(() => {
        map?.on("move", onMove)
        return () => {
            map?.off("move", onMove)
        }
    }, [map, onMove])
    useEffect(() => {
        markerRef?.current?.setLatLng([
            parseFloat(field.value.latitude?.toString() ?? "0") ?? 0,
            parseFloat(field.value.longitude?.toString() ?? "0") ?? 0,
        ])
    }, [field.value.latitude, field.value.longitude])


    const displayMap = useMemo(
        () => (
            <MapContainer
                center={initialPosition ?? [1, 1]}
                zoom={13}
                scrollWheelZoom={false}
                ref={setMap}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={initialPosition ?? [1, 1]} ref={markerRef}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        ),
        [],
    )

    return <>{displayMap}</>
}
