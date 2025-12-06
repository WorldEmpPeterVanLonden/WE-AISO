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

export const DesignSchema = z.object({
  functionalRequirements: z.string().min(1, "Functional requirements are required."),
  nonFunctionalRequirements: z.string().min(1, "Non-functional requirements are required."),
  designChoices: z.string().min(1, "Design choices are required."),
  dataArchitecture: z.string().min(1, "Data architecture is required."),
  explainabilityStrategy: z.string().min(1, "Explainability strategy is required."),
});

export const DevelopmentSchema = z.object({
  toolchain: z.array(z.string()).optional(),
  dependencies: z.string().optional(),
  securityControls: z.string().min(1, "Security controls are required."),
  testApproach: z.string().min(1, "Test approach is required."),
});

export const TrainingSchema = z.object({
    hasTrainingPhase: z.boolean().default(false),
    datasetDescription: z.string().optional(),
    datasetSources: z.string().optional(),
    dataQualityChecks: z.string().optional(),
    biasAssessment: z.string().optional(),
    privacyAssessment: z.string().optional(),
    trainingProcedure: z.string().optional(),
}).refine(data => {
    if (data.hasTrainingPhase) {
        return !!data.datasetDescription && !!data.datasetSources && !!data.dataQualityChecks && !!data.biasAssessment && !!data.privacyAssessment && !!data.trainingProcedure;
    }
    return true;
}, {
    message: "Please fill out all fields for the training phase.",
    path: ["datasetDescription"], // you can pick one field to show the error on
});

export const ValidationSchema = z.object({
    validationMethods: z.string().min(1, "Validation methods are required."),
    acceptanceCriteria: z.string().min(1, "Acceptance criteria are required."),
    robustnessTests: z.string().min(1, "Robustness tests are required."),
    edgeCaseTests: z.string().min(1, "Edge case tests are required."),
    validationResults: z.string().min(1, "Validation results are required."),
    independentReview: z.string().optional(),
});

export const DeploymentSchema = z.object({
  infrastructure: z.string().min(1, "Infrastructure details are required."),
  region: z.string().optional(),
  ciCdPipeline: z.string().min(1, "CI/CD pipeline details are required."),
  accessControl: z.string().min(1, "Access control details are required."),
  loggingPolicy: z.string().min(1, "Logging policy is required."),
  secretsManagement: z.string().min(1, "Secrets management strategy is required."),
  monitoringSetup: z.string().min(1, "Monitoring setup is required."),
});
