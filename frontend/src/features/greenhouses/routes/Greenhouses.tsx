import {  Image, Input } from "@nextui-org/react"
import { Greenhouse } from "../components/Greenhouse";
import { LevelCheckbox, useLevelCheckbox } from "../../../components/LevelCheckbox";

export const Greenhouses = () => {
	const locationOptions = [
		{
			label: "Brno",
			value: "Brno",
			children: [
				{
					label: "Cernovice",
					value: "Brno-Cernovice"
				},
				{
					label: "Lisen",
					value: "Brno-Lisen"
				},
				{
					label: "Komin",
					value: "Brno-Komin"
				}
			]
		},
		{
			label: "Prague",
			value: "Prague",
			children: [
				{
					label: "Bohnice",
					value: "Prague-Bohnice"
				},
				{
					label: "Letnany",
					value: "Prague-Letnany"
				},
				{
					label: "Motol",
					value: "Prague-Motol"
				}
			]
		},
		{
			label: "Ostrava",
			value: "Ostrava"
		}
	]

	const { controls, locations } = useLevelCheckbox(locationOptions, {defaultLocations: ["Brno-*"] })

	console.log(locations)

	return (
		<>
			<h1 className="text-3xl mb-8">Greenhouses</h1>
			<div className="flex gap-4">
				<div className="flex flex-col shrink gap-4">
					<Input placeholder="Search" />
					<Image src="https://placekitten.com/300/200" isZoomed />
					<LevelCheckbox controls={controls} />
				</div>
				<div className="grow">
					<Greenhouse item={{ title: "Greenhouse 1" }} />
				</div>
			</div>
		</>
	)
}
