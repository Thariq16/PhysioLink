"use client";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "teal"
  | "success"
  | "warning"
  | "error"
  | "slate"
  | "coral"
  | "violet";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  teal:    "bg-[#ccfbf1] text-[#0f766e]",
  success: "bg-[#dcfce7] text-[#16a34a]",
  warning: "bg-[#fef3c7] text-[#d97706]",
  error:   "bg-[#fee2e2] text-[#dc2626]",
  slate:   "bg-[#f1f5f9] text-[#475569]",
  coral:   "bg-[#fff7ed] text-[#f97316]",
  violet:  "bg-[#ede9fe] text-[#7c3aed]",
};

export function Badge({ variant = "slate", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold leading-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
