
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiskDialog } from "@/app/components/risk-dialog";
import type { RiskRegisterEntry } from "@/lib/definitions";

const mockRisks: (RiskRegisterEntry & { id: string })[] = [
  {
    id: "risk_1",
    title: "Model Hallucination",
    description: "The LLM may generate factually incorrect or nonsensical information, misleading users.",
    category: "accuracy",
    likelihood: 3,
    impact: 4,
    mitigations: ["Implement fact-checking against a knowledge base.", "Add clear disclaimers about potential inaccuracies."],
    isoControls: ["A.9.2.3", "A.10.1.1"],
    status: "open",
  },
  {
    id: "risk_2",
    title: "PII Data Leakage",
    description: "The model might inadvertently expose Personally Identifiable Information from its training data.",
    category: "privacy",
    likelihood: 2,
    impact: 5,
    mitigations: ["Use data anonymization techniques.", "Fine-tune the model on a carefully curated and scrubbed dataset."],
    isoControls: ["A.7.4.1", "A.7.4.2"],
    status: "mitigated",
  },
  {
    id: "risk_3",
    title: "Adversarial Attacks",
    description: "Malicious inputs could be used to bypass safety filters or cause the model to behave unexpectedly.",
    category: "security",
    likelihood: 2,
    impact: 5,
    mitigations: ["Implement robust input validation and sanitization.", "Continuously monitor for and test against new attack vectors."],
    isoControls: ["A.5.15", "A.5.21"],
    status: "open",
  },
  {
    id: "risk_4",
    title: "Out-of-Scope Requests",
    description: "Users may attempt to use the system for purposes it was not designed for.",
    category: "misuse",
    likelihood: 4,
    impact: 3,
    mitigations: ["Implement strong prompt engineering and guardrails.", "Clearly define and communicate the system's intended use case."],
    isoControls: ["A.6.3.2"],
    status: "accepted",
  },
];

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

export default function RiskRegisterPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [risks, setRisks] = useState(mockRisks);

  const handleAddRisk = (newRisk: RiskRegisterEntry) => {
    const riskToAdd = {
      ...newRisk,
      id: `risk_${Date.now()}`
    };
    setRisks(prev => [riskToAdd, ...prev]);
  };

-  return (
-    <Card>
-      <CardHeader>
-        <CardTitle>Risk Register</CardTitle>
-        <CardDescription>Manage the project's risk register.</CardDescription>
-      </CardHeader>
-      <CardContent>
-        <p>This is the risk register page. Content to be added.</p>
-      </CardContent>
-    </Card>
-  );
+  return (
+    <>
+      <RiskDialog
+        isOpen={isDialogOpen}
+        setIsOpen={setIsDialogOpen}
+        onAddRisk={handleAddRisk}
+      />
+      <Card>
+        <CardHeader className="flex flex-row items-center justify-between">
+          <div>
+            <CardTitle>Risk Register (ISO 42001 §5)</CardTitle>
+            <CardDescription>
+              Identify, analyze, and evaluate risks associated with the AI system.
+            </CardDescription>
+          </div>
+          <Button onClick={() => setIsDialogOpen(true)}>
+            <PlusCircle className="mr-2 h-4 w-4" />
+            New Risk
+          </Button>
+        </CardHeader>
+        <CardContent>
+          <Table>
+            <TableHeader>
+              <TableRow>
+                <TableHead>Risk</TableHead>
+                <TableHead>Category</TableHead>
+                <TableHead className="text-center">Impact</TableHead>
+                <TableHead className="text-center">Likelihood</TableHead>
+                <TableHead>Risk Level</TableHead>
+                <TableHead>Status</TableHead>
+                <TableHead>
+                  <span className="sr-only">Actions</span>
+                </TableHead>
+              </TableRow>
+            </TableHeader>
+            <TableBody>
+              {risks.map((risk) => (
+                <TableRow key={risk.id}>
+                  <TableCell className="font-medium">{risk.title}</TableCell>
+                  <TableCell className="capitalize">{risk.category}</TableCell>
+                  <TableCell className="text-center">{risk.impact}</TableCell>
+                  <TableCell className="text-center">{risk.likelihood}</TableCell>
+                  <TableCell>
+                    <RiskLevelBadge level={risk.impact * risk.likelihood} />
+                  </TableCell>
+                  <TableCell>
+                    <StatusBadge status={risk.status as "open" | "mitigated" | "accepted"} />
+                  </TableCell>
+                  <TableCell>
+                    <DropdownMenu>
+                      <DropdownMenuTrigger asChild>
+                        <Button variant="ghost" size="icon">
+                          <MoreHorizontal className="h-4 w-4" />
+                        </Button>
+                      </DropdownMenuTrigger>
+                      <DropdownMenuContent>
+                        <DropdownMenuItem>Edit</DropdownMenuItem>
+                        <DropdownMenuItem>Delete</DropdownMenuItem>
+                      </DropdownMenuContent>
+                    </DropdownMenu>
+                  </TableCell>
+                </TableRow>
+              ))}
+            </TableBody>
+          </Table>
+        </CardContent>
+      </Card>
+    </>
+  );
 }
