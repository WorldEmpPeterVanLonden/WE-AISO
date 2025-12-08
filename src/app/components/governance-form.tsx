
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2, Sparkles, Save } from "lucide-react";

import { GovernanceSchema } from "@/lib/definitions";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { generateGovernanceSuggestions } from "@/ai/flows/generate-governance-suggestions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type GovernanceFormData = z.infer<typeof GovernanceSchema>;

const mockProject = {
  useCase: "Customer Support Chatbot for a financial institution.",
};

const rolesItems = [
    { id: "product-owner", label: "Product Owner" },
    { id: "ai-responsible-officer", label: "AI Responsible Officer" },
    { id: "data-steward", label: "Data Steward" },
    { id: "security-officer", label: "Security Officer" },
    { id: "ethics-committee", label: "Ethics Committee" },
    { id: "external-auditor", label: "External Auditor" },
];

export function GovernanceForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<GovernanceFormData>({
    resolver: zodResolver(GovernanceSchema),
    defaultValues: {
      policyReferences: "",
      rolesAndResponsibilities: [],
      documentationVersioning: "semantic",
      auditRequirements: "",
      changeManagement: "",
      qualityControls: "",
    },
  });

  async function onSubmit(data: GovernanceFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Saved!",
      description: "The governance details have been successfully updated.",
    });
    setIsSaving(false);
  }

  async function handleGenerateSuggestions() {
    setIsGenerating(true);
    try {
        const result = await generateGovernanceSuggestions({
            useCase: mockProject.useCase,
        });

        if(result.suggestedControls) {
            const currentRefs = form.getValues("policyReferences");
            const newRefs = result.suggestedControls.filter(control => !currentRefs.includes(control));
            form.setValue("policyReferences", (currentRefs ? currentRefs + "\n" : "") + newRefs.join("\n"), { shouldValidate: true, shouldDirty: true });
        }

        toast({
            title: "AI Suggestions Generated",
            description: "Suggested ISO controls have been added to Policy References.",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-end">
            <Button onClick={handleGenerateSuggestions} disabled={isGenerating} variant="outline" size="sm">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-accent" />
                  Suggest ISO Controls
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="policyReferences" render={({ field }) => (
              <FormItem>
                <FormLabel>Policy References / ISO Controls</FormLabel>
                <FormControl><Textarea placeholder="List references to internal policies or external standards like ISO 42001 controls (e.g., A.5.1, A.5.2)." {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField
              control={form.control}
              name="rolesAndResponsibilities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Roles and Responsibilities</FormLabel>
                     <FormDescription>Define who is responsible for what.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {rolesItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="rolesAndResponsibilities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValue, item.id])
                                      : field.onChange(
                                          currentValue.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
                control={form.control}
                name="documentationVersioning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documentation Versioning Approach</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="semantic">Semantic versioning</SelectItem>
                            <SelectItem value="manual">Manual versioning</SelectItem>
                            <SelectItem value="continuous">Continuous versioning</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription>How is documentation versioned and maintained?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
            />

             <FormField control={form.control} name="auditRequirements" render={({ field }) => (
              <FormItem>
                <FormLabel>Audit Requirements</FormLabel>
                <FormControl><Textarea placeholder="What are the requirements for internal or external audits?" {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="changeManagement" render={({ field }) => (
              <FormItem>
                <FormLabel>Change Management</FormLabel>
                <FormControl><Textarea placeholder="Describe the process for managing changes to the AI system." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="qualityControls" render={({ field }) => (
              <FormItem>
                <FormLabel>Quality Controls</FormLabel>
                <FormControl><Textarea placeholder="What quality control measures are in place?" {...field} rows={3} /></FormControl>
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
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

    

    