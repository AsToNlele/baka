// Author: Alexandr Celakovsky - xcelak00
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import Leaflet from "leaflet"

import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
import { Card } from "@nextui-org/react"

const DefaultIcon = Leaflet.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [26, 42],
    iconAnchor: [13, 42],
    popupAnchor: [0, -42],
})

Leaflet.Marker.prototype.options.icon = DefaultIcon
type MapProps = {
    position: [number, number]
}
export const Map = ({ position }: MapProps) => {
    let finalPosition = position
    if (!position || (Array.isArray(position) && position.some(isNaN))) {
        finalPosition = [49.1951, 16.6068]
    }
    return (
        <Card>
            <div className="h-[400px]">
                <MapContainer
                    key={finalPosition?.[0] ?? "map"}
                    center={finalPosition ?? [49.1951, 16.6068]}
                    zoom={13}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={finalPosition}>
                        <Popup>Greenhouse</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </Card>
    )
}
