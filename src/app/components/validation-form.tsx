"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Save, ArrowRight } from "lucide-react";

import { ValidationSchema } from "@/lib/definitions";
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

type ValidationFormData = z.infer<typeof ValidationSchema>;

export function ValidationForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ValidationFormData>({
    resolver: zodResolver(ValidationSchema),
    defaultValues: {
      validationMethods: "",
      acceptanceCriteria: "",
      robustnessTests: "",
      edgeCaseTests: "",
      validationResults: "",
      independentReview: "",
    },
  });

  async function onSubmit(data: ValidationFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Saved!",
      description: "The validation details have been successfully updated.",
    });
    setIsSaving(false);

    const projectId = "123"; // TODO: Get project ID from params
    router.push(`/project/${projectId}/deployment`);
  }

  async function handleGenerateSuggestions() {
    setIsGenerating(true);
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
              <p className="text-sm font-semibold">4/7 Stages Completed</p>
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
            <Progress value={(4 / 7) * 100} className="mb-6" />
            <FormField control={form.control} name="validationMethods" render={({ field }) => (
              <FormItem>
                <FormLabel>Validation Methods</FormLabel>
                <FormControl><Textarea placeholder="e.g., Cross-validation, hold-out set, A/B testing." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="acceptanceCriteria" render={({ field }) => (
              <FormItem>
                <FormLabel>Acceptance Criteria</FormLabel>
                <FormControl><Textarea placeholder="e.g., Accuracy > 95%, F1 score > 0.9, latency < 500ms." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="robustnessTests" render={({ field }) => (
              <FormItem>
                <FormLabel>Robustness Tests</FormLabel>
                <FormControl><Textarea placeholder="e.g., Adversarial attacks, noise injection, testing on out-of-distribution data." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="edgeCaseTests" render={({ field }) => (
              <FormItem>
                <FormLabel>Edge Case Tests</FormLabel>
                <FormControl><Textarea placeholder="e.g., Empty or malformed inputs, high-load scenarios." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="validationResults" render={({ field }) => (
              <FormItem>
                <FormLabel>Validation Results</FormLabel>
                <FormControl><Textarea placeholder="Summarize the key findings from the validation process. Include metrics and charts if possible." {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="independentReview" render={({ field }) => (
              <FormItem>
                <FormLabel>Independent Review (optional)</FormLabel>
                <FormControl><Textarea placeholder="Was the validation reviewed by an independent party? If so, describe the process and findings." {...field} rows={3} /></FormControl>
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
