// Author: Alexandr Celakovsky - xcelak00
import * as zod from "zod"

// url must start with http or https
export const CreateSocialPostSchema = zod
    .object({
        url: zod.string(),
    })
    .refine(
        (data) =>
            data.url.startsWith("https://instagram.com") ||
            data.url.startsWith("https://www.instagram.com"),
        {
            message: "Has to be an Instagram post URL",
            path: ["url"],
        },
    )

export type CreateSocialPostValidation = zod.infer<
    typeof CreateSocialPostSchema
>

export const EditSocialPostSchema = zod
    .object({
        url: zod.string(),
        approved: zod.boolean(),
    })
    .refine(
        (data) =>
            data.url.startsWith("https://instagram.com") ||
            data.url.startsWith("https://www.instagram.com"),
        {
            message: "Has to be an Instagram post URL",
            path: ["url"],
        },
    )

export type EditSocialPostValidation = zod.infer<typeof EditSocialPostSchema>
