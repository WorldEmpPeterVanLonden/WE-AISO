
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Save, ArrowRight } from "lucide-react";

import { DevelopmentSchema } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateDevelopmentSuggestions } from "@/ai/flows/generate-development-suggestions";

type DevelopmentFormData = z.infer<typeof DevelopmentSchema>;

const toolchainItems = [
    { id: "firebase", label: "Firebase" },
    { id: "nextjs", label: "Next.js" },
    { id: "python", label: "Python" },
    { id: "nodejs", label: "Node.js" },
    { id: "docker", label: "Docker" },
    { id: "azure-ml", label: "Azure ML" },
    { id: "github-actions", label: "GitHub Actions" },
];

export function DevelopmentForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<DevelopmentFormData>({
    resolver: zodResolver(DevelopmentSchema),
    defaultValues: {
      toolchain: [],
      dependencies: "",
      securityControls: "",
      testApproach: "",
      codingStandards: "iso42001",
    },
  });

  async function onSubmit(data: DevelopmentFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Saved!",
      description: "The development details have been successfully updated.",
    });
    setIsSaving(false);

    const projectId = "123"; // TODO: Get project ID from params
    router.push(`/project/${projectId}/training`);
  }

  async function handleGenerateSuggestions() {
    setIsGenerating(true);
    try {
        const result = await generateDevelopmentSuggestions({ useCase: "A customer support chatbot for an e-commerce platform that handles order tracking, returns, and product questions." });
        
        if (result.toolchain) form.setValue("toolchain", result.toolchain, { shouldValidate: true, shouldDirty: true });
        if (result.dependencies) form.setValue("dependencies", result.dependencies, { shouldValidate: true, shouldDirty: true });
        if (result.securityControls) form.setValue("securityControls", result.securityControls, { shouldValidate: true, shouldDirty: true });
        if (result.testApproach) form.setValue("testApproach", result.testApproach, { shouldValidate: true, shouldDirty: true });
        
        toast({
            title: "Suggestions Generated",
            description: "The AI has filled in the development fields for you.",
        });

    } catch (error) {
        console.error("Error generating development suggestions:", error);
        toast({
            variant: "destructive",
            title: "Generation Error",
            description: "Could not generate AI suggestions for the development phase.",
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
              <p className="text-sm font-semibold">2/7 Stages Completed</p>
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
            <Progress value={(2 / 7) * 100} className="mb-6" />

            <FormField
              control={form.control}
              name="toolchain"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Toolchain</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {toolchainItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="toolchain"
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

            <FormField control={form.control} name="codingStandards" render={({ field }) => (
                <FormItem>
                    <FormLabel>Coding Standards</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="iso42001">ISO 42001 coding guidelines</SelectItem>
                            <SelectItem value="pep8">PEP-8</SelectItem>
                            <SelectItem value="google">Google style</SelectItem>
                            <SelectItem value="custom">Custom standard</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField
              control={form.control}
              name="dependencies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dependencies</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Tensorflow 2.5, PyTorch 1.9, Scikit-learn 1.0"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="securityControls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security Controls</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Input validation, access control on data, vulnerability scanning."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="testApproach"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Approach</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Unit tests for data preprocessing, integration tests for model API, performance testing."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

    