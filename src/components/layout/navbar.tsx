"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { RoleBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth.actions";
import type { Role } from "@/types/enums";

interface NavbarProps {
  firstName: string;
  lastName: string;
  role: Role;
}

export function Navbar({ firstName, lastName, role }: NavbarProps) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      logoutAction();
    });
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left — page context provided by children/page title via CSS */}
      <div />

      {/* Right — user info + logout */}
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-slate-900">
            {firstName} {lastName}
          </p>
          <div className="flex justify-end mt-0.5">
            <RoleBadge role={role} />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          isLoading={isPending}
          className="gap-1.5"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </Button>
      </div>
    </header>
  );
}
