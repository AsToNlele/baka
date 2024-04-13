import * as z from "zod"

export const CreateFlowerbedSchema = z.object({
    greenhouse: z.number({coerce: true}),
    name: z.string().min(1),
    disabled: z.boolean(),
    dimension_width: z.number({coerce: true}).gt(0),
    dimension_height: z.number({coerce: true}).gt(0),
    idealPlants: z.string(),
    tools: z.string(),
    pricePerDay: z.number({ coerce: true }).gt(0),
})

export type CreateFlowerbedValidationType = z.infer<typeof CreateFlowerbedSchema>

export const EditFlowerbedSchema = z.object({
    name: z.string().min(1),
    disabled: z.boolean(),
    dimension_width: z.number({coerce: true}).gt(0),
    dimension_height: z.number({coerce: true}).gt(0),
    idealPlants: z.string(),
    tools: z.string(),
    pricePerDay: z.number({ coerce: true }).gt(0),
})

export type EditFlowerbedValidationType = z.infer<typeof EditFlowerbedSchema>
