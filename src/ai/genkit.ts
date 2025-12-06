
import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';

// helper for env-vars with fallback
function requireEnv(key: string, fallback: string): string {
  const val = process.env[key];
  return typeof val === 'string' && val.length > 0 ? val : fallback;
}

export const ai = genkit({
  plugins: [
    vertexAI({
      projectId: requireEnv('VERTEX_PROJECT', 'we-portal-b9e8d'),
      location: requireEnv('VERTEX_LOCATION', 'us-central1'),
    }),
  ]});
