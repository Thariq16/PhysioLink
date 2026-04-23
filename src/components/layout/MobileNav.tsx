"use client";

import { useState } from "react";
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
  Menu,
  X,
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

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#e2e8f0] h-16 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
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
        </Link>
        <button
          onClick={toggleNav}
          className="p-2 -mr-2 text-[#64748b] hover:text-[#0f766e] transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={toggleNav}
        />
      )}

      {/* ── Drawer ── */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 right-0 z-40 w-[240px] bg-white border-l border-[#e2e8f0] transform transition-transform duration-300 ease-in-out flex flex-col pt-16",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={toggleNav}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all duration-150",
                    active
                      ? "bg-[#f0fdf9] text-[#0f766e] font-semibold"
                      : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-[#e2e8f0]">
          <Link
            href="/settings"
            onClick={toggleNav}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg text-[14px] transition-all duration-150",
              pathname.startsWith("/settings")
                ? "bg-[#f0fdf9] text-[#0f766e] font-semibold"
                : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-[#64748b] hover:bg-[#fee2e2] hover:text-[#dc2626] transition-all duration-150">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
