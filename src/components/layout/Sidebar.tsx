"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Dumbbell,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
  { label: "Patients",     href: "/patients",     icon: Users },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
  { label: "Exercises",    href: "/exercises",    icon: Dumbbell },
  { label: "Messages",     href: "/messages",     icon: MessageSquare },
  { label: "Payments",     href: "/payments",     icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col w-[200px] border-r border-[#e2e8f0] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#e2e8f0]">
        <div className="w-8 h-8 rounded-[8px] bg-[#0d9488] flex items-center justify-center flex-shrink-0">
          <span
            className="text-white text-[13px] font-bold"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
          >
            PL
          </span>
        </div>
        <span
          className="text-[15px] font-bold text-[#1e293b]"
          style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
        >
          PhysioLink
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 text-[13px] transition-all duration-150 hover:bg-[#f0fdf9] hover:text-[#0f766e]",
                active
                  ? "bg-[#f0fdf9] text-[#0f766e] font-semibold border-r-2 border-[#0d9488]"
                  : "text-[#64748b]"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#e2e8f0] py-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-4 py-2 text-[13px] transition-all duration-150 hover:bg-[#f0fdf9] hover:text-[#0f766e]",
            pathname.startsWith("/settings")
              ? "bg-[#f0fdf9] text-[#0f766e] font-semibold border-r-2 border-[#0d9488]"
              : "text-[#64748b]"
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </Link>
        <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#64748b] hover:bg-[#fee2e2] hover:text-[#dc2626] transition-all duration-150 cursor-pointer">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
