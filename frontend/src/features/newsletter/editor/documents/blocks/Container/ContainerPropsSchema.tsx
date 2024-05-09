// Author: Waypoint (Metaccountant, Inc.)
// Full license can be found in src/features/newsletter/editor/LICENSE
import { z } from 'zod';

import { ContainerPropsSchema as BaseContainerPropsSchema } from '@usewaypoint/block-container';

const ContainerPropsSchema = z.object({
  style: BaseContainerPropsSchema.shape.style,
  props: z
    .object({
      childrenIds: z.array(z.string()).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export default ContainerPropsSchema;

export type ContainerProps = z.infer<typeof ContainerPropsSchema>;
