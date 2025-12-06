import { NewProjectWizard } from "@/app/components/new-project-wizard";
import { ShieldCheck } from "lucide-react";
import { redirect } from 'next/navigation';
import { getFirebase } from '@/firebase/server';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import Link from "next/link";


export default async function NewProjectPage() {
    const { auth } = await getFirebase();
    const user = auth.currentUser;

    if (!user) {
        redirect('/login');
    }

    const getInitials = (name?: string | null) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <h1 className="font-headline text-2xl font-bold text-primary">
                    New AI Project
                    </h1>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            <p className="font-medium">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* The sign out functionality needs to be a client component */}
                        <DropdownMenuItem disabled>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="container mx-auto flex-1 p-4 md:p-8">
            <NewProjectWizard />
        </main>
        </div>
    );
}
