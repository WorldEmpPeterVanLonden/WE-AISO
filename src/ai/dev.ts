'use server';
import { config } from 'dotenv';
config();

import '@/ai/ai-technical-file-generation.ts';
import '@/ai/flows/automated-risk-analysis.ts';
import '@/ai/flows/generate-basic-info-suggestions.ts';
import '@/ai/flows/generate-design-suggestions.ts';
import '@/ai/flows/generate-governance-suggestions.ts';
