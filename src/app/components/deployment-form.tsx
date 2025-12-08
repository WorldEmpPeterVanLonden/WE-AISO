
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Save, ArrowRight } from "lucide-react";

import { DeploymentSchema } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type DeploymentFormData = z.infer<typeof DeploymentSchema>;

const monitoringMethodItems = [
    { id: "automated-outputs-check", label: "Automated outputs check" },
    { id: "performance-metrics", label: "Performance metrics" },
    { id: "human-moderation", label: "Human moderation" },
    { id: "no-monitoring", label: "No monitoring" },
];

export function DeploymentForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<DeploymentFormData>({
    resolver: zodResolver(DeploymentSchema),
    defaultValues: {
      infrastructure: "",
      region: "",
      deploymentType: "cloud",
      ciCdPipeline: "",
      accessControl: "",
      loggingPolicy: "",
      secretsManagement: "",
      monitoringMethod: [],
      monitoringSetup: "",
    },
  });

  async function onSubmit(data: DeploymentFormData) {
    setIsSaving(true);
    console.log("Form data submitted:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Saved!",
      description: "The deployment details have been successfully updated.",
    });
    setIsSaving(false);

    const projectId = "123"; // TODO: Get project ID from params
    router.push(`/project/${projectId}/operation`);
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
              <p className="text-sm font-semibold">5/7 Stages Completed</p>
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
            <Progress value={(5 / 7) * 100} className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="infrastructure" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Infrastructure</FormLabel>
                    <FormControl><Input placeholder="e.g., GCP, Azure, AWS, on-premise" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                 <FormField control={form.control} name="region" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl><Input placeholder="e.g., europe-west4" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="deploymentType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deployment Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="cloud">Cloud-based</SelectItem>
                            <SelectItem value="on-premise">On-premise</SelectItem>
                            <SelectItem value="hybrid">Hybrid deployment</SelectItem>
                            <SelectItem value="edge">Edge deployment</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="ciCdPipeline" render={({ field }) => (
              <FormItem>
                <FormLabel>CI/CD Pipeline</FormLabel>
                <FormControl><Textarea placeholder="Describe the Continuous Integration and Deployment pipeline. e.g., GitHub Actions, Jenkins" {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="accessControl" render={({ field }) => (
              <FormItem>
                <FormLabel>Access Control</FormLabel>
                <FormControl><Textarea placeholder="How is access to the production environment managed? e.g., IAM roles, security groups" {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="loggingPolicy" render={({ field }) => (
              <FormItem>
                <FormLabel>Logging Policy</FormLabel>
                <FormControl><Textarea placeholder="What is logged and for how long? e.g., all API requests are logged for 90 days" {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="secretsManagement" render={({ field }) => (
              <FormItem>
                <FormLabel>Secrets Management</FormLabel>
                <FormControl><Textarea placeholder="How are secrets (API keys, passwords) managed? e.g., Google Secret Manager, HashiCorp Vault" {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField
              control={form.control}
              name="monitoringMethod"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Monitoring Method</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {monitoringMethodItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="monitoringMethod"
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

            <FormField control={form.control} name="monitoringSetup" render={({ field }) => (
              <FormItem>
                <FormLabel>Monitoring Setup</FormLabel>
                <FormControl><Textarea placeholder="How is the system monitored in production? e.g., Prometheus, Grafana, Google Cloud Monitoring" {...field} rows={3} /></FormControl>
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

    

    