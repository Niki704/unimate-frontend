"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Clock,
  Users,
  GraduationCap,
  BookOpen,
  Megaphone,
  MessageSquare,
  Briefcase,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { Role } from "@/types/enums";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const navByRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
      label: "Pending Approvals",
      href: "/admin/pending-approvals",
      icon: Clock,
    },
    { label: "Students", href: "/admin/students", icon: GraduationCap },
    { label: "Lecturers", href: "/admin/lecturers", icon: Users },
    { label: "Batches", href: "/admin/batches", icon: BookOpen },
  ],
  LECTURER: [
    { label: "Dashboard", href: "/lecturer/dashboard", icon: LayoutDashboard },
    { label: "My Batches", href: "/lecturer/batches", icon: BookOpen },
    {
      label: "Feedback",
      icon: MessageSquare,
      children: [
        { label: "Student Feedback", href: "/lecturer/feedback/student" },
        { label: "Batch Feedback", href: "/lecturer/feedback/batch" },
      ],
    },
    {
      label: "Announcements",
      href: "/lecturer/announcements",
      icon: Megaphone,
    },
  ],
  STUDENT: [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Portfolio", href: "/student/portfolio", icon: Briefcase },
    { label: "Profile", href: "/student/profile", icon: User },
    { label: "Announcements", href: "/student/announcements", icon: Megaphone },
  ],
};

interface SidebarProps {
  role: Role;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const items = navByRole[role];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-bold">
          U
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">UniMate</p>
          <p className="text-xs text-slate-500">{userName}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {items.map((item) =>
          item.children ? (
            <CollapsibleNavItem
              key={item.label}
              item={item}
              pathname={pathname}
            />
          ) : (
            <NavLink key={item.label} item={item} pathname={pathname} />
          ),
        )}
      </nav>
    </aside>
  );
}

function NavLink({
  item,
  pathname,
}: {
  item: NavItem & { href: string };
  pathname: string;
}) {
  const active = pathname.startsWith(item.href);
  return (
    <Link
      href={item.href}
      className={clsx(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-slate-100 font-medium text-slate-900"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <item.icon
        className={clsx(
          "h-4 w-4 shrink-0",
          active ? "text-slate-700" : "text-slate-400",
        )}
      />
      {item.label}
    </Link>
  );
}

function CollapsibleNavItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const anyChildActive = item.children?.some((c) =>
    pathname.startsWith(c.href),
  );
  const [open, setOpen] = useState(anyChildActive ?? false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          anyChildActive
            ? "bg-slate-100 font-medium text-slate-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        )}
      >
        <item.icon
          className={clsx(
            "h-4 w-4 shrink-0",
            anyChildActive ? "text-slate-700" : "text-slate-400",
          )}
        />
        <span className="flex-1 text-left">{item.label}</span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        )}
      </button>
      {open && item.children && (
        <div className="ml-7 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
          {item.children.map((child) => {
            const active = pathname.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={clsx(
                  "block rounded-md py-1.5 px-2 text-sm transition-colors",
                  active
                    ? "font-medium text-slate-900"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
