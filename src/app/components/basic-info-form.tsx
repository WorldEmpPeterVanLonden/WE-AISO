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

type BasicInfoFormData = z.infer<typeof BasicInfoSchema>;

// Mock project data, replace with actual data fetching
const mockProject = {
  name: "Customer Support Chatbot",
  useCase: "Automate responses to common customer questions and escalate complex issues to human agents.",
};

const dataCategoryItems = [
    { id: "personal", label: "Personal Data" },
    { id: "financial", label: "Financial Data" },
    { id: "health", label: "Health Data" },
    { id: "sensitive", label: "Sensitive Data (race, religion, etc.)" },
    { id: "location", label: "Location Data" },
    { id: "technical", label: "Technical Data (IP, logs)" },
    { id: "other", label: "Other" },
]

export function BasicInfoForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // TODO: Fetch existing data for the project
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: {
      businessContext: "",
      intendedUsers: "",
      geographicScope: "EU",
      legalRequirements: "",
      dataCategories: [],
      dataSources: [],
      externalDependencies: [],
    },
  });

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
            intendedUsers: currentValues.intendedUsers,
            geographicScope: currentValues.geographicScope,
        });

        // Set suggested values in the form
        if(result.businessContext) form.setValue("businessContext", result.businessContext, { shouldValidate: true });
        if(result.legalRequirements) form.setValue("legalRequirements", result.legalRequirements, { shouldValidate: true });
        
        // This is a simple mapping. A more robust implementation might be needed.
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

            <FormField control={form.control} name="intendedUsers" render={({ field }) => (
                <FormItem>
                    <FormLabel>Intended Users</FormLabel>
                    <FormControl><Input placeholder="e.g. Customers, internal employees, doctors" {...field} /></FormControl>
                    <FormDescription>Who are the end users of the system?</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
            
            <FormField control={form.control} name="geographicScope" render={({ field }) => (
                <FormItem>
                    <FormLabel>Geographic Scope</FormLabel>
                    <FormControl><Input placeholder="e.g. Netherlands, EU, Worldwide" {...field} /></FormControl>
                     <FormDescription>Where will the system be used?</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
            
            <FormField control={form.control} name="legalRequirements" render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>Relevant Legislation</FormLabel>
                    <FormControl><Input placeholder="e.g. GDPR, AI Act, MDR" {...field} /></FormControl>
                    <FormDescription>Which legal frameworks apply?</FormDescription>
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

            <FormField control={form.control} name="externalDependencies" render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>External Dependencies</FormLabel>
                    <FormControl><Textarea placeholder="e.g. External APIs (Google Maps), cloud services (Azure), open-source libraries." {...field} /></FormControl>
                    <FormDescription>List of external systems or components, separated by commas.</FormDescription>
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
