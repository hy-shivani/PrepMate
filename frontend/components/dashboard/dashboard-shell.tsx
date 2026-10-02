"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { SidebarNav } from "@/components/dashboard/sidebar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          const name = data.user.fullName || "";

          const firstName = name.split(" ")[0];

          const avatarText =
            firstName.length <= 2
              ? firstName.toUpperCase()
              : firstName.substring(0, 2).toUpperCase();

          setInitials(avatarText);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-sidebar-border bg-sidebar">
            <div className="flex justify-end p-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <SidebarNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border glass px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </Button>

            <span className="lg:hidden">
              <Logo showText={false} />
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Avatar className="size-9 border border-border">
              <AvatarFallback className="bg-gradient-to-br from-brand-blue to-brand-indigo text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main
          className={cn(
            "mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}