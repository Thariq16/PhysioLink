"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
          🎯 Demo Mode
        </span>
      </div>
      <p className="text-[11px] sm:text-[12px] text-amber-700 pr-6 sm:pr-0">
        You&apos;re viewing a read-only prototype with sample data. No real patient data is stored.
      </p>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-md transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
