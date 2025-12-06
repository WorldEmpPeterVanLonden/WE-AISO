"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Save, CheckCircle } from "lucide-react";

import { RetirementSchema } from "@/lib/definitions";
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

type RetirementFormData = z.infer<typeof RetirementSchema>;

export function RetirementForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RetirementFormData>({
    resolver: zodResolver(RetirementSchema),
    defaultValues: {
        retirementPlan: "",
        dataMigrationPlan: "",
        dataDestructionProcedures: "",
        userCommunicationPlan: "",
    },
  });

  async function onSubmit(data: RetirementFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Lifecycle Complete!",
      description: "The retirement details have been saved and the lifecycle is finished.",
    });
    setIsSaving(false);

    const projectId = "123"; // TODO: Get project ID from params
    router.push(`/project/${projectId}/overview`);
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
              <p className="text-sm font-semibold">7/7 Stages Completed</p>
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
            <Progress value={(7 / 7) * 100} className="mb-6" />
            <FormField control={form.control} name="retirementPlan" render={({ field }) => (
              <FormItem>
                <FormLabel>Retirement Plan</FormLabel>
                <FormControl><Textarea placeholder="Describe the overall plan for retiring the AI system." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="dataMigrationPlan" render={({ field }) => (
              <FormItem>
                <FormLabel>Data Migration Plan (if applicable)</FormLabel>
                <FormControl><Textarea placeholder="Describe the plan for migrating data to another system." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="dataDestructionProcedures" render={({ field }) => (
              <FormItem>
                <FormLabel>Data Destruction Procedures</FormLabel>
                <FormControl><Textarea placeholder="How will system data be securely deleted?" {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="userCommunicationPlan" render={({ field }) => (
              <FormItem>
                <FormLabel>User Communication Plan</FormLabel>
                <FormControl><Textarea placeholder="How will users be informed about the system's retirement?" {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Complete Lifecycle
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
