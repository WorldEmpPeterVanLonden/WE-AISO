
'use server';

/**
 * @fileOverview A simple health check flow for the AI service.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { AiHealthOutputSchema, type AiHealthOutput } from '@/ai/schemas/health-check';

export async function healthCheck(): Promise<AiHealthOutput> {
  return healthCheckFlow();
}

const healthCheckFlow = ai.defineFlow(
  {
    name: 'healthCheckFlow',
    inputSchema: z.void(),
    outputSchema: AiHealthOutputSchema,
  },
  async () => {
    return { status: 'ok' };
  }
);
