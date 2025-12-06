
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import {
  RiskRegisterEntrySchema,
  type RiskRegisterEntry,
} from "@/lib/definitions";
import { suggestRisk } from "@/ai/flows/suggest-risk";

type RiskFormData = z.infer<typeof RiskRegisterEntrySchema>;

interface RiskDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddRisk: (risk: RiskRegisterEntry) => void;
}

const impactLikelihoodLabels: { [key: number]: string } = {
    1: "1 (Very Low)",
    2: "2 (Low)",
    3: "3 (Medium)",
    4: "4 (High)",
    5: "5 (Very High)",
};

export function RiskDialog({ isOpen, setIsOpen, onAddRisk }: RiskDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<RiskFormData>({
    resolver: zodResolver(RiskRegisterEntrySchema),
    defaultValues: {
      title: "",
      description: "",
      category: "accuracy",
      likelihood: 3,
      impact: 3,
      mitigations: "",
      isoControls: "",
      status: "open",
    },
  });

  const likelihood = form.watch("likelihood");
  const impact = form.watch("impact");
  const riskLevel = likelihood * impact;

  async function handleGenerateSuggestions() {
    setIsGenerating(true);
    try {
        const currentTitle = form.getValues("title");
        const result = await suggestRisk({
            useCase: "A customer support chatbot for an e-commerce platform that handles order tracking, returns, and product questions.", // TODO: Pass from props
            dataCategories: ["Personal Data", "Technical Data (IP, logs)"], // TODO: Pass from props
            riskTitle: currentTitle,
        });

        if (result.description) form.setValue("description", result.description, { shouldValidate: true, shouldDirty: true });
        if (result.category) form.setValue("category", result.category, { shouldValidate: true, shouldDirty: true });
        if (result.likelihood) form.setValue("likelihood", result.likelihood, { shouldValidate: true, shouldDirty: true });
        if (result.impact) form.setValue("impact", result.impact, { shouldValidate: true, shouldDirty: true });
        if (result.mitigations) form.setValue("mitigations", result.mitigations.join("\n"), { shouldValidate: true, shouldDirty: true });
        if (result.isoControls) form.setValue("isoControls", result.isoControls.join(", "), { shouldValidate: true, shouldDirty: true });

        toast({
            title: "AI Suggestion Complete",
            description: "The AI has suggested details for this risk.",
        });

    } catch (error) {
        console.error("Error generating risk suggestion:", error);
        toast({
            variant: "destructive",
            title: "Suggestion Error",
            description: "Could not generate AI suggestion. Please try again.",
        });
    }
    setIsGenerating(false);
  }


  function onSubmit(data: RiskFormData) {
    const riskData: RiskRegisterEntry = {
        ...data,
        mitigations: data.mitigations?.split('\n').filter(m => m.trim() !== '') || [],
        isoControls: data.isoControls?.split(',').map(c => c.trim()).filter(c => c !== '') || [],
    };
    onAddRisk(riskData);
    toast({
      title: "Risk Added",
      description: `The risk "${data.title}" has been added to the register.`,
    });
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add New Risk</DialogTitle>
              <DialogDescription>
                Describe the risk, its impact, and how to mitigate it. You can enter a title and use AI to suggest the rest.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Model Hallucination" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the risk in detail."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="accuracy">Accuracy</SelectItem>
                            <SelectItem value="bias">Bias</SelectItem>
                            <SelectItem value="legal">Legal / Compliance</SelectItem>
                            <SelectItem value="misuse">Misuse</SelectItem>
                            <SelectItem value="privacy">Privacy</SelectItem>
                            <SelectItem value="robustness">Robustness</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="mitigated">Mitigated</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="impact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact: {impactLikelihoodLabels[field.value]}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                          value={[field.value]}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="likelihood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Likelihood: {impactLikelihoodLabels[field.value]}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                          value={[field.value]}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
               <div>
                  <FormLabel>Calculated Risk Level</FormLabel>
                  <p className="font-bold text-lg">{riskLevel}</p>
                </div>
              <FormField
                control={form.control}
                name="mitigations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mitigations</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List mitigation strategies, one per line." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isoControls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISO Controls</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A.5.1, A.7.4" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of relevant ISO controls.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
                <div className="flex justify-between w-full">
                    <Button variant="outline" type="button" disabled={isGenerating} onClick={handleGenerateSuggestions}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                        AI Suggest
                    </Button>
                    <Button type="submit">Add Risk</Button>
                </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
