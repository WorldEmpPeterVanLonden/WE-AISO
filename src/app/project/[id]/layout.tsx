
import { ProjectLayoutClient } from "@/app/components/project-layout-client";
import { getFirebase } from "@/firebase/server";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { firestore } = await getFirebase();

  const projectRef = doc(firestore, "aiso_projects", params.id);
  const projectSnap = await getDoc(projectRef);

  if (!projectSnap.exists()) {
    notFound();
  }

  const project = projectSnap.data();

  const projectName = project.name || "Project";

  return (
    <ProjectLayoutClient projectId={params.id} projectName={projectName}>
      {children}
    </ProjectLayoutClient>
  );
}
