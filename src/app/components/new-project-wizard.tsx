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

const projectSchema = z.object({
  name: z.string().min(3, "Projectnaam is te kort"),
  version: z.string().min(1, "Versie is verplicht"),
  customerId: z.string().optional(),
  description: z.string().optional(),
  useCase: z.string().min(1, "Use-case is verplicht"),
  systemType: z.enum(["LLM", "ML", "Hybrid", "RuleBased"]),
  riskCategory: z.enum(["high", "medium", "low"]),
});

const basicInfoSchema = z.object({
  intendedUsers: z.string().min(1, "Doelgroep is verplicht"),
  geographicScope: z.string().min(1, "Geografische scope is verplicht"),
  dataCategories: z.array(z.string()).optional(),
  dataSources: z.string().optional(),
  legalRequirements: z.string().optional(),
});

const formSchema = projectSchema.merge(basicInfoSchema);

type FormData = z.infer<typeof formSchema>;

const dataCategoryItems = [
    { id: "personal", label: "Persoonsgegevens" },
    { id: "financial", label: "Financiële gegevens" },
    { id: "health", label: "Gezondheidsgegevens" },
    { id: "sensitive", label: "Gevoelige gegevens (ras, religie, etc.)" },
    { id: "location", label: "Locatiegegevens" },
    { id: "technical", label: "Technische gegevens (IP, logs)" },
    { id: "other", label: "Anders" },
]

export function NewProjectWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(
      step === 1
        ? projectSchema
        : step === 2
        ? basicInfoSchema
        : formSchema
    ),
    defaultValues: {
      name: "",
      version: "1.0.0",
      customerId: "",
      description: "",
      useCase: "",
      systemType: "LLM",
      riskCategory: "medium",
      intendedUsers: "",
      geographicScope: "",
      dataCategories: [],
      dataSources: "",
      legalRequirements: "",
    },
  });

  const formData = useWatch({ control: form.control });

  const nextStep = async () => {
    const isValid = await form.trigger(Object.keys(projectSchema.shape) as (keyof FormData)[]);
    if (isValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };
  
  const jumpToStep = async (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
      return;
    }
    
    let isValid = true;
    if (step === 1 && targetStep > 1) {
        isValid = await form.trigger(Object.keys(projectSchema.shape) as (keyof FormData)[]);
    }
     if (step === 2 && targetStep > 2) {
        isValid = await form.trigger(Object.keys(basicInfoSchema.shape) as (keyof FormData)[]);
    }

    if (isValid) {
      setStep(targetStep);
    }
  }


  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      await createProject(data);
      toast({
        title: "Project aangemaakt!",
        description: `${data.name} is succesvol aangemaakt.`,
      });
      router.push("/");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh nee! Er is iets misgegaan.",
        description: "Kon het project niet aanmaken. Probeer het opnieuw.",
      });
      setIsSubmitting(false);
    }
  }

  const progress = (step / 3) * 100;

  return (
    <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between font-medium text-sm text-muted-foreground">
                <button onClick={() => jumpToStep(1)} className={step >= 1 ? "text-primary" : ""}>Stap 1: Basisgegevens</button>
                <button onClick={() => jumpToStep(2)} className={step >= 2 ? "text-primary" : ""}>Stap 2: Scope & Context</button>
                <button onClick={() => jumpToStep(3)} className={step >= 3 ? "text-primary" : ""}>Stap 3: Overzicht</button>
            </div>
        </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            {step === 1 && (
              <>
                <CardTitle>Stap 1: Basisgegevens</CardTitle>
                <CardDescription>Start met de basisinformatie van uw AI-project.</CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Projectnaam</FormLabel>
                            <FormControl><Input placeholder="bv. Klantenservice Chatbot" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="version" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Versie</FormLabel>
                            <FormControl><Input placeholder="bv. 1.0.0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="customerId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Klant</FormLabel>
                            <FormControl><Input placeholder="Naam van de klant (optioneel)" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Beschrijving</FormLabel>
                            <FormControl><Textarea placeholder="Een korte beschrijving van het project" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="useCase" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Use-case</FormLabel>
                            <FormControl><Textarea placeholder="Wat is het doel van het AI-systeem?" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="systemType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>AI-systeemtype</FormLabel>
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
                            <FormLabel>Risicocategorie</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="low">Laag</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">Hoog</SelectItem>
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
                <CardTitle>Stap 2: Scope & Context</CardTitle>
                <CardDescription>Definieer de context en de grenzen van uw project.</CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="intendedUsers" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Doelgroep</FormLabel>
                            <FormControl><Input placeholder="bv. Eindgebruikers, interne medewerkers" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="geographicScope" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Geografische scope</FormLabel>
                            <FormControl><Input placeholder="bv. Nederland, EU, wereldwijd" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="legalRequirements" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Relevante wetgeving</FormLabel>
                            <FormControl><Input placeholder="bv. GDPR, AI Act, MDR" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="dataSources" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Data-bronnen</FormLabel>
                            <FormControl><Textarea placeholder="Waar komt de data vandaan?" {...field} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="dataCategories" render={() => (
                        <FormItem className="md:col-span-2">
                             <div className="mb-4">
                                <FormLabel>Data-categorieën</FormLabel>
                                <FormDescription>Selecteer de categorieën van data die verwerkt worden.</FormDescription>
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
                <CardTitle>Stap 3: Overzicht & Bevestigen</CardTitle>
                <CardDescription>Controleer de ingevoerde gegevens en maak het project aan.</CardDescription>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Basisgegevens</h3>
                        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 gap-4 text-sm">
                            <p><strong>Projectnaam:</strong> {formData.name}</p>
                            <p><strong>Versie:</strong> {formData.version}</p>
                            <p><strong>Klant:</strong> {formData.customerId || "-"}</p>
                            <p><strong>Systeemtype:</strong> {formData.systemType}</p>
                            <p><strong>Risicocategorie:</strong> {formData.riskCategory}</p>
                            <p className="col-span-2"><strong>Beschrijving:</strong> {formData.description || "-"}</p>
                            <p className="col-span-2"><strong>Use-case:</strong> {formData.useCase}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Scope & Context</h3>
                         <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 gap-4 text-sm">
                            <p><strong>Doelgroep:</strong> {formData.intendedUsers}</p>
                            <p><strong>Geografische scope:</strong> {formData.geographicScope}</p>
                            <p className="col-span-2"><strong>Wetgeving:</strong> {formData.legalRequirements || "-"}</p>
                            <p className="col-span-2"><strong>Databronnen:</strong> {formData.dataSources || "-"}</p>
                            <p className="col-span-2">
                                <strong>Data-categorieën:</strong> {formData.dataCategories?.map(id => dataCategoryItems.find(item => item.id === id)?.label).join(', ') || "-"}
                            </p>
                        </div>
                    </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} type="button">
                Vorige
              </Button>
            )}
            {step === 1 && <div></div>}
            {step < 3 ? (
              <Button onClick={nextStep} type="button">
                Volgende
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Project aanmaken...
                  </>
                ) : (
                  "Project aanmaken"
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
