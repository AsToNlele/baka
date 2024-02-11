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
            <h1 className="text-3xl mb-8">Greenhouses</h1>
            <div className="flex gap-4 items-start">
                <div className="flex flex-col shrink gap-4">
                    <Input placeholder="Search" />
                    <Image src="https://placekitten.com/200/140" isZoomed />
                    <LevelCheckbox controls={controls} />
                </div>
                <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
                    {greenhouses?.results?.map((item, i) => (
                        <Greenhouse item={item} key={i} />
                    ))}
                </div>
            </div>
        </>
    )
}
