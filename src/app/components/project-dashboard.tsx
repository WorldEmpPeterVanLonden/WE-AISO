"use client";

import {
  Download,
  MoreHorizontal,
  PlusCircle,
  Eye,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

// Mock Data
const mockProjects = [
  {
    id: "proj_1",
    name: "Customer Support Chatbot",
    status: "active",
    updatedAt: new Date(),
    version: "1.2.0",
  },
  {
    id: "proj_2",
    name: "Medical Diagnosis Tool",
    status: "draft",
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    version: "0.5.0",
  },
  {
    id: "proj_3",
    name: "Financial Fraud Detection",
    status: "archived",
    updatedAt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    version: "2.0.0",
  },
  {
    id: "proj_4",
    name: "Content Recommendation Engine",
    status: "active",
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    version: "3.1.0",
  },
];

type ProjectStatus = "draft" | "active" | "archived";

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const variant: "default" | "secondary" | "destructive" =
    status === "active"
      ? "default"
      : status === "draft"
      ? "secondary"
      : "destructive";
  
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  return <Badge variant={variant}>{statusText}</Badge>;
};

export function ProjectDashboard() {
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
          <Button asChild>
            <Link href="/project/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nieuw AI Project
            </Link>
          </Button>
        </div>
      </header>
       <main className="container mx-auto flex-1 p-4 md:p-8">
         <Card>
          <CardHeader>
            <CardTitle>Projecten</CardTitle>
            <CardDescription>
              Een overzicht van al uw AI-compliance projecten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projectnaam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Versie</TableHead>
                  <TableHead>Laatst bijgewerkt</TableHead>
                  <TableHead>
                    <span className="sr-only">Acties</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                       <Link href={`/project/${project.id}`} className="hover:underline">{project.name}</Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status as ProjectStatus} />
                    </TableCell>
                    <TableCell>{project.version}</TableCell>
                    <TableCell>
                      {format(project.updatedAt, "dd MMMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acties</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/project/${project.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Open Project
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Bekijk Lifecycle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Exporteer Documenten
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
