import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { DemoBanner } from "@/components/layout/DemoBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DemoBanner />

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
