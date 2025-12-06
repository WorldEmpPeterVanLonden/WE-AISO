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

type DesignFormData = z.infer<typeof DesignSchema>;

export function DesignForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  // TODO: Fetch existing data for the project
  const form = useForm<DesignFormData>({
    resolver: zodResolver(DesignSchema),
    defaultValues: {
      functionalRequirements: "",
      nonFunctionalRequirements: "",
      designChoices: "",
      dataArchitecture: "",
      explainabilityStrategy: "",
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
    // TODO: Implement AI suggestion generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Suggestions Generated",
      description: "The AI has filled in some fields for you (mock).",
    });
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
                          <Sparkles className="mr-2 h-4 w-4" />
                          AI Assist
                      </>
                  )}
              </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={(1 / 7) * 100} className="mb-6" />
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
            <FormField control={form.control} name="explainabilityStrategy" render={({ field }) => (
              <FormItem>
                <FormLabel>Explainability Strategy</FormLabel>
                <FormControl><Textarea placeholder="e.g., Use LIME for local explanations; Provide users with confidence scores for answers." {...field} rows={3} /></FormControl>
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
