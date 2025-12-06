'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/automated-risk-analysis.ts';
import '@/ai/flows/generate-basic-info-suggestions.ts';
