
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookCopy,
  ChevronDown,
  GitMerge,
  Home,
  LifeBuoy,
  PanelLeft,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sunset,
  Terminal,
  Telescope,
  Users,
  Bot,
  FileText,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const topNavItems = [
  { href: "/overview", icon: Home, label: "Overview" },
  { href: "/basic-info", icon: FileText, label: "Basic Info" },
];

const lifecycleNavItems = [
  { href: "/design", icon: SlidersHorizontal, label: "Design" },
  { href: "/development", icon: Terminal, label: "Development" },
  { href: "/training", icon: Bot, label: "Training" },
  { href: "/validation", icon: ShieldCheck, label: "Validation" },
  { href: "/deployment", icon: Rocket, label: "Deployment" },
  { href: "/operation", icon: Telescope, label: "Operation" },
  { href: "/retirement", icon: Sunset, label: "Retirement" },
];

const bottomNavItems = [
    { href: "/governance", icon: LifeBuoy, label: "Governance" },
    { href: "/risk-register", icon: ShieldAlert, label: "Risk Register" },
    { href: "/documents", icon: BookCopy, label: "Documents" },
];


export function ProjectNav({
  projectId,
  projectName,
  isCollapsed,
  toggleCollapse,
}: {
  projectId: string;
  projectName: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const baseHref = `/project/${projectId}`;

  const isLifecycleActive = lifecycleNavItems.some(item => pathname === `${baseHref}${item.href}`) || pathname === `${baseHref}/lifecycle`;
  
  const [isLifecycleOpen, setIsLifecycleOpen] = useState(isLifecycleActive);


  return (
    <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-[width] sm:flex",
        isCollapsed ? "w-14" : "w-60"
      )}>
       <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <div className={cn("flex h-9 w-full items-center justify-center", isCollapsed ? "" : "bg-primary text-primary-foreground rounded-full")}>
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 shrink-0 md:h-8"
            >
              <ShieldCheck className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className={cn("sr-only", !isCollapsed && "sm:not-sr-only sm:font-semibold")}>AISO Manager</span>
            </Link>
        </div>

        <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-0 translate-x-1/2 rounded-full border hidden sm:flex bg-background hover:bg-background h-8 w-8 items-center justify-center p-0"
            onClick={toggleCollapse}
        >
            <PanelLeft className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} />
            <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className={cn("w-full px-2 text-center", isCollapsed && "sr-only")}>
            <h2 className="font-bold text-md truncate">{projectName}</h2>
            <p className="text-xs text-muted-foreground">ID: {projectId}</p>
        </div>
      </nav>
      <div className="flex-1 overflow-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <TooltipProvider>
            {topNavItems.map(({ href, icon: Icon, label }) => {
              const fullHref = `${baseHref}${href}`;
              const isActive = pathname === fullHref || (href === '/overview' && pathname === baseHref);

              return (
                <Tooltip key={label} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={fullHref}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn("w-full justify-start gap-2 my-1", isCollapsed && "justify-center")}
                      >
                        <Icon className="h-4 w-4" />
                        <span className={cn(isCollapsed && "sr-only")}>{label}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            })}

            <Collapsible open={isLifecycleOpen} onOpenChange={setIsLifecycleOpen} className={cn(isCollapsed && 'pointer-events-none')}>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                         <CollapsibleTrigger asChild>
                             <Button variant={isLifecycleActive && !isCollapsed ? "secondary" : "ghost"} className={cn("w-full justify-start gap-2 my-1", isCollapsed && "justify-center")}>
                                <GitMerge className="h-4 w-4" />
                                <span className={cn(isCollapsed && "sr-only")}>Lifecycle</span>
                                <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", (isLifecycleOpen && !isCollapsed) && "rotate-180", isCollapsed && "hidden")} />
                            </Button>
                        </CollapsibleTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">Lifecycle</TooltipContent>
                </Tooltip>
                
                <CollapsibleContent className={cn("pl-4 border-l ml-3 data-[state=closed]:hidden", isCollapsed && "hidden")}>
                     {lifecycleNavItems.map(({ href, icon: Icon, label }) => {
                        const fullHref = `${baseHref}${href}`;
                        const isActive = pathname === fullHref;
                        return (
                             <Tooltip key={label} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link href={fullHref}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className="w-full justify-start gap-2 my-1"
                                        size="sm"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">{label}</TooltipContent>
                            </Tooltip>
                        )
                     })}
                </CollapsibleContent>
            </Collapsible>


            {bottomNavItems.map(({ href, icon: Icon, label }) => {
              const fullHref = `${baseHref}${href}`;
              const isActive = pathname === fullHref;
              return (
                <Tooltip key={label} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={fullHref}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn("w-full justify-start gap-2 my-1", isCollapsed && "justify-center")}
                      >
                        <Icon className="h-4 w-4" />
                        <span className={cn(isCollapsed && "sr-only")}>{label}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
      </div>
    </aside>
  );
}
