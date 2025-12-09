
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Save, ArrowRight } from "lucide-react";

import { TrainingSchema } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { generateTrainingSuggestions } from "@/ai/flows/generate-training-suggestions";

type TrainingFormData = z.infer<typeof TrainingSchema>;

const qualityCheckItems = [
    { id: "manual-review", label: "Manual review" },
    { id: "automated-validation", label: "Automated validation" },
    { id: "statistical-anomaly-detection", label: "Statistical anomaly detection" },
];

export function TrainingForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<TrainingFormData>({
    resolver: zodResolver(TrainingSchema),
    defaultValues: {
      hasTrainingPhase: false,
      trainingMethod: "no-training",
      datasetDescription: "",
      datasetSources: "",
      dataQualityChecks: [],
      biasAssessment: "",
      privacyAssessment: "",
      trainingProcedure: "",
    },
  });

  const hasTrainingPhase = form.watch("hasTrainingPhase");

  async function onSubmit(data: TrainingFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Saved!",
      description: "The training details have been successfully updated.",
    });
    setIsSaving(false);

    const projectId = "123"; // TODO: Get project ID from params
    router.push(`/project/${projectId}/validation`);
  }

  async function handleGenerateSuggestions() {
    setIsGenerating(true);
    try {
        const result = await generateTrainingSuggestions({ useCase: "A customer support chatbot for an e-commerce platform that handles order tracking, returns, and product questions." });
        
        if (result.datasetDescription) form.setValue("datasetDescription", result.datasetDescription, { shouldValidate: true, shouldDirty: true });
        if (result.datasetSources) form.setValue("datasetSources", result.datasetSources, { shouldValidate: true, shouldDirty: true });
        if (result.biasAssessment) form.setValue("biasAssessment", result.biasAssessment, { shouldValidate: true, shouldDirty: true });
        if (result.privacyAssessment) form.setValue("privacyAssessment", result.privacyAssessment, { shouldValidate: true, shouldDirty: true });
        if (result.trainingProcedure) form.setValue("trainingProcedure", result.trainingProcedure, { shouldValidate: true, shouldDirty: true });

        // You might want to suggest a training method or quality checks too
        // For example: form.setValue("trainingMethod", "fine-tuning");
        
        toast({
            title: "Suggestions Generated",
            description: "The AI has filled in the training fields for you.",
        });

    } catch (error) {
        console.error("Error generating training suggestions:", error);
        toast({
            variant: "destructive",
            title: "Generation Error",
            description: "Could not generate AI suggestions for the training phase.",
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
              <p className="text-sm font-semibold">3/7 Stages Completed</p>
            </div>
            <Button onClick={handleGenerateSuggestions} disabled={isGenerating || !hasTrainingPhase} variant="outline" size="sm">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                  AI Assist
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={(3 / 7) * 100} className="mb-6" />

            <FormField
              control={form.control}
              name="hasTrainingPhase"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Does this project have a training or fine-tuning phase?
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className={cn("space-y-6", !hasTrainingPhase && "hidden")}>
                <FormField control={form.control} name="trainingMethod" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Training Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="no-training">No training (pretrained only)</SelectItem>
                                <SelectItem value="fine-tuning">Fine-tuning</SelectItem>
                                <SelectItem value="supervised">Supervised learning</SelectItem>
                                <SelectItem value="reinforcement">Reinforcement learning</SelectItem>
                                <SelectItem value="transfer">Transfer learning</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="datasetDescription" render={({ field }) => (
                <FormItem>
                    <FormLabel>Dataset Description</FormLabel>
                    <FormControl><Textarea placeholder="Describe the dataset used for training, its scope, and limitations." {...field} rows={3} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="datasetSources" render={({ field }) => (
                <FormItem>
                    <FormLabel>Dataset Sources</FormLabel>
                    <FormControl><Textarea placeholder="Where did the data come from? e.g., public benchmarks, internal data, third-party." {...field} rows={3} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
                
                <FormField
                    control={form.control}
                    name="dataQualityChecks"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel>Data Quality Checks</FormLabel>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {qualityCheckItems.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="dataQualityChecks"
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
                                                currentValue?.filter(
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

                <FormField control={form.control} name="biasAssessment" render={({ field }) => (
                <FormItem>
                    <FormLabel>Bias Assessment</FormLabel>
                    <FormControl><Textarea placeholder="How was potential bias in the data or model assessed and mitigated?" {...field} rows={3} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
                
                <FormField control={form.control} name="privacyAssessment" render={({ field }) => (
                <FormItem>
                    <FormLabel>Privacy Assessment</FormLabel>
                    <FormControl><Textarea placeholder="What steps were taken to protect privacy? e.g., anonymization, differential privacy." {...field} rows={3} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="trainingProcedure" render={({ field }) => (
                <FormItem>
                    <FormLabel>Training Procedure</FormLabel>
                    <FormControl><Textarea placeholder="Describe the training process, including hyperparameters and environment." {...field} rows={3} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
            </div>

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
