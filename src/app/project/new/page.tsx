import { NewProjectWizard } from "@/app/components/new-project-wizard";
import { ShieldCheck } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl font-bold text-primary">
              Nieuw AI Project
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-4 md:p-8">
        <NewProjectWizard />
      </main>
    </div>
  );
}
