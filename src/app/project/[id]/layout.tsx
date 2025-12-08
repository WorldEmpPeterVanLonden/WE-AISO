import { ProjectLayoutClient } from "@/app/components/project-layout-client";
import { adminDb } from "@/firebase/admin";   // ✔ server-side Firestore admin
import { notFound } from "next/navigation";

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const docRef = adminDb.collection("aiso_projects").doc(params.id);
  const snap = await docRef.get();

  if (!snap.exists) {
    return notFound();
  }

  const project = snap.data();
  const projectName = project?.name || "Project";

  return (
    <ProjectLayoutClient projectId={params.id} projectName={projectName}>
      {children}
    </ProjectLayoutClient>
  );
}
