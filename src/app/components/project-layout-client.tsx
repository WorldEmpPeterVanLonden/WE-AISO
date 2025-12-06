"use client";

import { useState } from "react";
import { ProjectNav } from "@/app/components/project-nav";
import { cn } from "@/lib/utils";

export function ProjectLayoutClient({
  children,
  projectId,
  projectName,
}: {
  children: React.ReactNode;
  projectId: string;
  projectName: string;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <ProjectNav
        projectId={projectId}
        projectName={projectName}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      <main
        className={cn(
          "flex flex-1 flex-col gap-4 p-4 sm:gap-8 sm:p-6 transition-[margin-left]",
          isCollapsed ? "sm:ml-14" : "sm:ml-60"
        )}
      >
        {children}
      </main>
    </div>
  );
}
