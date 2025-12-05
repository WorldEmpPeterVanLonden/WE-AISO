import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string(),
  version: z.string(),
  customerId: z.string().optional(),
  description: z.string().optional(),
  useCase: z.string(),
  systemType: z.enum(["LLM", "ML", "Hybrid", "RuleBased"]),
  riskCategory: z.enum(["high", "medium", "low"]),
});


export const BasicInfoSchema = z.object({
  businessContext: z.string().optional(),
  intendedUsers: z.string(),
  geographicScope: z.string(),
  legalRequirements: z.string().optional(),
  dataCategories: z.array(z.string()).optional(),
  dataSources: z.array(z.string()).optional(),
  externalDependencies: z.array(z.string()).optional(),
});
