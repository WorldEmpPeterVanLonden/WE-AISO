

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FileDown, Clock, CheckCircle2, ShieldCheck, GitMerge, Calendar, Edit, Minus, Bot, ShieldAlert, FileQuestion } from "lucide-react";
import { format, subDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const mockProjectDetails = {
    name: "Customer Support Chatbot",
    description: "An AI-powered chatbot to assist users with common queries and escalate complex issues to human agents.",
    status: "active",
    startDate: subDays(new Date(), 90),
    lastChange: subDays(new Date(), 2),
    lastReview: subDays(new Date(), 15),
    riskCategory: "medium",
    systemType: "LLM",
    useCase: "Customer Support Automation",
    auditReadiness: {
        lifecycleScore: 3/7, // 3 of 7 phases completed
        riskScore: 3/4,      // 3 of 4 criteria met
        governanceScore: 4/5, // 4 of 5 criteria met
        total: ( (3/7 * 0.5) + (3/4 * 0.3) + (4/5 * 0.2) ),
        lastCalculated: subDays(new Date(), 1),
    }
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
const lifecycleCompletionPercentage = Math.round((completedStages / totalStages) * 100);

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
    const riskStyles = {
        low: "bg-green-100 text-green-800 border-green-200",
        medium: "bg-orange-100 text-orange-800 border-orange-200",
        high: "bg-red-100 text-red-800 border-red-200",
    };
    
    const riskText = risk.charAt(0).toUpperCase() + risk.slice(1);
    
    return <Badge className={`border ${riskStyles[risk]}`}>{riskText} Risk</Badge>;
};

const AuditReadinessBadge = ({ score }: { score: number }) => {
    const percentage = Math.round(score * 100);
    let colorClass = "bg-red-100 text-red-800 border-red-200";
    if (percentage >= 80) {
        colorClass = "bg-green-100 text-green-800 border-green-200";
    } else if (percentage >= 50) {
        colorClass = "bg-orange-100 text-orange-800 border-orange-200";
    }
    return <Badge className={`border ${colorClass}`}>{percentage}%</Badge>;
}

export default function OverviewPage() {
    const auditReadiness = mockProjectDetails.auditReadiness;

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
                        <CardDescription className="mt-4 leading-relaxed max-w-4xl">{mockProjectDetails.description}</CardDescription>
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
                            <Clock className="h-6 w-6 text-primary" />
                            <div>
                                <div className="text-muted-foreground">Last Change</div>
                                <div className="font-semibold">{format(mockProjectDetails.lastChange, "dd.MM.yy")}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-3 p-4 bg-muted/50 rounded-lg h-full">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="h-6 w-6 text-primary" />
                            <div>
                                <div className="text-muted-foreground">Risk</div>
                                <div className="font-semibold"><RiskBadge risk={mockProjectDetails.riskCategory as RiskCategory} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="opacity-20" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                            <GitMerge className="h-5 w-5 text-primary" />
                            Lifecycle Progress
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Progress value={lifecycleCompletionPercentage} className="flex-1" />
                                <span className="font-bold text-primary text-sm">{lifecycleCompletionPercentage}%</span>
                            </div>
                            <p className="text-sm text-muted-foreground -mt-2">Total completion ({completedStages} of {totalStages} phases)</p>
                            
                            <div className="grid grid-cols-4 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs text-muted-foreground">
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
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                             <FileQuestion className="h-5 w-5 text-primary" />
                            Audit Readiness
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-muted-foreground">Total Score:</div>
                                <AuditReadinessBadge score={auditReadiness.total} />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Details</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 text-sm">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Score Breakdown</h4>
                                                <p className="text-xs text-muted-foreground">
                                                Weighted average of all pillars.
                                                </p>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <span>Lifecycle</span>
                                                    <Progress value={auditReadiness.lifecycleScore * 100} className="col-span-2 h-2" />
                                                </div>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <span>Risk Register</span>
                                                    <Progress value={auditReadiness.riskScore * 100} className="col-span-2 h-2" />
                                                </div>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <span>Governance</span>
                                                    <Progress value={auditReadiness.governanceScore * 100} className="col-span-2 h-2" />
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Last calculated: {format(auditReadiness.lastCalculated, "dd.MM.yy HH:mm")}</p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                             <div className="text-xs text-muted-foreground space-y-1 pl-4 border-l-2">
                                <p>Lifecycle: <span className="font-semibold">{Math.round(auditReadiness.lifecycleScore * 100)}%</span> (Weight: 50%)</p>
                                <p>Risk Register: <span className="font-semibold">{Math.round(auditReadiness.riskScore * 100)}%</span> (Weight: 30%)</p>
                                <p>Governance: <span className="font-semibold">{Math.round(auditReadiness.governanceScore * 100)}%</span> (Weight: 20%)</p>
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
            </Card>
        </div>
    );
}

    