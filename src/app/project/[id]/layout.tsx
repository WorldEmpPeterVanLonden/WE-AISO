
import { ProjectLayoutClient } from "@/app/components/project-layout-client";

export default function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // TODO: Fetch project details by params.id
  const projectName = "Customer Support Chatbot"; // Mock data

  return (
    <ProjectLayoutClient projectId={params.id} projectName={projectName}>
      {children}
    </ProjectLayoutClient>
  );
}
