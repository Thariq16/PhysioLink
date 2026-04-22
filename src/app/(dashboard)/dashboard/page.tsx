"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  CalendarDays,
  TrendingUp,
  UserPlus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

// ── Mock data (replace with Firestore hooks) ──
const stats = [
  {
    label: "Active Patients",
    value: "24",
    delta: "+3 this month",
    deltaPositive: true,
    icon: Users,
    iconBg: "bg-[#ccfbf1]",
    iconColor: "text-[#0f766e]",
    href: "/patients",
  },
  {
    label: "Today's Appointments",
    value: "6",
    delta: "Next at 10:00 AM",
    deltaPositive: true,
    icon: CalendarDays,
    iconBg: "bg-[#dbeafe]",
    iconColor: "text-[#2563eb]",
    href: "/appointments",
  },
  {
    label: "Avg. Exercise Adherence",
    value: "73%",
    delta: "+5% vs last week",
    deltaPositive: true,
    icon: TrendingUp,
    iconBg: "bg-[#dcfce7]",
    iconColor: "text-[#16a34a]",
    href: "/exercises",
  },
];

const todayAppointments = [
  { id: "p1", patientName: "Ravi Jayasuriya",   initials: "RJ", time: "10:00 AM", adherence: 86, status: "confirmed" },
  { id: "p2", patientName: "Amara Perera",      initials: "AP", time: "11:30 AM", adherence: 52, status: "pending"   },
  { id: "p3", patientName: "Dinesh Silva",      initials: "DS", time: "2:00 PM",  adherence: 24, status: "scheduled" },
  { id: "p4", patientName: "Priya Rathnayake",  initials: "PR", time: "3:30 PM",  adherence: 91, status: "confirmed" },
  { id: "p5", patientName: "Kasun Bandara",     initials: "KB", time: "5:00 PM",  adherence: 68, status: "scheduled" },
];

function adherenceColor(val: number) {
  if (val >= 75) return "text-[#16a34a]";
  if (val >= 50) return "text-[#d97706]";
  return "text-[#dc2626]";
}

function statusBadge(status: string) {
  if (status === "confirmed") return <Badge variant="success">&#10003; Confirmed</Badge>;
  if (status === "pending")   return <Badge variant="warning">&#9203; Pending</Badge>;
  return <Badge variant="teal">&#128197; Scheduled</Badge>;
}

export default function DashboardPage() {
  const router = useRouter();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-[28px] font-bold text-[#1e293b] leading-tight"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
          >
            {greeting}, Dr. Theebaluxmy
          </h1>
          <p className="text-[14px] text-[#64748b] mt-0.5">
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Button
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => toast.info("Demo mode — invite flow launches after beta!")}
        >
          Invite patient
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 gap-4 stagger">
        {stats.map(({ label, value, delta, deltaPositive, icon: Icon, iconBg, iconColor, href }) => (
          <div
            key={label}
            onClick={() => router.push(href)}
            className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 hover:border-[#0d9488] transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#94a3b8]" />
            </div>
            <div
              className="text-[28px] font-bold text-[#1e293b] leading-none mb-1"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
            >
              {value}
            </div>
            <div className="text-[12px] text-[#94a3b8] mb-1">{label}</div>
            <div className={`text-[12px] font-semibold ${deltaPositive ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
              {delta}
            </div>
          </div>
        ))}
      </div>

      {/* ── Today's Appointments ── */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h2
            className="text-[16px] font-bold text-[#1e293b]"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
          >
            Today&apos;s Appointments
          </h2>
          <Button variant="ghost" size="sm" onClick={() => router.push("/appointments")}>
            View all
          </Button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_100px_100px_120px_40px] gap-4 px-6 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0]">
          {["Patient", "Time", "Adherence", "Status", ""].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#f1f5f9]">
          {todayAppointments.map((appt) => (
            <div
              key={appt.id}
              onClick={() => router.push(`/patients/${appt.id}`)}
              className="grid grid-cols-[1fr_100px_100px_120px_40px] gap-4 px-6 py-3.5 items-center hover:bg-[#f8fafc] transition-colors duration-100 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                  {appt.initials}
                </div>
                <span className="text-[13.5px] font-semibold text-[#1e293b] group-hover:text-[#0d9488] transition-colors">
                  {appt.patientName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#64748b]">
                <Clock className="w-3.5 h-3.5" />
                {appt.time}
              </div>
              <div>
                <span className={`text-[13px] font-bold ${adherenceColor(appt.adherence)}`}>
                  {appt.adherence}%
                </span>
              </div>
              <div>{statusBadge(appt.status)}</div>
              <div className="flex justify-end">
                <ArrowUpRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#0d9488] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Stats Bottom Row ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#ede9fe] flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-[#7c3aed]" />
          </div>
          <div>
            <div className="text-[22px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>3</div>
            <div className="text-[12px] text-[#94a3b8]">Unread messages</div>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/messages")}>
            View
          </Button>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
          </div>
          <div>
            <div className="text-[22px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>LKR 42,500</div>
            <div className="text-[12px] text-[#94a3b8]">Revenue this month</div>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => router.push("/payments")}>
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}
