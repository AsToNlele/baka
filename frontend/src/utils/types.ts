// Import schema.d.ts file
import { components, paths } from "types/schema"

export type ProfileType = paths["/api/users/me/"]["get"]["responses"][200]["content"]["application/json"]

export type GreenhouseType = components["schemas"]["Greenhouse"]
export type GreenhouseListResponse = paths["/api/greenhouses/"]["get"]["responses"][200]["content"]["application/json"]
export type GreenhouseDetailResponse = paths["/api/greenhouses/{id}/"]["get"]["responses"][200]["content"]["application/json"]

type GreenhouseEditRequest = paths["/api/greenhouses/{id}/edit_greenhouse/"]["put"]["requestBody"]
export type EditGreenhouseRequest = Exclude<GreenhouseEditRequest, undefined>["content"]["application/json"]

type GreenhouseAddressWId = components["schemas"]["Greenhouse"]["greenhouse_address"]
export type GreenhouseAddressType = Omit<GreenhouseAddressWId, "id">

export type BusinessHoursType = EditGreenhouseRequest["greenhouse_business_hours"][0]

export type TimePeriodType = BusinessHoursType["greenhouse_business_hour_periods"][0]


export type FlowerbedType = components["schemas"]["Flowerbed"]
export type FlowerbedDetailResponse = paths["/api/flowerbeds/{id}/"]["get"]["responses"][200]["content"]["application/json"] & { currentLease: {
    leased_from: string,
    leased_to: string
}}


