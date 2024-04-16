import * as z from "zod"

export const EditUserDetailSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    first_name: z.string().min(3),
    last_name: z.string().min(3),
})

export type EditUserDetailType = z.infer<typeof EditUserDetailSchema>

export const RegisterUserSchema = z
    .object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        passwordMatch: z.string().min(6),
        first_name: z.string().min(3),
        last_name: z.string().min(3),
        subscribe_newsletter: z.boolean().optional(),
    })
    .refine((data) => data.password === data.passwordMatch, {
        message: "Passwords do not match",
        path: ["passwordMatch"],
    })

export type RegisterUserValidationType = z.infer<typeof RegisterUserSchema>

export const EditSelfSchema = z.object({
    profile: z
        .object({
            receive_newsletter: z.boolean().optional(),
        })
        .optional(),
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    email: z.string().email(),
})

export type EditSelfValidationType = z.infer<typeof EditSelfSchema>
