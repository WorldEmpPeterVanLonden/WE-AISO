
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { Loader2, MoreHorizontal, Edit } from "lucide-react";

import { useUser, useFirestore } from "@/firebase";

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ProjectHeader } from "./project-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProjectStatus = "draft" | "active" | "archived";
type RiskCategory = "low" | "medium" | "high";

interface Project {
  id: string;
  name: string;
  customerName?: string;
  status: ProjectStatus;
  riskCategory: RiskCategory;
  complianceProgress: number;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
}

export function ProjectDashboard() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { firestore } = useFirestore();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading || !firestore) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);

    const ref = query(
      collection(firestore, "aiso_projects"),
      where("owner", "==", user.uid)
    );

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const items = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          complianceProgress: 0,
        })) as Project[];

        setProjects(items);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user, userLoading, firestore, router]);

  const formatDate = (dateValue: Timestamp | Date | string | undefined | null): string => {
    if (!dateValue) return "-";
    if (typeof (dateValue as any)?.toDate === 'function') {
      return format((dateValue as Timestamp).toDate(), "dd.MM.yy");
    }
    try {
      return format(new Date(dateValue), "dd.MM.yy");
    } catch {
      return "-";
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProjectHeader title="AISO Compliance Manager" />

      <main className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Compliance Projects</CardTitle>
            <CardDescription>Your projects overview.</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No projects yet.{" "}
                      <Link href="/project/new" className="underline text-primary">
                        Create one
                      </Link>.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((p) => (
                    <TableRow
                      key={p.id}
                      
                    >
                      <TableCell>
                          <Link href={`/project/${p.id}/overview`} className="font-medium text-primary hover:underline">
                            {p.name}
                          </Link>
                      </TableCell>
                      <TableCell>{p.customerName || "-"}</TableCell>
                      <TableCell><Badge>{p.status}</Badge></TableCell>
                      <TableCell><Badge>{p.riskCategory}</Badge></TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={p.complianceProgress} className="w-24" />
                          <span>{p.complianceProgress}%</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {formatDate(p.createdAt)}
                      </TableCell>
                      <TableCell>
                        {formatDate(p.updatedAt)}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(`/project/${p.id}/edit`);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
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
