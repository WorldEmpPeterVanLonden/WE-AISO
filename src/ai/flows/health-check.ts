
'use server';

/**
 * @fileOverview A simple health check flow for the AI service.
 */

import type { AiHealthOutput } from '@/ai/schemas/health-check';

/**
 * A simple health check function to verify that the server action endpoint is reachable.
 * @returns A promise that resolves to an object with a status of 'ok'.
 */
export async function healthCheck(): Promise<AiHealthOutput> {
  return { status: 'ok' };
}
