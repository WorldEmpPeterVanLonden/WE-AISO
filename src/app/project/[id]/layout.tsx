import { ProjectNav } from "@/app/components/project-nav";
import { Card } from "@/components/ui/card";

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
      <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid lg:grid-cols-5">
        <div className="lg:col-span-4 lg:col-start-2 lg:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
