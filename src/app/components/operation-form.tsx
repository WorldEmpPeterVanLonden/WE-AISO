
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Save, ArrowRight } from "lucide-react";

import { OperationSchema } from "@/lib/definitions";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OperationFormData = z.infer<typeof OperationSchema>;

export function OperationForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<OperationFormData>({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      monitoringProcedures: "",
      driftDetection: "",
      incidentHandling: "",
      modelUpdatePolicy: "",
      updateStrategy: "manual",
      userFeedbackProcess: "",
      loggingRetention: "",
    },
  });

  async function onSubmit(data: OperationFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Saved!",
      description: "The operation details have been successfully updated.",
    });
    setIsSaving(false);

    const projectId = "123"; // TODO: Get project ID from params
    router.push(`/project/${projectId}/retirement`);
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
              <p className="text-sm font-semibold">6/7 Stages Completed</p>
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
            <Progress value={(6 / 7) * 100} className="mb-6" />
            <FormField control={form.control} name="monitoringProcedures" render={({ field }) => (
              <FormItem>
                <FormLabel>Monitoring Procedures</FormLabel>
                <FormControl><Textarea placeholder="e.g., Dashboards for performance metrics, alerts for anomalies." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="driftDetection" render={({ field }) => (
              <FormItem>
                <FormLabel>Drift Detection</FormLabel>
                <FormControl><Textarea placeholder="e.g., Statistical monitoring of input data distributions and model output." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="incidentHandling" render={({ field }) => (
              <FormItem>
                <FormLabel>Incident Handling Process</FormLabel>
                <FormControl><Textarea placeholder="e.g., On-call rotation, escalation policy, root cause analysis procedure." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="modelUpdatePolicy" render={({ field }) => (
              <FormItem>
                <FormLabel>Model Update Policy</FormLabel>
                <FormControl><Textarea placeholder="e.g., Scheduled quarterly re-training, continuous deployment based on performance." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="updateStrategy" render={({ field }) => (
                <FormItem>
                    <FormLabel>Update Strategy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="manual">Manual updates</SelectItem>
                            <SelectItem value="scheduled">Scheduled updates</SelectItem>
                            <SelectItem value="continuous">Continuous deployment</SelectItem>
                            <SelectItem value="none">No updates planned</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="userFeedbackProcess" render={({ field }) => (
              <FormItem>
                <FormLabel>User Feedback Process</FormLabel>
                <FormControl><Textarea placeholder="e.g., In-app feedback form, regular user surveys." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="loggingRetention" render={({ field }) => (
              <FormItem>
                <FormLabel>Logging Retention Policy</FormLabel>
                <FormControl><Textarea placeholder="e.g., System logs are retained for 1 year, user data is anonymized after 30 days." {...field} rows={3} /></FormControl>
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

    

    