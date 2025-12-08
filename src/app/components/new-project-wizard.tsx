
"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, ArrowRight, Wand2 } from "lucide-react";
import { useUser } from "@/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createProject } from "@/lib/actions";
import { NewProjectSchema } from "@/lib/definitions";

type NewProjectFormData = z.infer<typeof NewProjectSchema>;

const intendedUserItems = [
  { id: "external_customers", label: "External customers" },
  { id: "internal_employees", label: "Internal employees" },
  { id: "vendors_partners", label: "Vendors / Partners" },
  { id: "children", label: "Children" },
  { id: "general_public", label: "General public" },
  { id: "specialists", label: "Specialists / Professionals" },
  { id: "vulnerable_groups", label: "Vulnerable groups" },
];

const legislationItems = [
  { id: "gdpr", label: "GDPR" },
  { id: "ai_act", label: "EU AI Act" },
  { id: "mdr", label: "MDR (Medical Device Regulation)" },
  { id: "ivdr", label: "IVDR" },
  { id: "nis2", label: "NIS2" },
  { id: "iso42001", label: "ISO 42001" },
  { id: "iso27001", label: "ISO 27001" },
  { id: "local_law", label: "Local Data Protection Law" },
  { id: "other", label: "Other" },
];

const dataCategoryItems = [
  { id: "personal", label: "Personal Data" },
  { id: "financial", label: "Financial Data" },
  { id: "health", label: "Health Data" },
  { id: "location", label: "Location Data" },
  { id: "sensitive", label: "Sensitive Data (race, religion, etc.)" },
  { id: "technical", label: "Technical Data (IP, logs)" },
  { id: "behavioral", label: "Behavioral Data" },
  { id: "other", label: "Other" },
];

export function NewProjectWizard() {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<NewProjectFormData>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      name: "",
      version: "1.0.0",
      customerId: "",
      description: "",
      useCase: "",
      systemType: "LLM",
      riskCategory: "medium",
      intendedUsers: [],
      geographicScope: "EU",
      dataCategories: [],
      dataSources: [],
      legalRequirements: [],
    },
    mode: 'onChange',
  });

  const { formState: { errors, isValid, isDirty }, trigger, control } = form;

  const watchedFields = useWatch({ control });

  const handleNext = async () => {
    const isStepValid = await trigger(["name", "version", "useCase", "systemType", "riskCategory"]);
    if (isStepValid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const onSubmit = async (data: NewProjectFormData) => {
    setIsSaving(true);

    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to create a project.",
      });
      setIsSaving(false);
      return;
    }

    const projectDataWithOwner = { ...data, owner: user.uid };

    try {
      const result = await createProject(projectDataWithOwner);
      if (result?.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Project created!",
        description: "Your new AI compliance project is ready.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description:
          error.message || "There was a problem with creating the project.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const isFormValid = isValid && isDirty;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-6 w-6 text-primary" />
                    New AI Compliance Project
                  </CardTitle>
                  <CardDescription>
                    Step {step} of 2: Fill in the details to start your project.
                  </CardDescription>
                </div>
                <div className="text-sm font-medium">
                  {step === 1 ? 'Project Details' : 'Context & Scope'}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Customer Service Chatbot" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Version <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 1.0.0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer</FormLabel>
                          <FormControl>
                            <Input placeholder="Name of the customer (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="useCase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Use-case <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="What is the purpose of the AI system?" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is a critical field for risk assessment. Be specific.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="systemType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI System Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LLM">LLM</SelectItem>
                              <SelectItem value="ML">ML</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                              <SelectItem value="RuleBased">RuleBased</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="riskCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Risk Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="intendedUsers"
                        render={() => (
                            <FormItem>
                            <div className="mb-4">
                                <FormLabel>Intended Users</FormLabel>
                                <FormDescription>Who are the end users of the system?</FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {intendedUserItems.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="intendedUsers"
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
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="geographicScope"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Geographic Scope</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="EU">EU</SelectItem>
                                    <SelectItem value="EEA">EEA</SelectItem>
                                    <SelectItem value="Global">Global</SelectItem>
                                    <SelectItem value="US">US</SelectItem>
                                    <SelectItem value="India">India</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="legalRequirements"
                        render={() => (
                            <FormItem>
                            <div className="mb-4">
                                <FormLabel>Relevant Legislation</FormLabel>
                                <FormDescription>Which legal frameworks might apply?</FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {legislationItems.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="legalRequirements"
                                    render={({ field }) => (
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
                                    )}
                                />
                                ))}
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dataCategories"
                        render={() => (
                            <FormItem>
                            <div className="mb-4">
                                <FormLabel>Data Categories</FormLabel>
                                <FormDescription>What kind of data will be processed?</FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {dataCategoryItems.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="dataCategories"
                                    render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                            const currentValue = field.value || [];
                                            return checked
                                                ? field.onChange([...currentValue, item.id])
                                                : field.onChange(
                                                    currentValue.filter((value) => value !== item.id)
                                                );
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                    )}
                                />
                                ))}
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              {step === 1 ? (
                <div></div>
              ) : (
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}

              {step === 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={!isFormValid || isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Create Project
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

    