import * as z from "zod"

export const EditOrderSchema = z.object({
    status: z.string(),
    final_price: z.number({ coerce: true }),
})

export type EditOrderValidationType = z.infer<typeof EditOrderSchema>
