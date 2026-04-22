import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Demo mode banner ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 py-2 px-4 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider">
          🎯 Demo Mode
        </span>
        <p className="text-[12px] text-amber-700">
          You&apos;re viewing a read-only prototype with sample data. No real patient data is stored.
        </p>
      </div>
      <Sidebar />
      <main className="ml-[200px] min-h-screen pt-10">
        <div className="max-w-[1200px] mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
