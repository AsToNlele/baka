// Import schema.d.ts file
import { components, paths } from "types/schema"

export type GreenhouseType = components["schemas"]["Greenhouse"]
export type GreenhouseListResponse = paths["/api/greenhouses/"]["get"]["responses"][200]["content"]["application/json"]
export type GreenhouseDetailResponse = paths["/api/greenhouses/{id}/"]["get"]["responses"][200]["content"]["application/json"]


type GreenhouseEditRequest = paths["/api/greenhouses/{id}/edit_greenhouse/"]["put"]["requestBody"]
export type EditGreenhouseRequest = Exclude<GreenhouseEditRequest, undefined>["content"]["application/json"]


export type FlowerbedType = components["schemas"]["Flowerbed"]
export type FlowerbedDetailResponse = paths["/api/flowerbeds/{id}/"]["get"]["responses"][200]["content"]["application/json"] & { currentLease: {
    leased_from: string,
    leased_to: string
}}


