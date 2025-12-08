

"use client";

import {
  Download,
  MoreHorizontal,
  PlusCircle,
  Eye,
  ShieldCheck,
  FileText,
  ShieldAlert,
  Bot,
  LogOut,
  Loader2,
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
import { useFirestore, useUser } from "@/firebase";
import { signOut, type Auth } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectHeader } from "./project-header";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, type Firestore, type Timestamp } from "firebase/firestore";

type ProjectStatus = "draft" | "active" | "archived";
type RiskCategory = "low" | "medium" | "high";

interface Project {
    id: string;
    name: string;
    customerName?: string;
    status: ProjectStatus;
    riskCategory: RiskCategory;
    complianceProgress: number; // This would be calculated
    createdAt: Timestamp;
    updatedAt: Timestamp;
}


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
  const riskStyles = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-orange-100 text-orange-800 border-orange-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };
    
  const riskText = risk.charAt(0).toUpperCase() + risk.slice(1);
    
  return <Badge className={`border ${riskStyles[risk]}`}>{riskText}</Badge>;
};


export function ProjectDashboard() {
  const router = useRouter();
  const { user, auth, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    
    setLoading(true);

    const projectsRef = collection(firestore as Firestore, "aiso_projects");
    const userProjectsQuery = query(projectsRef, where("owner", "==", user.uid));

    const unsubscribe = onSnapshot(userProjectsQuery, (snapshot) => {
        const userProjects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            complianceProgress: 0, // Placeholder
        } as Project));
        setProjects(userProjects);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userLoading, firestore, router]);


  if (userLoading || loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
       <ProjectHeader title="AISO Compliance Manager" />
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
                  <TableHead>Start Date</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No projects found. <Link href="/project/new" className="text-primary underline">Create a new project</Link> to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow 
                      key={project.id} 
                      className="cursor-pointer"
                      onClick={() => router.push(`/project/${project.id}/overview`)}
                    >
                      <TableCell className="font-medium group-hover:underline">
                        {project.name}
                      </TableCell>
                      <TableCell>{project.customerName || '-'}</TableCell>
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
                      <TableCell>{project.createdAt ? format(project.createdAt.toDate(), "dd.MM.yy") : '-'}</TableCell>
                      <TableCell>{project.updatedAt ? format(project.updatedAt.toDate(), "dd.MM.yy") : '-'}</TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
