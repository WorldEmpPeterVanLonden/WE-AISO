
import { ProjectLayoutClient } from "@/app/components/project-layout-client";

export default function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // TODO: Fetch project details by params.id
  const projectName = "Project"; // Placeholder name

  return (
    <ProjectLayoutClient projectId={params.id} projectName={projectName}>
      {children}
    </ProjectLayoutClient>
  );
}
