
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Save, ArrowRight } from "lucide-react";

import { DesignSchema } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateDesignSuggestions } from "@/ai/flows/generate-design-suggestions";

type DesignFormData = z.infer<typeof DesignSchema>;

const explainabilityItems = [
    { id: "model-card", label: "Model card" },
    { id: "shap", label: "SHAP" },
    { id: "lime", label: "LIME" },
    { id: "feature-importance", label: "Feature importance analysis" },
    { id: "human-in-the-loop", label: "Human-in-the-loop" },
    { id: "not-applicable", label: "Not applicable" },
];

export function DesignForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // TODO: Fetch existing data for the project
  const form = useForm<DesignFormData>({
    resolver: zodResolver(DesignSchema),
    defaultValues: {
      functionalRequirements: "",
      nonFunctionalRequirements: "",
      designChoices: "",
      dataArchitecture: "",
      explainabilityStrategy: [],
      systemType: "LLM",
      initialRiskLevel: "medium",
    },
  });

  async function onSubmit(data: DesignFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    // TODO: Implement server action to save the data
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Saved!",
      description: "The design details have been successfully updated.",
    });
    setIsSaving(false);

    // TODO: Get project ID from params
    const projectId = "123";
    router.push(`/project/${projectId}/development`);
  }

  async function handleGenerateSuggestions() {
    setIsGenerating(true);
    try {
        const result = await generateDesignSuggestions({ useCase: "A customer support chatbot for an e-commerce platform that handles order tracking, returns, and product questions." });
        
        if (result.functionalRequirements) form.setValue("functionalRequirements", result.functionalRequirements, { shouldValidate: true, shouldDirty: true });
        if (result.nonFunctionalRequirements) form.setValue("nonFunctionalRequirements", result.nonFunctionalRequirements, { shouldValidate: true, shouldDirty: true });
        if (result.designChoices) form.setValue("designChoices", result.designChoices, { shouldValidate: true, shouldDirty: true });
        if (result.dataArchitecture) form.setValue("dataArchitecture", result.dataArchitecture, { shouldValidate: true, shouldDirty: true });
        if (result.explainabilityStrategy) form.setValue("explainabilityStrategy", result.explainabilityStrategy, { shouldValidate: true, shouldDirty: true });
        
        toast({
            title: "Suggestions Generated",
            description: "The AI has filled in the design fields for you.",
        });

    } catch (error) {
        console.error("Error generating design suggestions:", error);
        toast({
            variant: "destructive",
            title: "Generation Error",
            description: "Could not generate AI suggestions for the design phase.",
        });
    }
    setIsGenerating(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-muted-foreground">Lifecycle Progress</p>
                <p className="text-sm font-semibold">1/7 Stages Completed</p>
              </div>
              <Button onClick={handleGenerateSuggestions} disabled={isGenerating} variant="outline" size="sm">
                  {isGenerating ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                      </>
                  ) : (
                      <>
                          <Sparkles className="mr-2 h-4 w-4 text-accent" />
                          AI Assist
                      </>
                  )}
              </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={(1 / 7) * 100} className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="systemType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>System Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="LLM">LLM</SelectItem>
                                <SelectItem value="ML">ML Model</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                <SelectItem value="RuleBased">Rule-based</SelectItem>
                                <SelectItem value="AgentBased">Agent-based system</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="initialRiskLevel" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Risk Level (initial)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="functionalRequirements" render={({ field }) => (
              <FormItem>
                <FormLabel>Functional Requirements</FormLabel>
                <FormControl><Textarea placeholder="e.g., The system must be able to answer user queries in natural language." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="nonFunctionalRequirements" render={({ field }) => (
              <FormItem>
                <FormLabel>Non-Functional Requirements</FormLabel>
                <FormControl><Textarea placeholder="e.g., Response time must be under 2 seconds; System must be available 99.9% of the time." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="designChoices" render={({ field }) => (
              <FormItem>
                <FormLabel>Design Choices</FormLabel>
                <FormControl><Textarea placeholder="e.g., Model: GPT-4; Prompts designed to be neutral; Guardrails against harmful content." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="dataArchitecture" render={({ field }) => (
              <FormItem>
                <FormLabel>Data Architecture</FormLabel>
                <FormControl><Textarea placeholder="e.g., Data is stored in a secure cloud database; PII is anonymized before processing." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="explainabilityStrategy" render={() => (
                <FormItem>
                     <div className="mb-4">
                        <FormLabel>Explainability Strategy</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {explainabilityItems.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="explainabilityStrategy"
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
                                                            : field.onChange(currentValue.filter((value) => value !== item.id));
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
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save & Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

    