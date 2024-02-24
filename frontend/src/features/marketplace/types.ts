import * as z from "zod"

export const CreateSharedProductSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(3),
    image: z.string().optional(),
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
