
import { z } from "zod";

const AuditReadinessSchema = z.object({
  lifecycleScore: z.number(),
  riskScore: z.number(),
  governanceScore: z.number(),
  total: z.number(),
  lastCalculated: z.date(),
});

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  version: z.string().min(1, "Version is required."),
  customerId: z.string().optional(),
  description: z.string().optional(),
  useCase: z.string().min(1, "Use-case is required."),
  systemType: z.enum(["LLM", "ML", "Hybrid", "RuleBased"]),
  riskCategory: z.enum(["high", "medium", "low"]),
  auditReadiness: AuditReadinessSchema.optional(),
});


export const BasicInfoSchema = z.object({
  businessContext: z.string().optional(),
  intendedUsers: z.array(z.string()).optional(),
  geographicScope: z.string().min(1, "Geographic scope is required."),
  geographicScopeOther: z.string().optional(),
  legalRequirements: z.array(z.string()).optional(),
  legalRequirementsOther: z.string().optional(),
  dataCategories: z.array(z.string()).optional(),
  dataSources: z.array(z.string()).optional(),
  externalDependencies: z.array(z.string()).optional(),
  dataSensitivity: z.enum(["public", "internal", "confidential", "highly-sensitive"]).optional(),
  dataSubjects: z.array(z.string()).optional(),
  scopeComponents: z.string().optional(),
  stakeholders: z.string().optional(),
  prohibitedUse: z.string().optional(),
  retentionPolicy: z.string().optional(),
  retentionPolicyOther: z.string().optional(),
  aiActClassification: z.enum(["unacceptable", "high", "limited", "minimal"]).optional(),
  operationalEnvironment: z.string().optional(),
  performanceGoals: z.string().optional(),
}).refine(data => {
    if (data.geographicScope === 'other') {
        return !!data.geographicScopeOther && data.geographicScopeOther.length > 0;
    }
    return true;
}, {
    message: "Please specify the geographic scope.",
    path: ["geographicScopeOther"],
}).refine(data => {
    if (data.legalRequirements?.includes('other')) {
        return !!data.legalRequirementsOther && data.legalRequirementsOther.length > 0;
    }
    return true;
}, {
    message: "Please specify other legislation.",
    path: ["legalRequirementsOther"],
}).refine(data => {
    if (data.retentionPolicy === 'other') {
        return !!data.retentionPolicyOther && data.retentionPolicyOther.length > 0;
    }
    return true;
}, {
    message: "Please specify the retention policy.",
    path: ["retentionPolicyOther"],
});

export const DesignSchema = z.object({
  functionalRequirements: z.string().min(1, "Functional requirements are required."),
  nonFunctionalRequirements: z.string().min(1, "Non-functional requirements are required."),
  designChoices: z.string().min(1, "Design choices are required."),
  dataArchitecture: z.string().min(1, "Data architecture is required."),
  explainabilityStrategy: z.array(z.string()).min(1, "Explainability strategy is required."),
  systemType: z.enum(["LLM", "ML", "Hybrid", "RuleBased", "AgentBased"]),
  initialRiskLevel: z.enum(["low", "medium", "high"]),
});

export const DevelopmentSchema = z.object({
  toolchain: z.array(z.string()).optional(),
  dependencies: z.string().optional(),
  securityControls: z.string().min(1, "Security controls are required."),
  testApproach: z.string().min(1, "Test approach is required."),
  codingStandards: z.string().optional(),
});

export const TrainingSchema = z.object({
    hasTrainingPhase: z.boolean().default(false),
    trainingMethod: z.string().optional(),
    datasetDescription: z.string().optional(),
    datasetSources: z.string().optional(),
    dataQualityChecks: z.array(z.string()).optional(),
    biasAssessment: z.string().optional(),
    privacyAssessment: z.string().optional(),
    trainingProcedure: z.string().optional(),
}).refine(data => {
    if (data.hasTrainingPhase) {
        return !!data.datasetDescription && !!data.datasetSources && data.dataQualityChecks && data.dataQualityChecks.length > 0 && !!data.biasAssessment && !!data.privacyAssessment && !!data.trainingProcedure;
    }
    return true;
}, {
    message: "Please fill out all fields for the training phase.",
    path: ["datasetDescription"], 
});

