
"use client";

import { useState } from "react";
import { useForm } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, Save, Info, CheckCircle } from "lucide-react";

import { BasicInfoSchema } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { generateBasicInfoSuggestions, type BasicInfoSuggestionsOutput } from "@/ai/flows/generate-basic-info-suggestions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type BasicInfoFormData = z.infer<typeof BasicInfoSchema>;

// Mock project data, replace with actual data fetching
const mockProject = {
  name: "Customer Support Chatbot",
  useCase: "Automate responses to common customer questions and escalate complex issues to human agents.",
};

const intendedUserItems = [
    { id: "external_customers", label: "External customers" },
    { id: "internal_employees", label: "Internal employees" },
    { id: "vendors_partners", label: "Vendors / Partners" },
    { id: "children", label: "Children" },
    { id: "general_public", label: "General public" },
    { id: "specialists", label: "Specialists / Professionals" },
    { id: "vulnerable_groups", label: "Vulnerable groups" },
];

const legislationItems = [
    { id: "gdpr", label: "GDPR" },
    { id: "ai_act", label: "EU AI Act" },
    { id: "mdr", label: "MDR (Medical Device Regulation)" },
    { id: "ivdr", label: "IVDR" },
    { id: "nis2", label: "NIS2" },
    { id: "iso42001", label: "ISO 42001" },
    { id: "iso27001", label: "ISO 27001" },
    { id: "local_law", label: "Local Data Protection Law" },
    { id: "other", label: "Other" },
];

const dataCategoryItems = [
    { id: "personal", label: "Personal Data" },
    { id: "financial", label: "Financial Data" },
    { id: "health", label: "Health Data" },
    { id: "location", label: "Location Data" },
    { id: "sensitive", label: "Sensitive Data (race, religion, etc.)" },
    { id: "technical", label: "Technical Data (IP, logs)" },
    { id: "behavioral", label: "Behavioral Data" },
    { id: "other", label: "Other" },
];

const dataSubjectItems = [
    { id: "adults", label: "Adults" },
    { id: "children", label: "Children" },
    { id: "employees", label: "Employees" },
    { id: "customers", label: "Customers" },
    { id: "third_parties", label: "Third parties" },
];

const externalDependenciesItems = [
    { id: "gcp", label: "Cloud provider (GCP)" },
    { id: "azure", label: "Cloud provider (Azure)" },
    { id: "aws", label: "Cloud provider (AWS)" },
    { id: "openai", label: "OpenAI API" },
    { id: "vertex", label: "Google Vertex AI" },
    { id: "huggingface", label: "HuggingFace API" },
    { id: "stripe", label: "Stripe" },
    { id: "twilio", label: "Twilio" },
    { id: "other", label: "Other" },
];

type FieldName = keyof BasicInfoFormData;

const TooltipLabel = ({ label, tooltipText }: { label: string, tooltipText: string }) => (
    <div className="flex items-center gap-2">
        <FormLabel>{label}</FormLabel>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
);


