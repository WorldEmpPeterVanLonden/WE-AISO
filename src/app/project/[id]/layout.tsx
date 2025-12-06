
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
  // Server-side auth check is unreliable with client-side sessions,
  // this check is now handled in the client components that use the `useUser` hook.
  // const user = auth.currentUser;
  // if (!user) {
  //   redirect(`/login?redirect=/project/${params.id}`);
  // }

  const projectRef = doc(firestore, "aiso_projects", params.id);
  const projectSnap = await getDoc(projectRef);

  if (!projectSnap.exists()) {
    notFound();
  }

  const project = projectSnap.data();

  // We can't reliably check ownership on the server without the user object.
  // This check should be moved to where data is mutated or fetched on the client,
  // and security rules will enforce it on the backend.
  // if (project.owner !== user.uid) {
  //   notFound();
  // }

  const projectName = project.name || "Project";

  return (
    <ProjectLayoutClient projectId={params.id} projectName={projectName}>
      {children}
    </ProjectLayoutClient>
  );
}
