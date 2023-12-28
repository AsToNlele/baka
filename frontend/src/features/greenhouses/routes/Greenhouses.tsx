import {  Image, Input } from "@nextui-org/react"
import { Greenhouse } from "../components/Greenhouse";

export const Greenhouses = () => {
	return (
		<>
			<h1 className="text-3xl mb-8">Greenhouses</h1>
			<div className="flex gap-4">
				<div className="flex flex-col shrink gap-4">
					<Input placeholder="Search" />
					<Image src="https://placekitten.com/300/200" isZoomed />
				</div>
				<div className="grow">
					<Greenhouse item={{ title: "Greenhouse 1" }} />
				</div>
			</div>
		</>
	)
}
