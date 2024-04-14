import * as z from 'zod';

export const CreateGreenhouseSchema = z.object({
    title: z.string().min(3),
    description: z.string(),
    published: z.boolean(),
    greenhouse_address: z.object({
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        street: z.string().optional(),
        city_part: z.string().optional(),
        zipcode: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
    }),
    greenhouse_business_hours: z.array(
        z.object({
            greenhouse_business_hour_periods: z.array(
                z.object({
                    open: z.string(),
                    close: z.string(),
                }),
            ),
            day: z.number(),
        }),
    )
})

export type CreateGreenhouseValidationType = z.infer<typeof CreateGreenhouseSchema>
