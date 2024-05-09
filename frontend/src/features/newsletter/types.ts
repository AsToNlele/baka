// Author: Alexandr Celakovsky - xcelak00
import * as zod from 'zod';
export const SendNewsletterSchema = zod.object({
    title: zod.string(),
});

export type SendNewsletterValidationType = zod.infer<typeof SendNewsletterSchema>;
