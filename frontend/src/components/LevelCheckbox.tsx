import { Checkbox, CheckboxGroup } from "@nextui-org/react"
import { useEffect, useState } from "react"

export type LevelCheckboxControls = {
	locations: Array<string>,
	onChangeCapture: (e: React.ChangeEvent<HTMLInputElement>) => void
	locationOptions: LocationOptions
}

export type LocationOption = {
	label: string,
	value: string,
	children?: Array<LocationOption>
}

export type LocationOptions = Array<LocationOption>

export type LevelCheckboxConfig = {
	/**
	 * Default locations to be checked
	 * Whole parent can be checked by using Parent-*
	 */
	defaultLocations?: Array<string> | string
	
}

export const useLevelCheckbox = (locationOptions: LocationOptions, config?: LevelCheckboxConfig) => {
	const [locations, setLocationsState] = useState<Array<string>>(config && config.defaultLocations ? (Array.isArray(config.defaultLocations) ? config.defaultLocations : [config.defaultLocations]) : []);

	useEffect(() => {
		setLocations(prev => prev);
	}, [])

	const setLocations = (callback: (prev: Array<string>) => Array<string>) => {
		const tempLocations = callback(locations)
		console.log(tempLocations)
		locationOptions.forEach((parent) => {
			if (parent.children) {
				const allChildren = parent.children.map((child) => child.value)
				let allChildrenChecked = tempLocations.filter((item) => item.includes(`${parent.value}-`))
				allChildrenChecked = Array.from(new Set(allChildrenChecked))
				console.log(allChildrenChecked, allChildren)
				console.log(tempLocations.includes(parent.value), allChildrenChecked.length !== allChildren.length)
				// If parent has all children checked, add parent
				if (allChildrenChecked.length === allChildren.length && !tempLocations.includes(parent.value)) {
					tempLocations.push(parent.value)
				}
				// If default option is set to Parent-*, add all children
				else if (tempLocations.includes(`${parent.value }-*`)){
					tempLocations.push(...allChildren, parent.value)	
					tempLocations.splice(tempLocations.indexOf(`${parent.value }-*`), 1)
				}
				// If parent has all children unchecked, remove parent
				else if (tempLocations.includes(parent.value) && allChildrenChecked.length !== allChildren.length) {
					tempLocations.splice(tempLocations.indexOf(parent.value), 1)
				}
			}
		})

		let locationSet = new Set(tempLocations)
		setLocationsState(Array.from(locationSet))
	}

	const allLocations = [
		...locationOptions.map((item) => item.value),
		...locationOptions.filter(item => item.children!!).map((item) => item.children?.map((child) => child.value)).flat()
	]

	const onChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
		const item = e.target.value
		const isChecked = e.target.checked

		console.log("LOCS", locations)


		if (item.includes("-")) {
			setLocations(prev => isChecked ? [...prev, item] : prev.filter((prevItem) => prevItem !== item))
		} else {
			if (locationOptions.find((parent) => parent.value === item)?.children) {
				const children = allLocations.filter((child) => child && child.includes(item) && child !== item) as Array<string>
				setLocations(prev => isChecked ? [...prev, ...children] : prev.filter((prevItem) => !prevItem.includes(item)))
			} else {
				setLocations(prev => isChecked ? [...prev, item] : prev.filter((prevItem) => prevItem !== item))
			}
		}


	}

	return {
		locations,
		setLocations,
		controls: {
			onChangeCapture,
			locations,
			locationOptions
		}
	}
}

export const LevelCheckbox = (({ controls }: { controls: LevelCheckboxControls }) => {
	const { onChangeCapture, locations, locationOptions } = controls
	return (
		<CheckboxGroup label="Locations" value={locations} onChangeCapture={onChangeCapture}>
			{locationOptions.map((item) => {
				return (
					<div key={item.value + "-div"}>
						<Checkbox value={item.value} key={item.value}>
							{item.label}
						</Checkbox>
						<div className="ml-4 flex flex-col">
							{item.children?.map((child) => {
								return (
									<Checkbox value={child.value} key={child.value}>
										{child.label}
									</Checkbox>
								)
							})}
						</div>
					</div>
				)
			})}
		</CheckboxGroup>
	)
})
