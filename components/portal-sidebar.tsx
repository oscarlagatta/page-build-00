"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Monitor,
  Activity,
  ChevronRight,
  Search,
  Settings,
  Bell,
} from "lucide-react";

const navItems = [
  { label: "Application Portfolio", icon: LayoutDashboard, href: "#" },
  { label: "E2E Payment Monitor", icon: CreditCard, href: "#" },
  { label: "Camlog Monitor", icon: Monitor, href: "#", active: true },
  { label: "ServiceLens", icon: Activity, href: "#" },
  { label: "Reporting & Analytics Hub", icon: BarChart3, href: "#" },
];

export function PortalSidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-[hsl(222,47%,15%)] text-[hsl(210,40%,90%)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[hsl(222,30%,25%)] px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(217,91%,50%)]">
          <Monitor className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">
          Unified Portal
        </span>
      </div>

      {/* Search */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-2 rounded-md border border-[hsl(222,30%,25%)] bg-[hsl(222,47%,12%)] px-3 py-2">
          <Search className="h-3.5 w-3.5 text-[hsl(210,40%,60%)]" />
          <span className="text-xs text-[hsl(210,40%,55%)]">Search resources...</span>
        </div>
      </div>

      {/* Nav Label */}
      <div className="px-5 pt-4 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(210,40%,50%)]">
          Platform
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
              item.active
                ? "bg-[hsl(217,91%,50%)] font-medium text-white"
                : "text-[hsl(210,40%,75%)] hover:bg-[hsl(222,47%,20%)] hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
          </a>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[hsl(222,30%,25%)] px-3 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[hsl(210,40%,65%)] hover:bg-[hsl(222,47%,20%)] hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[hsl(210,40%,65%)] hover:bg-[hsl(222,47%,20%)] hover:text-white"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(217,91%,50%)] text-xs font-semibold text-white">
            JD
          </div>
        </div>
      </div>
    </aside>
  );
}