export function BasicInfoForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [generatingField, setGeneratingField] = useState<FieldName | null>(null);
  const { toast } = useToast();

  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: {
      businessContext: "",
      intendedUsers: [],
      geographicScope: "EU",
      legalRequirements: [],
      dataCategories: [],
      dataSources: [],
      externalDependencies: [],
      stakeholders: "",
      prohibitedUse: "",
      retentionPolicy: "",
      operationalEnvironment: "",
      performanceGoals: "",
      scopeComponents: "",
      dataSubjects: [],
    },
  });
  
  const geographicScopeValue = form.watch("geographicScope");
  const legalRequirementsValue = form.watch("legalRequirements");
  const retentionPolicyValue = form.watch("retentionPolicy");
  const { isDirty, isSubmitted } = form.formState;

  async function onSubmit(data: BasicInfoFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    // TODO: Implement server action to save the data
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Saved!",
      description: "The basic information has been successfully updated.",
    });
    form.reset(data); // Resets the form with the new values, clearing the dirty state
    setIsSaving(false);
  }
  
  async function handleGenerateFieldSuggestion(fieldName: FieldName) {
    setGeneratingField(fieldName);
    try {
        const currentValues = form.getValues();
        const result = await generateBasicInfoSuggestions({
            projectName: mockProject.name,
            useCase: mockProject.useCase,
            intendedUsers: currentValues.intendedUsers?.join(', ') || '',
            geographicScope: currentValues.geographicScope,
            targetField: fieldName,
        });

        if (result.businessContext) form.setValue("businessContext", result.businessContext, { shouldValidate: true, shouldDirty: true });
        if (result.stakeholders) form.setValue("stakeholders", result.stakeholders, { shouldValidate: true, shouldDirty: true });
        if (result.prohibitedUse) form.setValue("prohibitedUse", result.prohibitedUse, { shouldValidate: true, shouldDirty: true });
        if (result.scopeComponents) form.setValue("scopeComponents", result.scopeComponents, { shouldValidate: true, shouldDirty: true });
        
        toast({
            title: "Suggestion Generated",
            description: `The AI has suggested content for ${fieldName}.`,
        });

    } catch (error) {
        console.error(`Error generating suggestion for ${fieldName}:`, error);
        toast({
            variant: "destructive",
            title: "Generation Error",
            description: "Could not generate AI suggestion. Please try again.",
        });
    }
    setGeneratingField(null);
  }

  const renderFieldWithAI = (fieldName: FieldName, label: string, placeholder: string, description?: string) => {
    const isLoading = generatingField === fieldName;
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            {description ? <TooltipLabel label={label} tooltipText={description} /> : <FormLabel>{label}</FormLabel>}
            <div className="relative">
              <FormControl>
                <Textarea placeholder={placeholder} {...field} rows={4} />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={() => handleGenerateFieldSuggestion(fieldName)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span className="sr-only">Generate suggestion for {label}</span>
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };


  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-24">
        <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold">Core Information</AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="space-y-8">
                        {renderFieldWithAI("businessContext", "Business Context", "Describe the business goal or problem this AI system solves.")}

                        <FormField control={form.control} name="intendedUsers" render={() => (
                            <FormItem>
                                <div className="mb-4">
                                     <TooltipLabel label="Intended Users" tooltipText="Who are the end users of the system?" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {intendedUserItems.map((item) => (
                                        <FormField key={item.id} control={form.control} name="intendedUsers" render={({ field }) => (
                                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            const currentValue = field.value || [];
                                                            return checked
                                                                ? field.onChange([...currentValue, item.id])
                                                                : field.onChange(currentValue?.filter((value) => value !== item.id));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                            </FormItem>
                                        )} />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        {renderFieldWithAI("stakeholders", "Stakeholders", "e.g. Product Owner, Legal department, Data Protection Officer", "List the key stakeholders involved.")}

                        {renderFieldWithAI("scopeComponents", "In-scope / Out-of-scope Components", "Clearly define what is and isn't part of the AI system.", "e.g., 'In-scope: the model API. Out-of-scope: the front-end application.'")}
                        
                        {renderFieldWithAI("prohibitedUse", "Prohibited Use", "e.g., The system must not be used for financial advice or medical diagnosis.", "Clearly state any prohibited uses of the AI system.")}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold">Data Characteristics</AccordionTrigger>
                <AccordionContent className="pt-4">
                     <div className="space-y-8">
                        <FormField control={form.control} name="dataSubjects" render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <TooltipLabel label="Data Subjects" tooltipText="Who is the data about?" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {dataSubjectItems.map((item) => (
                                        <FormField key={item.id} control={form.control} name="dataSubjects" render={({ field }) => (
                                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            const currentValue = field.value || [];
                                                            return checked
                                                                ? field.onChange([...currentValue, item.id])
                                                                : field.onChange(currentValue?.filter((value) => value !== item.id));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                            </FormItem>
                                        )} />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />

                         <FormField control={form.control} name="dataSensitivity" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data Sensitivity Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a sensitivity level" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="internal">Internal</SelectItem>
                                    <SelectItem value="confidential">Confidential</SelectItem>
                                    <SelectItem value="highly-sensitive">Highly Sensitive</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <FormField control={form.control} name="dataSources" render={({ field }) => (
                            <FormItem>
                                <TooltipLabel label="Data Sources" tooltipText="Enter sources, separated by commas." />
                                <FormControl><Textarea placeholder="Describe where the data comes from (e.g. internal databases, public APIs, user-provided)." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="dataCategories" render={() => (
                            <FormItem>
                                 <div className="mb-4">
                                    <TooltipLabel label="Data Categories" tooltipText="Select the categories of data being processed." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                {dataCategoryItems.map((item) => (
                                    <FormField key={item.id} control={form.control} name="dataCategories" render={({ field }) => (
                                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                    const currentValue = field.value || [];
                                                    return checked
                                                        ? field.onChange([...currentValue, item.id])
                                                        : field.onChange(
                                                            currentValue?.filter(
                                                            (value) => value !== item.id
                                                            )
                                                        )
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                        </FormItem>
                                    )} />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="retentionPolicy"
                                render={({ field }) => (
                                    <FormItem>
                                    <TooltipLabel label="Retention Policy" tooltipText="Describe the data retention policy." />
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a retention period" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="no-retention">No retention</SelectItem>
                                        <SelectItem value="30-days">30 days</SelectItem>
                                        <SelectItem value="3-months">3 months</SelectItem>
                                        <SelectItem value="6-months">6 months</SelectItem>
                                        <SelectItem value="1-year">1 year</SelectItem>
                                        <SelectItem value="5-years">5 years</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {retentionPolicyValue === 'other' && (
                            <FormField
                                control={form.control}
                                name="retentionPolicyOther"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Please specify retention policy</FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="e.g., Anonymized data is retained for 1 year for model improvement." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            )}
                        </div>

                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold">Legal & Governance</AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <FormField
                                control={form.control}
                                name="geographicScope"
                                render={({ field }) => (
                                    <FormItem>
                                    <TooltipLabel label="Geographic Scope" tooltipText="Where will the system be used?" />
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a scope" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="EU">EU</SelectItem>
                                        <SelectItem value="EEA">EEA</SelectItem>
                                        <SelectItem value="Global">Global</SelectItem>
                                        <SelectItem value="US">US</SelectItem>
                                        <SelectItem value="India">India</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                {geographicScopeValue === 'other' && (
                                <FormField
                                    control={form.control}
                                    name="geographicScopeOther"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Please specify other scope</FormLabel>
                                        <FormControl>
                                        <Input placeholder="e.g. Canada" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                )}
                        </div>
                        
                        <FormField control={form.control} name="legalRequirements" render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <TooltipLabel label="Relevant Legislation" tooltipText="Which legal frameworks apply?" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {legislationItems.map((item) => (
                                        <FormField key={item.id} control={form.control} name="legalRequirements" render={({ field }) => (
                                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            const currentValue = field.value || [];
                                                            return checked
                                                                ? field.onChange([...currentValue, item.id])
                                                                : field.onChange(currentValue.filter((value) => value !== item.id));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                            </FormItem>
                                        )} />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        {legalRequirementsValue?.includes('other') && (
                        <FormField
                            control={form.control}
                            name="legalRequirementsOther"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Please specify other legislation</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g. HIPAA" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        )}

                        <FormField control={form.control} name="aiActClassification" render={({ field }) => (
                        <FormItem>
                            <TooltipLabel label="AI Act Classification" tooltipText="Classification according to the EU AI Act." />
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a classification" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="unacceptable">Unacceptable Risk</SelectItem>
                                <SelectItem value="high">High Risk</SelectItem>
                                <SelectItem value="limited">Limited Risk</SelectItem>
                                <SelectItem value="minimal">Minimal Risk</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )} />
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
                 <AccordionTrigger className="text-lg font-semibold">External & Technical Details</AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="space-y-8">
                         <FormField control={form.control} name="externalDependencies" render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <TooltipLabel label="External Dependencies" tooltipText="List of external systems or components." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {externalDependenciesItems.map((item) => (
                                        <FormField key={item.id} control={form.control} name="externalDependencies" render={({ field }) => (
                                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            const currentValue = field.value || [];
                                                            return checked
                                                                ? field.onChange([...currentValue, item.id])
                                                                : field.onChange(currentValue.filter((value) => value !== item.id));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                            </FormItem>
                                        )} />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField control={form.control} name="operationalEnvironment" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Operational Environment</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an environment" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="gcp">Cloud (GCP)</SelectItem>
                                    <SelectItem value="azure">Cloud (Azure)</SelectItem>
                                    <SelectItem value="aws">Cloud (AWS)</SelectItem>
                                    <SelectItem value="on-premise">On-premise</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                    <SelectItem value="edge">Edge device</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )} />
                            
                            <FormField control={form.control} name="performanceGoals" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>High-level Performance Goals</FormLabel>
                                    <FormControl><Input placeholder="e.g., Reduce ticket response time by 50%" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        
        <div className="fixed bottom-0 left-0 sm:left-60 right-0 border-t bg-background/95 backdrop-blur-sm z-10">
            <div className="container flex items-center justify-end h-16 max-w-6xl gap-4">
                <div className="text-sm text-muted-foreground">
                    {isSaving 
                        ? "Saving..." 
                        : isDirty 
                        ? "You have unsaved changes." 
                        : isSubmitted 
                        ? "Saved!" 
                        : ""}
                </div>
                <Button type="submit" disabled={isSaving || !isDirty}>
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                </Button>
            </div>
        </div>
      </form>
    </Form>
    </>
  );
}

    