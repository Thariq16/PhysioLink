"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0d9488] text-white hover:bg-[#0f766e] active:scale-[0.97]",
  secondary:
    "bg-white text-[#334155] border border-[#e2e8f0] hover:bg-[#f8fafc] active:scale-[0.97]",
  ghost:
    "bg-transparent text-[#0d9488] hover:bg-[#f0fdf9] active:scale-[0.97]",
  danger:
    "bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca] active:scale-[0.97]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-[13px] rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-[14px] rounded-[10px] gap-2",
  lg: "px-7 py-3.5 text-[15px] rounded-xl gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium font-[family-name:var(--font-dm-sans,'DM_Sans',sans-serif)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
    </button>
  );
}