export const ValidationSchema = z.object({
    validationMethods: z.array(z.string()).min(1, "Validation methods are required."),
    acceptanceCriteria: z.string().min(1, "Acceptance criteria are required."),
    acceptanceCriteriaStatus: z.enum(["met", "partially-met", "not-met"]),
    robustnessTests: z.string().min(1, "Robustness tests are required."),
    edgeCaseTests: z.string().min(1, "Edge case tests are required."),
    validationResults: z.string().min(1, "Validation results are required."),
    independentReview: z.string().optional(),
});

export const DeploymentSchema = z.object({
  infrastructure: z.string().min(1, "Infrastructure details are required."),
  region: z.string().optional(),
  deploymentType: z.enum(["cloud", "on-premise", "hybrid", "edge"]),
  ciCdPipeline: z.string().min(1, "CI/CD pipeline details are required."),
  accessControl: z.string().min(1, "Access control details are required."),
  loggingPolicy: z.string().min(1, "Logging policy is required."),
  secretsManagement: z.string().min(1, "Secrets management strategy is required."),
  monitoringMethod: z.array(z.string()).min(1, "Monitoring method is required."),
  monitoringSetup: z.string().min(1, "Monitoring setup is required."),
});

export const OperationSchema = z.object({
  monitoringProcedures: z.string().min(1, "Monitoring procedures are required."),
  driftDetection: z.string().min(1, "Drift detection methods are required."),
  incidentHandling: z.string().min(1, "Incident handling process is required."),
  modelUpdatePolicy: z.string().min(1, "Model update policy is required."),
  updateStrategy: z.enum(["manual", "scheduled", "continuous", "none"]),
  userFeedbackProcess: z.string().min(1, "User feedback process is required."),
  loggingRetention: z.string().min(1, "Logging retention policy is required."),
});

export const RetirementSchema = z.object({
  retirementPlan: z.string().min(1, "Retirement plan is required."),
  retirementType: z.enum(["end-of-life", "decommissioning", "replacement", "migration"]),
  dataMigrationPlan: z.string().optional(),
  dataDestructionProcedures: z.string().min(1, "Data destruction procedures are required."),
  userCommunicationPlan: z.string().min(1, "User communication plan is required."),
});

export const GovernanceSchema = z.object({
  policyReferences: z.string().optional(),
  rolesAndResponsibilities: z.array(z.string()).min(1, "At least one role must be selected."),
  documentationVersioning: z.enum(["semantic", "manual", "continuous"]),
  auditRequirements: z.string().min(1, "Audit Requirements are required."),
  changeManagement: z.string().min(1, "Change Management is required."),
  qualityControls: z.string().min(1, "Quality Controls are required."),
});

export const RiskRegisterEntrySchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  category: z.enum([
    "privacy",
    "bias",
    "security",
    "accuracy",
    "misuse",
    "robustness",
    "legal",
  ]),
  likelihood: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  mitigations: z.string().optional(),
  isoControls: z.string().optional(),
  status: z.enum(["open", "mitigated", "accepted"]),
});

export type RiskRegisterEntry = z.infer<typeof RiskRegisterEntrySchema>;


export const NewProjectSchema = ProjectSchema.merge(BasicInfoSchema.pick({
    intendedUsers: true,
    geographicScope: true,
    dataCategories: true,
    dataSources: true,
    legalRequirements: true,
}));

export const GenerateDocumentSchema = z.object({
  projectId: z.string(),
  documentType: z.enum(["technicalFile", "riskReport", "fullLifecycle", "custom"]),
  version: z.string().min(1, "Version is required"),
  format: z.enum(["pdf", "word"]),
});
