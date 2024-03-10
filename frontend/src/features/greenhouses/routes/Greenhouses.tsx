import { Image, Input } from "@nextui-org/react"
import { Greenhouse } from "../components/Greenhouse"
import {
    LevelCheckbox,
    useLevelCheckbox,
} from "../../../components/LevelCheckbox"
import { useGreenhouseList } from "../hooks/useGreenhouseList"

export const Greenhouses = () => {
    const { data: greenhouses } = useGreenhouseList()
    const locationOptions = [
        {
            label: "Brno",
            value: "Brno",
            children: [
                {
                    label: "Cernovice",
                    value: "Brno-Cernovice",
                },
                {
                    label: "Lisen",
                    value: "Brno-Lisen",
                },
                {
                    label: "Komin",
                    value: "Brno-Komin",
                },
            ],
        },
        {
            label: "Prague",
            value: "Prague",
            children: [
                {
                    label: "Bohnice",
                    value: "Prague-Bohnice",
                },
                {
                    label: "Letnany",
                    value: "Prague-Letnany",
                },
                {
                    label: "Motol",
                    value: "Prague-Motol",
                },
            ],
        },
        {
            label: "Ostrava",
            value: "Ostrava",
        },
    ]

    const {
        controls,
        // locations
    } = useLevelCheckbox(locationOptions, {
        defaultLocations: ["Brno-*"],
    })

    return (
        <>
            <h1 className="mb-8 text-3xl">Greenhouses</h1>
            <div className="flex items-start gap-4">
                <div className="flex shrink flex-col gap-4">
                    <Input placeholder="Search" />
                    <Image src="https://placekitten.com/200/140" isZoomed />
                    <LevelCheckbox controls={controls} />
                </div>
                <div className="grid grow grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {greenhouses?.results?.map((item, i) => (
                        <Greenhouse item={item} key={i} />
                    ))}
                </div>
            </div>
        </>
    )
}
