
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Download, FilePlus2 } from "lucide-react";
import { format } from "date-fns";
import { GenerateDocumentDialog } from "@/app/components/generate-document-dialog";
import { useParams } from "next/navigation";
import type { z } from "zod";
import type { GenerateDocumentSchema } from "@/lib/definitions";

const mockDocuments = [
  {
    id: "doc_1",
    title: "Technical File v1.2.0",
    type: "technicalFile",
    createdAt: new Date(),
    version: "1.2.0",
    generatedBy: "system",
  },
  {
    id: "doc_2",
    title: "Risk Report - Q2 2024",
    type: "riskReport",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    version: "1.0.0",
    generatedBy: "admin",
  },
  {
    id: "doc_3",
    title: "Lifecycle Overview v1.1.0",
    type: "fullLifecycle",
    createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    version: "1.1.0",
    generatedBy: "system",
  },
];

type DocumentType = z.infer<typeof GenerateDocumentSchema>['documentType'];

export default function DocumentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('technicalFile');
  const params = useParams();
  const projectId = params.id as string;

  const handleGenerate = (type: DocumentType) => {
    setSelectedDocType(type);
    setIsDialogOpen(true);
  };

  return (
    <>
      <GenerateDocumentDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        documentType={selectedDocType}
        projectId={projectId}
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Generate and manage compliance documents for this project.
            </CardDescription>
          </div>
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button>
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Generate New Document
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Document Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleGenerate('technicalFile')}>
                      Full Technical File
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleGenerate('riskReport')}>
                      Risk Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleGenerate('fullLifecycle')}>
                      Lifecycle Overview
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell className="capitalize">
                    {doc.type.replace(/([A-Z])/g, ' $1').trim()}
                  </TableCell>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>{format(doc.createdAt, "dd MMMM yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
