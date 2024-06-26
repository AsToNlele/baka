// Author: Alexandr Celakovsky - xcelak00

import {
    ShoppingCartMarketplaceItem,
    ShoppingCartProductItem,
} from "@/features/marketplace/types"
import { components, paths } from "types/schema"

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
export type FlowerbedDetailResponse = Omit<
    paths["/api/flowerbeds/{id}/"]["get"]["responses"][200]["content"]["application/json"],
    "extendable"
> & {
    extendable: boolean
} & {
    currentRent: {
        rented_from: string
        rented_to: string
        user: number
    }
}
export type FlowerbedStatusResponse =
    paths["/api/flowerbeds/{id}/status/"]["get"]["responses"][200]["content"]["application/json"]

export type OrderType = components["schemas"]["Order"]

type RentType = Exclude<
    components["schemas"]["Flowerbed"]["rents"],
    undefined
>[0]

export type FlowerbedOrderType = components["schemas"]["Order"] & {
    type: "flowerbed"
    rent:
    | (RentType & {
        flowerbed:
        | Omit<FlowerbedType, "currentRent" | "rents">
        | undefined
        | null
    })
    | null
}

export type ProductOrderItemType = {
    id: number
    productOrder: number
    quantity: number
    price: number
    greenhouseName: string
    greenhouseId: number
    productName: string
    productImage: string
}

export type ProductOrderType = Omit<components["schemas"]["Order"], "type"> & {
    type: "product"
    items: Array<ProductOrderItemType>
}

export type OrdersListResponse = Array<FlowerbedOrderType | ProductOrderType>

export type OrderDetailResponse = FlowerbedOrderType | ProductOrderType

export type OrderPaymentResponse =
    paths["/api/orders/{id}/get_payment/"]["get"]["responses"][200]["content"]["application/json"]

export type ProductListResponse = Exclude<
    paths["/api/marketplace/products/"]["get"]["responses"][200]["content"]["application/json"],
    undefined
>

export type ProductType = components["schemas"]["Product"]

export type ProductDetailResponse =
    paths["/api/marketplace/products/{id}/"]["get"]["responses"][200]["content"]["application/json"]

export type ProductListingsListResponse = Array<
    components["schemas"]["ProductDetailMarketplaceProduct"]
>

export type ProductListingType =
    components["schemas"]["ProductDetailMarketplaceProduct"]

export type SharedProductListResponse =
    paths["/api/marketplace/shared-products/"]["get"]["responses"][200]["content"]["application/json"]

export type SharedProductDetailResponse =
    paths["/api/marketplace/shared-products/{id}/"]["get"]["responses"][200]["content"]["application/json"]

export type GreenhouseProductListResponse =
    paths["/api/marketplace/greenhouses/{id}/products/"]["get"]["responses"][200]["content"]["application/json"]

export type GreenhouseProductType = components["schemas"]["MarketplaceProduct"]

export type GreenhouseDetailProductType =
    components["schemas"]["MarketplaceDetailProduct"]

// export type CreateSharedProductRequest = Omit<
//     Exclude<
//         paths["/api/marketplace/shared-products/"]["post"]["requestBody"],
//         undefined
//     >["content"]["application/json"],
//     "id" | "shared"
// >

// export type CreateGreenhouseProductFromSharedProductRequest = Omit<
//     Exclude<
//         paths["/api/marketplace/greenhouses/{id}/products/from-shared/"]["post"]["requestBody"],
//         undefined
//     >["content"]["application/json"],
//     "id" | "greenhouse"
// >

export type CreateProductOrderType =
    components["schemas"]["CreateProductOrderInput"]

export type ProductMinMaxPriceType = components["schemas"]["ProductMinMax"]

export type SetPrimaryGreenhouseInput = {
    greenhouseId: number
}

export type SetPrimaryGreenhouseResponse = Exclude<
    ProfileType["profile"],
    undefined
>

export type GetPickupOptionsInput = {
    items: Array<ShoppingCartProductItem | ShoppingCartMarketplaceItem>
    primaryGreenhouseId: number
}

export type PickupOptionType = {
    title: string
    items: Array<ShoppingCartMarketplaceItem>
    sum: number
}

export type GetPickupOptionsOutput = Array<PickupOptionType>

export type GetPickupLocationsType = components["schemas"]["GetPickupLocations"]

export type FlowerbedListType =
    paths["/api/flowerbeds/my_flowerbeds/"]["get"]["responses"][200]["content"]["application/json"][]

type UserrType = Omit<
    components["schemas"]["UserDetailed"],
    "caretaker_greenhouses" | "owned_greenhouses"
>

export type UserType = UserrType & {
    owned_greenhouses: Exclude<GreenhouseType[], string>
    caretaker_greenhouses: Exclude<GreenhouseType[], string>
    // superuser: boolean
    profile: {
        id: number
        primaryGreenhouseId: number | null
        user: number
    } & {
        superuser: boolean
    } & {
        owned_greenhouses: Exclude<GreenhouseType[], string>
    }
}

