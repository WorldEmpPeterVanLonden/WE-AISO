

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FileDown, Clock, CheckCircle2, ShieldCheck, GitMerge, Calendar, Edit, Minus, Bot } from "lucide-react";
import { format, subDays } from "date-fns";

const mockProjectDetails = {
    name: "Customer Support Chatbot",
    description: "An AI-powered chatbot to assist users with common queries and escalate complex issues to human agents.",
    status: "active",
    startDate: subDays(new Date(), 90),
    lastChange: subDays(new Date(), 2),
    lastReview: subDays(new Date(), 15),
    lifecycleCompletion: 45, // percentage
    riskCategory: "medium",
    systemType: "LLM",
    useCase: "Customer Support Automation"
};

const lifecycleStages = [
    { name: "Design", completed: true },
    { name: "Development", completed: true },
    { name: "Training", completed: true },
    { name: "Validation", completed: false },
    { name: "Deployment", completed: false },
    { name: "Operation", completed: false },
    { name: "Retirement", completed: false },
];
const completedStages = lifecycleStages.filter(s => s.completed).length;
const totalStages = lifecycleStages.length;
const completionPercentage = Math.round((completedStages / totalStages) * 100);


type ProjectStatus = "draft" | "active" | "archived" | "complete";
type RiskCategory = "low" | "medium" | "high";

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

const RiskBadge = ({ risk }: { risk: RiskCategory }) => {
    const variant: "secondary" | "default" | "destructive" =
        risk === 'low'
        ? 'secondary'
        : risk === 'medium'
        ? 'default'
        : 'destructive';
    
    const riskText = risk.charAt(0).toUpperCase() + risk.slice(1);
    
    return <Badge variant={variant} className="border">{riskText} Risk</Badge>;
};


export default function OverviewPage() {
  return (
    <div className="space-y-4">
        <div className="flex justify-end">
            <Button>
                <FileDown className="mr-2 h-4 w-4" />
                Generate Technical File (PDF)
            </Button>
        </div>
        <Card className="w-full">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-3xl font-bold font-headline">{mockProjectDetails.name}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground mt-2">
                        <div className="flex items-center gap-2">
                           <Bot className="h-4 w-4" />
                           <span className="text-sm font-medium">{mockProjectDetails.systemType}-based System</span>
                        </div>
                         <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-medium">Use Case: {mockProjectDetails.useCase}</span>
                        </div>
                    </div>
                    <CardDescription className="mt-4">{mockProjectDetails.description}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex flex-col justify-center gap-3 p-4 bg-muted/50 rounded-lg h-full">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <div>
                            <div className="text-muted-foreground">Status</div>
                            <div className="font-semibold"><StatusBadge status={mockProjectDetails.status as ProjectStatus} /></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-3 p-4 bg-muted/50 rounded-lg h-full">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-primary" />
                        <div>
                            <div className="text-muted-foreground">Start Date</div>
                            <div className="font-semibold">{format(mockProjectDetails.startDate, "dd.MM.yy")}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-3 p-4 bg-muted/50 rounded-lg h-full">
                    <div className="flex items-center gap-3">
                        <Edit className="h-6 w-6 text-primary" />
                        <div>
                            <div className="text-muted-foreground">Last Change</div>
                            <div className="font-semibold">{format(mockProjectDetails.lastChange, "dd.MM.yy")}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-3 p-4 bg-muted/50 rounded-lg h-full">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <div>
                            <div className="text-muted-foreground">Risk</div>
                            <div className="font-semibold"><RiskBadge risk={mockProjectDetails.riskCategory as RiskCategory} /></div>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />
            
            <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                    <GitMerge className="h-5 w-5 text-primary" />
                    Lifecycle Progress
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Total completion ({completedStages} of {totalStages} phases)</p>
                        <p className="font-bold text-primary">{completionPercentage}%</p>
                    </div>
                    <Progress value={completionPercentage} />
                    <div className="grid grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        {lifecycleStages.map(stage => (
                            <div key={stage.name} className="flex items-center gap-1.5">
                                {stage.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Minus className="h-4 w-4 text-border" />
                                )}
                                <span className={stage.completed ? 'font-semibold text-foreground' : ''}>{stage.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </CardContent>
        </Card>
    </div>
  );
}
