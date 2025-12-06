
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
                Describe the risk, its impact, and how to mitigate it.
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
                    <Button variant="outline" type="button" disabled={isGenerating}>
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
