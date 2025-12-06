"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  FileText,
  GitMerge,
  Home,
  LifeBuoy,
  ListTodo,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Sunset,
  Terminal,
  Telescope,
  Users,
  Wrench,
  BookCopy,
  ChevronDown
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const topNavItems = [
  { href: "/overview", icon: Home, label: "Overview" },
  { href: "/basic-info", icon: Users, label: "Basic Info" },
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
}: {
  projectId: string;
  projectName: string;
}) {
  const pathname = usePathname();
  const baseHref = `/project/${projectId}`;

  const isLifecycleActive = lifecycleNavItems.some(item => pathname === `${baseHref}${item.href}`) || pathname === `${baseHref}/lifecycle`;
  
  const [isLifecycleOpen, setIsLifecycleOpen] = useState(isLifecycleActive);


  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
        >
          <ShieldCheck className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">AISO Manager</span>
        </Link>
        <div className="w-full px-2 text-center">
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
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Link href={fullHref}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2 my-1"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            })}

            <Collapsible open={isLifecycleOpen} onOpenChange={setIsLifecycleOpen}>
                <CollapsibleTrigger asChild>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant={isLifecycleActive ? "secondary" : "ghost"} className="w-full justify-start gap-2 my-1">
                                <GitMerge className="h-4 w-4" />
                                Lifecycle
                                <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", isLifecycleOpen && "rotate-180")} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Lifecycle</TooltipContent>
                    </Tooltip>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 border-l ml-3">
                     {lifecycleNavItems.map(({ href, icon: Icon, label }) => {
                        const fullHref = `${baseHref}${href}`;
                        const isActive = pathname === fullHref;
                        return (
                             <Tooltip key={label}>
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
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Link href={fullHref}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2 my-1"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
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
