
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, UserCheck, Shield, Lock, Target, AlertTriangle, Scale, BarChart2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiskDialog } from "@/app/components/risk-dialog";
import type { RiskRegisterEntry } from "@/lib/definitions";
import React from "react";

const RiskLevelBadge = ({ level }: { level: number }) => {
  let variant: "secondary" | "default" | "destructive" = "secondary";
  let text = "Low";

  if (level > 8) {
    variant = "destructive";
    text = "High";
  } else if (level > 3) {
    variant = "default";
    text = "Medium";
  }

  return <Badge variant={variant}>{text}</Badge>;
};

const StatusBadge = ({ status }: { status: "open" | "mitigated" | "accepted" }) => {
  let variant: "outline" | "default" | "secondary" = "outline";
  
  if (status === 'mitigated') {
    variant = "default";
  } else if (status === 'accepted') {
      variant = 'secondary';
  }

  return <Badge variant={variant} className="capitalize">{status}</Badge>;
};

const categoryIcons: Record<RiskRegisterEntry['category'], React.ElementType> = {
    privacy: UserCheck,
    security: Lock,
    bias: BarChart2,
    robustness: Shield,
    misuse: AlertTriangle,
    legal: Scale,
    accuracy: Target,
};

const CategoryCell = ({ category }: { category: RiskRegisterEntry['category'] }) => {
    const Icon = categoryIcons[category] || AlertTriangle;
    return (
        <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{category}</span>
        </div>
    );
};

export default function RiskRegisterPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [risks, setRisks] = useState<(RiskRegisterEntry & { id: string })[]>([]);

  const handleAddRisk = (newRisk: RiskRegisterEntry) => {
    const riskToAdd = {
      ...newRisk,
      id: `risk_${Date.now()}`
    };
    setRisks(prev => [riskToAdd, ...prev]);
  };

  return (
    <>
      <RiskDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onAddRisk={handleAddRisk}
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Risk Register (ISO 42001 §5)</CardTitle>
            <CardDescription>
              Identify, analyze, and evaluate risks associated with the AI system.
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Risk
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Impact</TableHead>
                <TableHead className="text-center">Likelihood</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No risks have been added yet.
                  </TableCell>
                </TableRow>
              ) : (
                risks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="font-medium">{risk.title}</TableCell>
                    <TableCell>
                        <CategoryCell category={risk.category} />
                    </TableCell>
                    <TableCell className="text-center">{risk.impact}</TableCell>
                    <TableCell className="text-center">{risk.likelihood}</TableCell>
                    <TableCell>
                      <RiskLevelBadge level={risk.impact * risk.likelihood} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={risk.status as "open" | "mitigated" | "accepted"} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
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
    </>
  );
}
