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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { generateGovernanceSuggestions } from "@/ai/flows/generate-governance-suggestions";

type GovernanceFormData = z.infer<typeof GovernanceSchema>;

const mockProject = {
  useCase: "Customer Support Chatbot for a financial institution.",
};

export function GovernanceForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<GovernanceFormData>({
    resolver: zodResolver(GovernanceSchema),
    defaultValues: {
      policyReferences: "",
      rolesAndResponsibilities: "",
      documentationVersioning: "",
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

        // This is a simple example. A real implementation might involve
        // appending or merging suggestions rather than overwriting.
        if(result.suggestedControls) {
            form.setValue("policyReferences", result.suggestedControls.join("\n"), { shouldValidate: true });
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
                  <Sparkles className="mr-2 h-4 w-4" />
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
            <FormField control={form.control} name="rolesAndResponsibilities" render={({ field }) => (
              <FormItem>
                <FormLabel>Roles and Responsibilities</FormLabel>
                <FormControl><Textarea placeholder="e.g., AI Product Owner, Lead Developer, Compliance Officer. Define who is responsible for what." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="documentationVersioning" render={({ field }) => (
              <FormItem>
                <FormLabel>Documentation Versioning</FormLabel>
                <FormControl><Textarea placeholder="How is documentation versioned and maintained? e.g., Git-based versioning, Confluence version history." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
