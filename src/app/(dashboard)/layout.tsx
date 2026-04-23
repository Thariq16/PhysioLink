import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Demo mode banner ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
          🎯 Demo Mode
        </span>
        <p className="text-[11px] sm:text-[12px] text-amber-700">
          You&apos;re viewing a read-only prototype with sample data. No real patient data is stored.
        </p>
      </div>

      <Sidebar />
      <MobileNav />

      {/* Main container with responsive margin and padding to account for mobile top bar and banner */}
      <main className="lg:ml-[200px] min-h-screen pt-[104px] lg:pt-[56px]">
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
