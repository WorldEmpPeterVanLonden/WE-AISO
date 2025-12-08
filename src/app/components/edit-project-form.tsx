
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";

import { ProjectSchema } from "@/lib/definitions";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateProject } from "@/lib/actions";

type ProjectFormData = z.infer<typeof ProjectSchema>;

interface EditProjectFormProps {
  defaultValues: ProjectFormData;
  projectId: string;
}

export function EditProjectForm({ defaultValues, projectId }: EditProjectFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: defaultValues,
  });

  const { isDirty, isSubmitted } = form.formState;

  async function onSubmit(data: ProjectFormData) {
    setIsSaving(true);
    const result = await updateProject(projectId, data);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      });
    } else {
      toast({
        title: "Saved!",
        description: "The project details have been successfully updated.",
      });
      form.reset(data); 
    }

    setIsSaving(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-24">
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
        
        <div className="fixed bottom-0 left-0 sm:left-60 right-0 border-t bg-background/95 backdrop-blur-sm z-10">
            <div className="container flex items-center justify-end h-16 max-w-6xl gap-4">
                <div className="text-sm text-muted-foreground">
                    {isSaving 
                        ? "Saving..." 
                        : isDirty 
                        ? "You have unsaved changes." 
                        : isSubmitted 
                        ? "Saved!" 
                        : ""}
                </div>
                <Button type="submit" disabled={isSaving || !isDirty}>
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                </Button>
            </div>
        </div>
      </form>
    </Form>
  );
}
