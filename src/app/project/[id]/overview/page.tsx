import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FileDown, Clock, CheckCircle2, ShieldCheck, GitMerge } from "lucide-react";
import { format, subDays } from "date-fns";

const mockProjectDetails = {
    name: "Customer Support Chatbot",
    description: "An AI-powered chatbot to assist users with common queries and escalate complex issues to human agents.",
    status: "active",
    lastReview: subDays(new Date(), 15),
    lifecycleCompletion: 45, // percentage
    riskCategory: "medium"
};

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-3xl font-bold font-headline">{mockProjectDetails.name}</CardTitle>
                <CardDescription className="mt-2">{mockProjectDetails.description}</CardDescription>
            </div>
             <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Generate Technical File (PDF)
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <div>
                    <span className="text-muted-foreground">Status</span>
                    <div className="font-semibold"><StatusBadge status={mockProjectDetails.status as ProjectStatus} /></div>
                </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                    <span className="text-muted-foreground">Last Review</span>
                    <p className="font-semibold">{format(mockProjectDetails.lastReview, "dd MMMM yyyy")}</p>
                </div>
            </div>
             <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <div>
                    <span className="text-muted-foreground">Risk</span>
                    <div className="font-semibold"><RiskBadge risk={mockProjectDetails.riskCategory as RiskCategory} /></div>
                </div>
            </div>
        </div>

        <Separator />
        
        <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <GitMerge className="h-5 w-5 text-primary" />
                Lifecycle Progress
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Total completion</p>
                    <p className="font-bold text-primary">{mockProjectDetails.lifecycleCompletion}%</p>
                </div>
                <Progress value={mockProjectDetails.lifecycleCompletion} />
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