export type UserListType = UserType[]

export type ProfileType = UserType

export type EditUserRequest = components["schemas"]["EditUser"]

export type SetUserActivityRequest = components["schemas"]["SetUserActivity"]

export type SetCaretakerRequest = components["schemas"]["SetCaretaker"]

export type SetOwnerRequest = components["schemas"]["SetOwner"]

export type TimesheetListResponse = Exclude<
    paths["/api/timesheets/"]["get"]["responses"][200]["content"]["application/json"],
    undefined
>

export type TimesheetWithGreenhouseType = TimesheetListResponse[0]

export type WorkingHourType = TimesheetWithGreenhouseType["working_hours"][0]

export type TimesheetItemType = TimesheetWithGreenhouseType["items"][0]

export type TimesheetUpdateType = TimesheetWithGreenhouseType["updates"][0]

export type ApproveTimesheetRequest = {
    message: string
    status: "approved"
}

export type RejectTimesheetRequest = {
    message: string
    status: "rejected"
}

export type CreateTimesheetRequest = Exclude<
    paths["/api/timesheets/create_timesheet/"]["post"]["requestBody"],
    undefined
>["content"]["application/json"]

export type EditProductInventoryType = {
    id: number
    quantity: number
    price: string
}

export type EditGreenhouseProductInventoryRequest = {
    products: Array<EditProductInventoryType>
}

export type EditGreenhouseProductInventoryResponse = Exclude<
    paths["/api/marketplace/marketplace-products/{id}/"]["put"]["responses"][200]["content"]["application/json"],
    undefined
>

export type CreateFlowerbedRequest = {
    greenhouse: number
    name: string
    disabled: boolean
    dimension_width: number
    dimension_height: number
    idealPlants: string
    tools: string
    pricePerDay: number
}

export type EditOrderRequest = Exclude<
    paths["/api/orders/{id}/edit_order/"]["put"]["requestBody"],
    undefined
>["content"]["application/json"]

export type SubscriberCountResponse = {
    subscribers: number
}

export type GalleryListResponse = Exclude<
    paths["/api/newsletter/gallery/"]["get"]["responses"][200]["content"]["application/json"],
    undefined
>

export type NewsletterPostType = Omit<
    components["schemas"]["NewsletterPost"],
    "content"
> & {
    content: string
}

export type NewsletterPostListResponse = Array<NewsletterPostType>

export type RegisterRequest = components["schemas"]["RegisterUserWithEmail"]

export type EditSelfRequest = components["schemas"]["EditSelfUser"]

export type SocialPostType = components["schemas"]["SocialPost"]

export type SocialPostListResponse =
    paths["/api/socialposts/"]["get"]["responses"][200]["content"]["application/json"]

export type SocialPostAppType = components["schemas"]["SocialPostApp"]

export type SocialPostAppListResponse = Array<
    paths["/api/socialposts/all_posts/"]["get"]["responses"][200]["content"]["application/json"]
>

export type FlowerbedNoteType = Exclude<
    Exclude<components["schemas"]["UserFlowerbed"], undefined>["notes"],
    undefined
>[0]

export type FlowerbedHarvestType = Exclude<
    Exclude<components["schemas"]["UserFlowerbed"], undefined>["harvests"],
    undefined
>[0]

export type UserFlowerbedType = Omit<
    components["schemas"]["UserFlowerbed"],
    "harvests" | "notes"
> & {
    harvests: FlowerbedHarvestType[]
    notes: FlowerbedNoteType[]
}

export type BadgeType = {
    id: number
    name: string
    description: string
    badge_type: string
    badge_level: number
    xp: number
    created_at: string
    user: number
}

export type BadgeTypeImage = {
    name: string
    description: string
    badge_type: string
    badge_level: number
    xp: number
    image: string
}

export type LevelType = {
    name: string
    xp_required: number
    reward: number
    level: number
}

export type UserStatsResponse = {
    badges: Array<BadgeType>
    xp_sum: number
    current_level: LevelType
    next_level: LevelType | null
}

export type BadgeRarityType = {
    badge_type: string
    badge_level: number
    rarity: number
}

export type BadgeRarityListResponse = Array<BadgeRarityType>

export type LocalDiscount = {
    code: string
    discount_value: number
}

export type UserFlowerbedStatsType = {
    emission_sum: number
    emission_sentence: string
    savings_sum: number
}

export interface GreenhouseStatsType {
  total_spend: number
  flowerbed_stats: FlowerbedStats
  product_stats: ProductStats
  total_status_comparison: TotalStatusComparison[]
}

export interface FlowerbedStats {
  total_spend: number
  occupied_flowerbeds: number
  total_flowerbeds: number
}

export interface ProductStats {
  total_spend: number
  total_orders: number
  total_customers: number
  popular_products: PopularProduct[]
  total_products: number
}

export interface PopularProduct {
  productName: string
  total_quantity: number
}

export interface TotalStatusComparison {
  status: string
  count: number
}
