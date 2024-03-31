import * as z from "zod"

export const EditUserDetailSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    first_name: z.string().min(3),
    last_name: z.string().min(3),
})

export type EditUserDetailType = z.infer<typeof EditUserDetailSchema>
