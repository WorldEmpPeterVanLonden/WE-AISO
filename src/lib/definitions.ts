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

export const OperationSchema = z.object({
  monitoringProcedures: z.string().min(1, "Monitoring procedures are required."),
  driftDetection: z.string().min(1, "Drift detection methods are required."),
  incidentHandling: z.string().min(1, "Incident handling process is required."),
  modelUpdatePolicy: z.string().min(1, "Model update policy is required."),
  userFeedbackProcess: z.string().min(1, "User feedback process is required."),
  loggingRetention: z.string().min(1, "Logging retention policy is required."),
});

export const RetirementSchema = z.object({
  retirementPlan: z.string().min(1, "Retirement plan is required."),
  dataMigrationPlan: z.string().optional(),
  dataDestructionProcedures: z.string().min(1, "Data destruction procedures are required."),
  userCommunicationPlan: z.string().min(1, "User communication plan is required."),
});

export const GovernanceSchema = z.object({
  policyReferences: z.string().optional(),
  rolesAndResponsibilities: z.string().min(1, "Roles and Responsibilities are required."),
  documentationVersioning: z.string().min(1, "Documentation Versioning is required."),
  auditRequirements: z.string().min(1, "Audit Requirements are required."),
  changeManagement: z.string().min(1, "Change Management is required."),
  qualityControls: z.string().min(1, "Quality Controls are required."),
});

export const RiskRegisterEntrySchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  category: z.enum([
    "privacy",
    "security",
    "bias",
    "robustness",
    "misuse",
    "legal",
    "accuracy",
  ]),
  likelihood: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  mitigations: z.string().optional(),
  isoControls: z.string().optional(),
  status: z.enum(["open", "mitigated", "accepted"]),
});

export type RiskRegisterEntry = z.infer<typeof RiskRegisterEntrySchema>;
