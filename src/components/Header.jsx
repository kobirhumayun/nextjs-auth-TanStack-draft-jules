"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/auth/UserNav";

export function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">MyApp</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {isLoading ? (
              <div>Loading...</div>
            ) : session?.user ? (
              <UserNav />
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
