import * as z from "zod"
import { fromZonedTime, toZonedTime } from "date-fns-tz"

export const CreateTimesheetSchema = z.object({
    description: z.string().optional(),
    greenhouse: z.number({ coerce: true }),
    pay: z.number({ coerce: true }).gt(0),
    items: z.array(
        z.object({
            title: z.string().min(3),
            description: z.string().min(0),
        }),
    ),
    working_hours: z.array(
        z
            .object({
                start: z.coerce.date(),
                end: z.coerce.date(),
            })
            .refine(
                (schema) => schema.start < schema.end,
                "'Start' has to be before 'End'",
            )
            .refine(
                (schema) => schema.start <= new Date(),
                "'Start' has to be in the past",
            )
            .refine(
                (schema) => schema.end <= new Date(),
                "'End' has to be in the past",
            )
            .transform((data) => {
                const startTime = data.start
                const endTime = data.end

                const currentTimezone =
                    Intl.DateTimeFormat().resolvedOptions().timeZone ??
                    "Europe/Prague"

                const startUtcDatetime = fromZonedTime(
                    startTime,
                    currentTimezone,
                )
                const endUtcDatetime = fromZonedTime(endTime, currentTimezone)

                const startLocalDatetime = toZonedTime(
                    startUtcDatetime,
                    currentTimezone,
                )
                const endLocalDatetime = toZonedTime(
                    endUtcDatetime,
                    currentTimezone,
                )
                return {
                    start: startLocalDatetime.toISOString(),
                    end: endLocalDatetime.toISOString(),
                }
            }),
    ),
})

export type CreateTimesheetValidationType = z.infer<
    typeof CreateTimesheetSchema
>

export const ResubmitTimesheetSchema = z.object({
    description: z.string().optional(),
    // greenhouse: z.number({ coerce: true }),
    pay: z.number({ coerce: true }).gt(0),
    items: z.array(
        z.object({
            title: z.string().min(3),
            description: z.string().min(0),
        }),
    ),
    message: z.string().optional(),
    working_hours: z.array(
        z
            .object({
                start: z.coerce.date(),
                end: z.coerce.date(),
            })
            .refine(
                (schema) => schema.start < schema.end,
                "'Start' has to be before 'End'",
            )
            .refine(
                (schema) => schema.start <= new Date(),
                "'Start' has to be in the past",
            )
            .refine(
                (schema) => schema.end <= new Date(),
                "'End' has to be in the past",
            )
            .transform((data) => {
                const startTime = data.start
                const endTime = data.end

                const currentTimezone =
                    Intl.DateTimeFormat().resolvedOptions().timeZone ??
                    "Europe/Prague"

                const startUtcDatetime = fromZonedTime(
                    startTime,
                    currentTimezone,
                )
                const endUtcDatetime = fromZonedTime(endTime, currentTimezone)

                const startLocalDatetime = toZonedTime(
                    startUtcDatetime,
                    currentTimezone,
                )
                const endLocalDatetime = toZonedTime(
                    endUtcDatetime,
                    currentTimezone,
                )
                return {
                    start: startLocalDatetime.toISOString(),
                    end: endLocalDatetime.toISOString(),
                }
            }),
    ),
})

export type ResubmitTimesheetValidationType = z.infer<
    typeof ResubmitTimesheetSchema
>
