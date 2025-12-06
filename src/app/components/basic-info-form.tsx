
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, Save } from "lucide-react";

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
import { generateBasicInfoSuggestions } from "@/ai/flows/generate-basic-info-suggestions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export function BasicInfoForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // TODO: Fetch existing data for the project
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

  async function onSubmit(data: BasicInfoFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    // TODO: Implement server action to save the data
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Saved!",
      description: "The basic information has been successfully updated.",
    });
    setIsSaving(false);
  }
  
  async function handleGenerateSuggestions() {
    setIsGenerating(true);
    try {
        const currentValues = form.getValues();
        const result = await generateBasicInfoSuggestions({
            projectName: mockProject.name,
            useCase: mockProject.useCase,
            intendedUsers: currentValues.intendedUsers?.join(', ') || '',
            geographicScope: currentValues.geographicScope,
        });

        // Set suggested values in the form
        if(result.businessContext) form.setValue("businessContext", result.businessContext, { shouldValidate: true });
        
        // This is a simple mapping. A more robust implementation might be needed.
        if (result.legalRequirements) {
            const suggestedLegislation = legislationItems
                .filter(item => result.legalRequirements.toLowerCase().includes(item.label.toLowerCase().split(' ')[0]))
                .map(item => item.id);
            form.setValue("legalRequirements", suggestedLegislation, { shouldValidate: true });
        }
        
        const suggestedCategories = result.dataCategories.map(cat => {
            if (cat.toLowerCase().includes('personal')) return 'personal';
            if (cat.toLowerCase().includes('financial')) return 'financial';
            if (cat.toLowerCase().includes('health')) return 'health';
            return 'other';
        }).filter((value, index, self) => self.indexOf(value) === index); // unique
        
        form.setValue("dataCategories", suggestedCategories, { shouldValidate: true });

        toast({
            title: "Suggestions Generated",
            description: "The AI has filled in some fields for you.",
        });

    } catch (error) {
        console.error("Error generating suggestions:", error);
        toast({
            variant: "destructive",
            title: "Generation Error",
            description: "Could not generate AI suggestions. Please try again.",
        });
    }
    setIsGenerating(false);
  }

  return (
    <>
    <div className="flex justify-end mb-6">
        <Button onClick={handleGenerateSuggestions} disabled={isGenerating}>
            {isGenerating ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Suggestions
                </>
            )}
        </Button>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField control={form.control} name="businessContext" render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>Business Context</FormLabel>
                    <FormControl><Textarea placeholder="Describe the business goal or problem this AI system solves." {...field} rows={4} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="intendedUsers" render={() => (
                <FormItem className="md:col-span-2">
                    <div className="mb-4">
                        <FormLabel>Intended Users</FormLabel>
                        <FormDescription>Who are the end users of the system?</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {intendedUserItems.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="intendedUsers"
                                render={({ field }) => {
                                    return (
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
                                    );
                                }}
                            />
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )} />
            
            <FormField control={form.control} name="dataSubjects" render={() => (
                <FormItem className="md:col-span-2">
                    <div className="mb-4">
                        <FormLabel>Data Subjects</FormLabel>
                        <FormDescription>Who is the data about?</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {dataSubjectItems.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="dataSubjects"
                                render={({ field }) => (
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
                                )}
                            />
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )} />

             <FormField control={form.control} name="stakeholders" render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>Stakeholders</FormLabel>
                    <FormControl><Textarea placeholder="e.g. Product Owner, Legal department, Data Protection Officer" {...field} rows={2} /></FormControl>
                    <FormDescription>List the key stakeholders involved.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField
              control={form.control}
              name="geographicScope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geographic Scope</FormLabel>
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
                  <FormDescription>Where will the system be used?</FormDescription>
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
            
            <FormField control={form.control} name="legalRequirements" render={() => (
                <FormItem className="md:col-span-2">
                    <div className="mb-4">
                        <FormLabel>Relevant Legislation</FormLabel>
                        <FormDescription>Which legal frameworks apply?</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {legislationItems.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="legalRequirements"
                                render={({ field }) => (
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
                                )}
                            />
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
                  <FormItem className="md:col-span-2">
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
                <FormLabel>AI Act Classification</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a classification" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="unacceptable">Unacceptable Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="limited">Limited Risk</SelectItem>
                    <SelectItem value="minimal">Minimal Risk</SelectItem>
                  </SelectContent>
                </Select>
                 <FormDescription>Classification according to the EU AI Act.</FormDescription>
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
                <FormItem className="md:col-span-2">
                    <FormLabel>Data Sources</FormLabel>
                    <FormControl><Textarea placeholder="Describe where the data comes from (e.g. internal databases, public APIs, user-provided)." {...field} />
                    </FormControl>
                    <FormDescription>Enter sources, separated by commas.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
            
            <FormField control={form.control} name="dataCategories" render={() => (
                <FormItem className="md:col-span-2">
                     <div className="mb-4">
                        <FormLabel>Data Categories</FormLabel>
                        <FormDescription>Select the categories of data being processed.</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    {dataCategoryItems.map((item) => (
                        <FormField key={item.id} control={form.control} name="dataCategories" render={({ field }) => {
                            return (
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
                            )
                        }} />
                    ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="retentionPolicy" render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>Retention Policy</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Anonymized data is retained for 1 year for model improvement." {...field} /></FormControl>
                    <FormDescription>Describe the data retention policy.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

             <FormField control={form.control} name="scopeComponents" render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>In-scope / Out-of-scope Components</FormLabel>
                    <FormControl><Textarea placeholder="Clearly define what is and isn't part of the AI system." {...field} /></FormControl>
                    <FormDescription>e.g., 'In-scope: the model API. Out-of-scope: the front-end application.'</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="externalDependencies" render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>External Dependencies</FormLabel>
                    <FormControl><Textarea placeholder="e.g., External APIs (Google Maps), cloud services (Azure), open-source libraries." {...field} /></FormControl>
                    <FormDescription>List of external systems or components, separated by commas.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

             <FormField control={form.control} name="prohibitedUse" render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>Prohibited Use</FormLabel>
                    <FormControl><Textarea placeholder="e.g., The system must not be used for financial advice or medical diagnosis." {...field} /></FormControl>
                    <FormDescription>Clearly state any prohibited uses of the AI system.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="operationalEnvironment" render={({ field }) => (
                <FormItem>
                    <FormLabel>High-level Operational Environment</FormLabel>
                    <FormControl><Input placeholder="e.g., Cloud-based, on-premise, embedded device" {...field} /></FormControl>
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
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
            </Button>
        </div>
      </form>
    </Form>
    </>
  );
}

    