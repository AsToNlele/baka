// Import schema.d.ts file
import { components, paths } from "types/schema"

export type ProfileType =
    paths["/api/users/me/"]["get"]["responses"][200]["content"]["application/json"]

export type GreenhouseType = components["schemas"]["Greenhouse"]
export type GreenhouseListResponse =
    paths["/api/greenhouses/"]["get"]["responses"][200]["content"]["application/json"]
export type GreenhouseDetailResponse =
    paths["/api/greenhouses/{id}/"]["get"]["responses"][200]["content"]["application/json"]

type GreenhouseEditRequest =
    paths["/api/greenhouses/{id}/edit_greenhouse/"]["put"]["requestBody"]
export type EditGreenhouseRequest = Exclude<
    GreenhouseEditRequest,
    undefined
>["content"]["application/json"]

type GreenhouseAddressWId =
    components["schemas"]["Greenhouse"]["greenhouse_address"]
export type GreenhouseAddressType = Omit<GreenhouseAddressWId, "id">

export type BusinessHoursType = Exclude<
    EditGreenhouseRequest["greenhouse_business_hours"],
    undefined
>[0]

export type TimePeriodType =
    BusinessHoursType["greenhouse_business_hour_periods"][0]

export type FlowerbedType = components["schemas"]["Flowerbed"]
export type FlowerbedDetailResponse =
    paths["/api/flowerbeds/{id}/"]["get"]["responses"][200]["content"]["application/json"] & {
        currentRent: {
            rented_from: string
            rented_to: string
        }
    }

export type FlowerbedStatusResponse =
    paths["/api/flowerbeds/{id}/status/"]["get"]["responses"][200]["content"]["application/json"]

export type OrderType = components["schemas"]["Order"]

type RentType = Exclude<components["schemas"]["Flowerbed"]["rents"], undefined>[0]

export type FlowerbedOrderType = components["schemas"]["Order"] & {
    type: "flowerbed"
    rent: RentType & {
        flowerbed: Omit<FlowerbedType, "currentRent" | "rents">
    }
}

export type ProductOrderType = Omit<components["schemas"]["Order"], "type"> & {
    type: "product"
    // TBD
    // product: components["schemas"]["Product"]
}

export type OrdersListResponse = Array<FlowerbedOrderType | ProductOrderType>

export type OrderDetailResponse = FlowerbedOrderType | ProductOrderType

export type OrderPaymentResponse = paths["/api/orders/{id}/get_payment/"]["get"]["responses"][200]["content"]["application/json"]
