import { ProjectNav } from "@/app/components/project-nav";

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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <ProjectNav projectId={params.id} projectName={projectName} />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:gap-8 sm:p-6 sm:ml-60">
        {children}
      </main>
    </div>
  );
}
