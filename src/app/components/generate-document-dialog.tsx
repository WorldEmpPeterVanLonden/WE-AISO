
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2 } from "lucide-react";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { GenerateDocumentSchema } from "@/lib/definitions";
import { generateDocumentAction } from "@/lib/actions";

type GenerateDocumentFormData = z.infer<typeof GenerateDocumentSchema>;

interface GenerateDocumentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  documentType: GenerateDocumentFormData['documentType'];
  projectId: string;
}

export function GenerateDocumentDialog({ isOpen, setIsOpen, documentType, projectId }: GenerateDocumentDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateDocumentFormData>({
    resolver: zodResolver(GenerateDocumentSchema),
    defaultValues: {
      projectId: projectId,
      documentType: documentType,
      version: "1.0.0",
      format: "pdf",
    },
  });

  // When the dialog opens, reset the form with the current document type
  // This is necessary because the dialog is not re-mounted, only re-rendered
  useState(() => {
    if (isOpen) {
        form.reset({
            projectId: projectId,
            documentType: documentType,
            version: "1.0.0",
            format: "pdf",
        });
    }
  });


  async function onSubmit(data: GenerateDocumentFormData) {
    setIsGenerating(true);

    const result = await generateDocumentAction(data);
    
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: result.error,
      });
    } else {
      toast({
        title: "Generation Started",
        description: "Your document is being generated. This may take a moment.",
      });
      setIsOpen(false);
    }
    
    setIsGenerating(false);
  }

  const documentTypeLabel = {
    technicalFile: "Full Technical File",
    riskReport: "Risk Report",
    fullLifecycle: "Lifecycle Overview",
    custom: "Custom Document",
  }[documentType];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Generate: {documentTypeLabel}</DialogTitle>
              <DialogDescription>
                Set the version and format for the document you want to generate.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1.0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="word" disabled>Word (coming soon)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isGenerating}>Cancel</Button>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Generate
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
