

import { NewProjectWizard } from "@/app/components/new-project-wizard";
import { ProjectHeader } from "@/app/components/project-header";

export default async function NewProjectPage() {
    // The user object is handled client-side by the useUser hook within the wizard/header.
    // We don't need to (and can't reliably) get it on the server here.
    return (
        <div className="min-h-screen bg-background text-foreground">
            <ProjectHeader title="New AI Project" />
            <main className="container mx-auto flex-1 p-4 md:p-8">
                <NewProjectWizard />
            </main>
        </div>
    );
}
