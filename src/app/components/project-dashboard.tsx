

"use client";

import {
  Download,
  MoreHorizontal,
  PlusCircle,
  Eye,
  ShieldCheck,
  FileText,
  ShieldAlert,
  Database,
  Bot,
  HardDrive
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
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock Data
const mockProjects = [
  {
    id: "proj_1",
    name: "Customer Support Chatbot",
    customerName: "Global Tech Inc.",
    status: "active",
    updatedAt: new Date(),
    version: "1.2.0",
    complianceProgress: 75,
    riskCategory: "medium",
  },
  {
    id: "proj_2",
    name: "Medical Diagnosis Tool",
    customerName: "Healthcare Solutions",
    status: "draft",
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    version: "0.5.0",
    complianceProgress: 20,
    riskCategory: "high",
  },
  {
    id: "proj_3",
    name: "Financial Fraud Detection",
    customerName: "SecureBank",
    status: "archived",
    updatedAt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    version: "2.0.0",
    complianceProgress: 100,
    riskCategory: "high",
  },
  {
    id: "proj_4",
    name: "Content Recommendation Engine",
    customerName: "MediaStream Co.",
    status: "active",
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    version: "3.1.0",
    complianceProgress: 90,
    riskCategory: "low",
  },
];

type ProjectStatus = "draft" | "active" | "archived";
type RiskCategory = "low" | "medium" | "high";

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const variant: "default" | "secondary" | "destructive" =
    status === "active"
      ? "default"
      : status === "draft"
      ? "secondary"
      : "destructive";
  
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  const tooltipText = {
    active: "In use, lifecycle actively managed.",
    draft: "Not yet validated.",
    archived: "Archived, no longer operational.",
  }[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={variant}>{statusText}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const RiskBadge = ({ risk }: { risk: RiskCategory }) => {
    const variant: "secondary" | "default" | "destructive" =
        risk === 'low'
        ? 'secondary'
        : risk === 'medium'
        ? 'default'
        : 'destructive';
    
    const riskText = risk.charAt(0).toUpperCase() + risk.slice(1);
    
    return <Badge variant={variant} className="border">{riskText}</Badge>;
};

const ServiceIndicator = ({ active, tooltip, children }: { active: boolean; tooltip: string; children: React.ReactNode }) => {
    if (!active) return null;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="text-muted-foreground">{children}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};


export function ProjectDashboard() {
  const router = useRouter();
  
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
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <ServiceIndicator active={true} tooltip="Uses AI/Genkit">
                <Bot className="h-5 w-5" />
              </ServiceIndicator>
              <ServiceIndicator active={true} tooltip="Uses Firestore">
                <Database className="h-5 w-5" />
              </ServiceIndicator>
              <ServiceIndicator active={true} tooltip="Uses Cloud Storage">
                <HardDrive className="h-5 w-5" />
              </ServiceIndicator>
            </div>
            <Button asChild>
              <Link href="/project/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New AI Project
              </Link>
            </Button>
          </div>
        </div>
      </header>
       <main className="container mx-auto flex-1 p-4 md:p-8">
         <Card>
          <CardHeader>
            <CardTitle>AI Compliance Projects</CardTitle>
            <CardDescription>
              An overview of all your AI compliance projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Compliance Progress</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProjects.map((project) => (
                  <TableRow 
                    key={project.id} 
                    className="cursor-pointer"
                    onClick={() => router.push(`/project/${project.id}/overview`)}
                  >
                    <TableCell className="font-medium group-hover:underline">
                       {project.name}
                    </TableCell>
                    <TableCell>{project.customerName}</TableCell>
                    <TableCell>
                      <StatusBadge status={project.status as ProjectStatus} />
                    </TableCell>
                    <TableCell>
                        <RiskBadge risk={project.riskCategory as RiskCategory} />
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Progress value={project.complianceProgress} className="w-24" />
                            <span className="text-muted-foreground text-xs">{project.complianceProgress}%</span>
                        </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/project/${project.id}/overview`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Open Project
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                             <Link href={`/project/${project.id}/risk-register`}>
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                View Risk Register
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                             <Link href={`/project/${project.id}/design`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Lifecycle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                             <Link href={`/project/${project.id}/documents`}>
                                <Download className="mr-2 h-4 w-4" />
                                Export Documents
                            </Link>
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
