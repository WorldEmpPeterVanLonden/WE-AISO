
import { ProjectLayoutClient } from "@/app/components/project-layout-client";
import { getFirebase } from "@/firebase/server";
import { doc, getDoc } from "firebase/firestore";
import { notFound, redirect } from "next/navigation";

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { auth, firestore } = await getFirebase();
  const user = auth.currentUser;

  if (!user) {
    redirect(`/login?redirect=/project/${params.id}`);
  }

  const projectRef = doc(firestore, "projects", params.id);
  const projectSnap = await getDoc(projectRef);

  if (!projectSnap.exists()) {
    notFound();
  }

  const project = projectSnap.data();

  if (project.owner !== user.uid) {
    // Or show a more specific "access denied" page
    notFound();
  }

  const projectName = project.name || "Project";

  return (
    <ProjectLayoutClient projectId={params.id} projectName={projectName}>
      {children}
    </ProjectLayoutClient>
  );
}
