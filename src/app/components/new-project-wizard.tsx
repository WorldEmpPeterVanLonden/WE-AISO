
"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { createProject } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ProjectSchema as Step1Schema, NewProjectSchema, BasicInfoObjectSchema } from "@/lib/definitions";
import { useUser } from "@/firebase";

const FormSchema = z.object({
    name: z.string().min(1, "Project name is required."),
    version: z.string().min(1, "Version is required."),
    customerId: z.string().optional(),
    description: z.string().optional(),
    useCase: z.string().min(1, "Use-case is required."),
    systemType: z.enum(["LLM", "ML", "Hybrid", "RuleBased"]),
    riskCategory: z.enum(["high", "medium", "low"]),
    intendedUsers: z.array(z.string()).optional(),
    geographicScope: z.string().min(1, "Geographic scope is required."),
    dataCategories: z.array(z.string()).optional(),
    dataSources: z.array(z.string()).optional(),
    legalRequirements: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof FormSchema>;

const dataCategoryItems = [
    { id: "personal", label: "Personal Data" },
    { id: "financial", label: "Financial Data" },
    { id: "health", label: "Health Data" },
    { id: "sensitive", label: "Sensitive Data (race, religion, etc.)" },
    { id: "location", label: "Location Data" },
    { id: "technical", label: "Technical Data (IP, logs)" },
    { id: "behavioral", label: "Behavioral Data" },
    { id: "other", label: "Other" },
]

export function NewProjectWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const form = useForm<FormData>({
    resolver: zodResolver(
      step === 1
        ? Step1Schema.pick({ name: true, version: true, customerId: true, description: true, useCase: true, systemType: true, riskCategory: true })
        : step === 2
        ? BasicInfoObjectSchema.pick({ intendedUsers: true, geographicScope: true, dataCategories: true, dataSources: true, legalRequirements: true})
        : FormSchema
    ),
    defaultValues: {
      name: "",
      version: "1.0.0",
      customerId: "",
      description: "",
      useCase: "",
      systemType: "LLM",
      riskCategory: "medium",
      intendedUsers: [],
      geographicScope: "",
      dataCategories: [],
      dataSources: [],
      legalRequirements: [],
    },
    mode: "onChange",
  });

  const formData = useWatch({ control: form.control });

  const nextStep = async () => {
    const fieldsToValidate = Object.keys(Step1Schema.pick({ name: true, version: true, customerId: true, description: true, useCase: true, systemType: true, riskCategory: true }).shape) as (keyof FormData)[];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  
  const jumpToStep = async (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
      return;
    }
    
    let isValid = true;
    if (step === 1 && targetStep > 1) {
        const fields = Object.keys(Step1Schema.pick({ name: true, version: true, customerId: true, description: true, useCase: true, systemType: true, riskCategory: true }).shape) as (keyof FormData)[];
        isValid = await form.trigger(fields);
    }
    
    if (isValid) {
      setStep(targetStep);
    }
  }


  async function onSubmit(data: FormData) {
    console.log("[Wizard] onSubmit triggered.");
    if (!user) {
        console.error("[Wizard] User not authenticated during onSubmit.");
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to create a project.",
        });
        return;
    }
    console.log("[Wizard] User object available:", { uid: user.uid, email: user.email });
    console.log("[Wizard] Form data being submitted:", data);
    setIsSubmitting(true);
    try {
      const projectDataWithOwner = { ...data, owner: user.uid };
      await createProject(projectDataWithOwner);
      toast({
        title: "Project created!",
        description: `${data.name} has been successfully created.`,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("[Wizard] Error caught during createProject call:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Could not create the project. Please check the console for more details.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleNextToReview = async () => {
    const fieldsToValidate = Object.keys(BasicInfoObjectSchema.pick({ intendedUsers: true, geographicScope: true, dataCategories: true, dataSources: true, legalRequirements: true}).shape) as (keyof FormData)[];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(3);
    }
  };

  const progress = (step / 3) * 100;

  if (userLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between font-medium text-sm text-muted-foreground">
                <button onClick={() => jumpToStep(1)} className={step >= 1 ? "text-primary font-semibold" : ""}>Step 1: Basic Details</button>
                <button onClick={() => jumpToStep(2)} className={step >= 2 ? "text-primary font-semibold" : ""}>Step 2: Scope & Context</button>
                <button onClick={async () => {
                     const isStep1Valid = await form.trigger(Object.keys(Step1Schema.pick({ name: true, version: true, customerId: true, description: true, useCase: true, systemType: true, riskCategory: true }).shape) as (keyof FormData)[]);
                     if (!isStep1Valid) {
                         setStep(1);
                         return;
                     }
                     const isStep2Valid = await form.trigger(Object.keys(BasicInfoObjectSchema.pick({ intendedUsers: true, geographicScope: true, dataCategories: true, dataSources: true, legalRequirements: true}).shape) as (keyof FormData)[]);
                     if (!isStep2Valid) {
                         setStep(2);
                         return;
                     }
                     setStep(3)
                }} className={step >= 3 ? "text-primary font-semibold" : ""}>Step 3: Review</button>
            </div>
        </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8 pt-6">
            {step === 1 && (
              <>
                <CardTitle>Step 1: Basic Details</CardTitle>
                <CardDescription>Start with the basic information for your AI project.</CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Project Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="e.g. Customer Service Chatbot" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="version" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Version <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="e.g. 1.0.0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="customerId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Customer</FormLabel>
                            <FormControl><Input placeholder="Name of the customer (optional)" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea placeholder="A brief description of the project" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="useCase" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Use-case <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Textarea placeholder="What is the purpose of the AI system?" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="systemType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>AI System Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="LLM">LLM</SelectItem>
                                <SelectItem value="ML">ML</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                <SelectItem value="RuleBased">RuleBased</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="riskCategory" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Risk Category</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <CardTitle>Step 2: Scope & Context</CardTitle>
                <CardDescription>Define the context and boundaries of your project.</CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="intendedUsers" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Intended Users</FormLabel>
                            <FormControl><Input placeholder="e.g. End users, internal employees" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} value={Array.isArray(field.value) ? field.value.join(", ") : ""} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="geographicScope" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Geographic Scope <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="e.g. Netherlands, EU, Worldwide" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="legalRequirements" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Relevant Legislation</FormLabel>
                            <FormControl><Input placeholder="e.g. GDPR, AI Act, MDR" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} value={Array.isArray(field.value) ? field.value.join(", ") : ""} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="dataSources" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Data Sources</FormLabel>
                            <FormControl><Textarea placeholder="Where does the data come from? (comma-separated)" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} value={Array.isArray(field.value) ? field.value.join(", ") : ""} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="dataCategories" render={() => (
                        <FormItem className="md:col-span-2">
                             <div className="mb-4">
                                <FormLabel>Data Categories</FormLabel>
                                <FormDescription>Select the categories of data being processed.</FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                            {dataCategoryItems.map((item) => (
                                <FormField key={item.id} control={form.control} name="dataCategories" render={({ field }) => {
                                    return (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), item.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== item.id
                                                        )
                                                    )
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                    )
                                }} />
                            ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
              </>
            )}

            {step === 3 && (
                <>
                <CardTitle>Step 3: Review & Confirm</CardTitle>
                <CardDescription>Review the entered details and create the project.</CardDescription>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Basic Details</h3>
                        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Project Name:</strong> {formData.name}</div>
                            <div><strong>Version:</strong> {formData.version}</div>
                            <div><strong>Customer:</strong> {formData.customerId || "-"}</div>
                            <div><strong>System Type:</strong> {formData.systemType}</div>
                            <div className="col-span-2"><strong>Risk Category:</strong> <span className="capitalize">{formData.riskCategory}</span></div>
                            <div className="col-span-2"><strong>Description:</strong> {formData.description || "-"}</div>
                            <div className="col-span-2"><strong>Use-case:</strong> {formData.useCase}</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Scope & Context</h3>
                         <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Intended Users:</strong> {Array.isArray(formData.intendedUsers) ? formData.intendedUsers.join(', ') : ""}</div>
                            <div><strong>Geographic Scope:</strong> {formData.geographicScope}</div>
                            <div className="col-span-2"><strong>Legislation:</strong> {Array.isArray(formData.legalRequirements) ? formData.legalRequirements.join(', ') : ""}</div>
                            <div className="col-span-2"><strong>Data Sources:</strong> {Array.isArray(formData.dataSources) ? formData.dataSources.join(', ') : ""}</div>
                            <div className="col-span-2">
                                <strong>Data Categories:</strong> {formData.dataCategories?.map(id => dataCategoryItems.find(item => item.id === id)?.label).join(', ') || "-"}
                            </div>
                        </div>
                    </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} type="button">
                Previous
              </Button>
            )}
            {step === 1 && <div></div>}
            {step === 1 && (
              <Button onClick={nextStep} type="button">
                Next
              </Button>
            )}
             {step === 2 && (
              <Button onClick={handleNextToReview} type="button">
                Next
              </Button>
            )}
            {step === 3 && (
              <Button type="submit" disabled={isSubmitting || userLoading}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
