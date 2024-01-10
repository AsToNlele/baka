import { Image, Input } from "@nextui-org/react"
import { Greenhouse } from "../components/Greenhouse"
import {
    LevelCheckbox,
    useLevelCheckbox,
} from "../../../components/LevelCheckbox"

export const Greenhouses = () => {
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

    const greenhouses = Array(14).fill(0)

    return (
        <>
            <h1 className="text-3xl mb-8">Greenhouses</h1>
            <div className="flex gap-4">
                <div className="flex flex-col shrink gap-4">
                    <Input placeholder="Search" />
                    <Image src="https://placekitten.com/200/140" isZoomed />
                    <LevelCheckbox controls={controls} />
                </div>
                <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {greenhouses.map((_, i) => (
                        <Greenhouse
                            item={{
                                location: "Brno, Cernovice",
                                title: `Greenhouse ${i + 1}`,
                                img: `https://placedog.net/300/200?id=${i+1}`,
                                // img: `https://picsum.photos/300/200`
                                // img: `https://picsum.photos/id/${i+10}/300/200`,
                                
                                // img: `https://placekitten.com/300/200`
                                // img: `https://placekitten.com/300/200?image=${
                                //     (i % 16) + 1
                                // }`,
                            }}
                            key={i}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
