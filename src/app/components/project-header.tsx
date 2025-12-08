"use client";

import {
  LogOut,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useUser } from "@/firebase/auth/useUser";
import { auth } from "@/firebase/firebase"; // ✔ vaste auth instance
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";

import { FirestoreStatusIndicator } from "./firestore-status-indicator";
import { AiStatusIndicator } from "./ai-status-indicator";

import type { User } from "firebase/auth";

export function ProjectHeader({
  title,
  user: initialUser,
  showProjectName = true,
}: {
  title: string;
  user?: User | null;
  showProjectName?: boolean;
}) {
  const router = useRouter();
  const { user } = useUser();

  const currentUser = initialUser !== undefined ? initialUser : user;

  const handleSignOut = async () => {
    try {
      await signOut(auth); // ✔ geen provider meer nodig
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm",
        showProjectName && "sm:pl-60"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LEFT: TITLE */}
        <div className="flex items-center gap-3">
          {!showProjectName && (
            <ShieldCheck className="h-8 w-8 text-primary" />
          )}
          <h1 className="font-headline text-2xl font-bold text-primary">
            {title}
          </h1>
        </div>

        {/* RIGHT: STATUS + NEW + USER MENU */}
        <div className="flex items-center gap-4">
          <AiStatusIndicator />
          <FirestoreStatusIndicator />

          <Button asChild>
            <Link href="/project/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New AI Project
            </Link>
          </Button>

          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={currentUser.photoURL || ""}
                      alt={currentUser.displayName || "User"}
                    />
                    <AvatarFallback>
                      {getInitials(currentUser.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-medium">
                    {currentUser.displayName || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser.email}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
