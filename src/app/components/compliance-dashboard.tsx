"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bot,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import {
  analyzeRisk,
} from "@/ai/flows/automated-risk-analysis";
import { 
    type RiskAnalysisInput, 
    type RiskAnalysisOutput, 
    RiskAnalysisInputSchema 
} from "@/ai/schemas/risk-analysis";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

type RiskLevel = "low" | "medium" | "high";

const RiskLevelBadge = ({ level }: { level: string }) => {
  const lowerCaseLevel = level.toLowerCase() as RiskLevel;
  return (
    <Badge
      variant={
        lowerCaseLevel === 'high'
          ? 'destructive'
          : lowerCaseLevel === 'medium'
          ? 'default'
          : 'secondary'
      }
      className="capitalize"
    >
      {level}
    </Badge>
  );
};

export function ComplianceDashboard() {
  const [analysisResult, setAnalysisResult] =
    useState<RiskAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RiskAnalysisInput>({
    resolver: zodResolver(RiskAnalysisInputSchema),
    defaultValues: {
      useCase: "",
      dataType: "",
      modelType: "LLM",
      userGroup: "",
    },
  });

  async function onSubmit(data: RiskAnalysisInput) {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const result = await analyzeRisk(data);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred during risk analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl font-bold text-primary">
              AISO Compliance Manager
            </h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="font-headline text-4xl font-bold tracking-tight">Automated Risk Analysis</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Leverage AI to assess risks aligned with ISO 42001 standards.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Card className="sticky top-24 shadow-lg">
                <CardHeader>
                  <CardTitle>AI System Details</CardTitle>
                  <CardDescription>
                    Provide information about your AI system to start the risk analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="useCase"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Use Case</FormLabel>
                            <FormControl>
                              <Textarea placeholder="e.g., Customer support chatbot, medical diagnosis tool..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dataType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Type</FormLabel>
                            <FormControl>
                              <Textarea placeholder="e.g., Anonymized user queries, medical images, financial transaction data..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="modelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a model type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="LLM">LLM</SelectItem>
                                <SelectItem value="ML">ML</SelectItem>
                                <SelectItem value="rule-based">Rule-based</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="userGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Affected User Group</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., General public, doctors, children..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                        ) : (
                          <>Analyze Risks <ChevronRight className="ml-2 h-4 w-4" /></>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="min-h-full shadow-lg">
                <CardHeader>
                  <CardTitle>AI Risk Register</CardTitle>
                  <CardDescription>
                    Identified risks, mitigations, and ISO 42001 control mappings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                            <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
                            <span className="font-headline text-lg">Generating risk analysis...</span>
                        </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
                      <ShieldX className="h-12 w-12" />
                      <h3 className="mt-4 font-headline text-xl font-semibold">Analysis Failed</h3>
                      <p className="mt-1 text-sm">{error}</p>
                    </div>
                  )}
                  {!isLoading && !error && !analysisResult && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 p-8 text-center text-muted-foreground">
                      <Bot className="h-12 w-12" />
                      <h3 className="mt-4 font-headline text-xl font-semibold">Awaiting Analysis</h3>
                      <p className="mt-1 text-sm">Fill out the form to generate the AI risk register.</p>
                    </div>
                  )}
                  {analysisResult && (
                    <Accordion type="multiple" className="w-full" defaultValue={analysisResult.risks.map(r => r.riskType)}>
                      {analysisResult.risks.map((risk) => (
                        <AccordionItem value={risk.riskType} key={risk.riskType}>
                          <AccordionTrigger className="text-lg hover:no-underline">
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">{risk.riskType}</span>
                              <RiskLevelBadge level={risk.riskLevel} />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <div className="space-y-4 rounded-md border bg-card p-4">
                              <div>
                                <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                                  <ShieldCheck className="h-5 w-5 text-accent" />
                                  Recommended Mitigations
                                </h4>
                                <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                                  {risk.mitigations.map((mitigation, i) => (
                                    <li key={i}>{mitigation}</li>
                                  ))}
                                </ul>
                              </div>
                              <Separator />
                              <div>
                                <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                                  <ClipboardCheck className="h-5 w-5 text-accent" />
                                  ISO 42001 Controls
                                </h4>
                                 <ul className="ml-6 list-disc space-y-1 font-code text-sm text-muted-foreground">
                                  {risk.iso27001Controls.map((control, i) => (
                                    <li key={i}>{control}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
