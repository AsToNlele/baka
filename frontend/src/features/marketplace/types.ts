// Author: Alexandr Celakovsky - xcelak00
import * as z from "zod"

export const CreateSharedProductSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(3),
})

export type CreateSharedProductValidationType = z.infer<
    typeof CreateSharedProductSchema
>

export const CreateGreenhouseProductFromSharedProductSchema = z.object({
    product: z.coerce.number().int().gt(0),
    price: z.coerce.number().gt(0),
    quantity: z.coerce.number().int().gt(0),
})

export type CreateGreenhouseProductFromSharedProductValidationType = z.infer<
    typeof CreateGreenhouseProductFromSharedProductSchema
>

export const CreateGreenhouseProductFromCustomProductSchema = z.object({
    product: z.object({
        name: z.string().min(3),
        description: z.string().min(3),
    }),
    price: z.coerce.number().gt(0),
    quantity: z.coerce.number().int().gt(0),
})

export type CreateGreenhouseProductFromCustomProductValidationType = z.infer<
    typeof CreateGreenhouseProductFromCustomProductSchema
> & { product: { image?: File | null } }

export type ShoppingCartMarketplaceItem = {
    marketplaceProduct: number
    quantity: number
}

export type ShoppingCartProductItem = {
    product: number
    quantity: number
}

export const EditGreenhouseProductInventoryRequestSchema = z.object({
    products: z.array(
        z.object({
            id: z.number(),
            quantity: z.number({ coerce: true }),
            price: z.string(),
        }),
    ),
})

export type EditGreenhouseProductInventoryRequestValidationType = z.infer<
    typeof EditGreenhouseProductInventoryRequestSchema
>

export const EditGreenhouseMarketplaceProductRequestSchema = z.object({
    product: z.object({
        name: z.string().min(3),
        description: z.string().min(3),
        shared: z.boolean(),
    }),
    price: z.string(),
    quantity: z.number({ coerce: true }),
})

export type EditGreenhouseMarketplaceProductRequestValidationType = z.infer<
    typeof EditGreenhouseMarketplaceProductRequestSchema
> & { product: { image?: File | null | string } }
