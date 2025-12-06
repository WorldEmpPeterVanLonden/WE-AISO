
'use client';

/**
 * @fileOverview Zod schemas for the AI health check flow.
 */

import { z } from 'zod';

export const AiHealthOutputSchema = z.object({
  status: z.enum(['ok']),
});
export type AiHealthOutput = z.infer<typeof AiHealthOutputSchema>;
