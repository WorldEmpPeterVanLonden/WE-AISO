

import { NewProjectWizard } from "@/app/components/new-project-wizard";
import { getFirebase } from '@/firebase/server';
import { ProjectHeader } from "@/app/components/project-header";

export default async function NewProjectPage() {
    const { auth } = await getFirebase();
    const user = auth.currentUser;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <ProjectHeader title="New AI Project" user={user} />
            <main className="container mx-auto flex-1 p-4 md:p-8">
                <NewProjectWizard />
            </main>
        </div>
    );
}
