"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CalendarDays,
  Dumbbell,
  CreditCard,
  LayoutDashboard,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Metadata removed — client component

// ── Mock patient data ──
const patient = {
  id: "p1",
  name: "Ravi Jayasuriya",
  initials: "RJ",
  dob: "14 Mar 1990 (36 yrs)",
  phone: "+94 77 234 5678",
  email: "ravi.j@gmail.com",
  injurySummary: "Grade 3 ACL tear on right knee following football match injury. Post-surgical recovery commenced 6 weeks ago. Good range of motion improving steadily.",
  treatmentNotes: "Patient is responding well. Increase quad strength exercises from week 8. Pain level reported at 2/10 during last session.",
  adherence: 86,
  joinedDate: "15 Mar 2026",
  activePlan: "Knee Rehab Phase 2",
};

const appointments = [
  { date: "16 Apr 2026", time: "10:00 AM", duration: 45, status: "scheduled", paid: true,  amount: "LKR 3,500" },
  { date: "9 Apr 2026",  time: "10:00 AM", duration: 45, status: "completed", paid: true,  amount: "LKR 3,500" },
  { date: "2 Apr 2026",  time: "10:00 AM", duration: 45, status: "completed", paid: true,  amount: "LKR 3,500" },
  { date: "26 Mar 2026", time: "10:00 AM", duration: 45, status: "completed", paid: false, amount: "LKR 3,500" },
];

const exercises = [
  { name: "Quad stretch",    sets: 3, reps: 12, freq: "Daily",     done: true },
  { name: "Hip bridge",      sets: 3, reps: 10, freq: "Daily",     done: true },
  { name: "Calf raises",     sets: 2, reps: 15, freq: "Daily",     done: false },
  { name: "Leg press",       sets: 3, reps: 8,  freq: "3x / week", done: false },
  { name: "Side step band",  sets: 2, reps: 20, freq: "3x / week", done: true },
];

type TabId = "overview" | "appointments" | "exercises" | "messages" | "payments";

const TAB_DEFS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview",      label: "Overview",      icon: LayoutDashboard },
  { id: "appointments", label: "Appointments",  icon: CalendarDays    },
  { id: "exercises",    label: "Exercises",     icon: Dumbbell        },
  { id: "messages",     label: "Messages",      icon: MessageSquare   },
  { id: "payments",     label: "Payments",      icon: CreditCard      },
];

export function PatientDetailClient() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const doneToday = exercises.filter((e) => e.done).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-[13px] text-[#94a3b8]">
        <Link href="/dashboard" className="hover:text-[#0d9488] transition-colors flex items-center gap-1">
          <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <span>/</span>
        <Link href="/patients" className="hover:text-[#0d9488] transition-colors">
          Patients
        </Link>
        <span>/</span>
        <span className="text-[#1e293b] font-medium">{patient.name}</span>
      </div>

      {/* ── Patient Header Card ── */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center text-[22px] font-bold flex-shrink-0"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              {patient.initials}
            </div>
            <div>
              <h1
                className="text-[24px] font-bold text-[#1e293b] leading-tight"
                style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
              >
                {patient.name}
              </h1>
              <p className="text-[13px] text-[#64748b] mt-0.5">DOB: {patient.dob}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[12px] text-[#64748b]">
                  <Phone className="w-3.5 h-3.5" /> {patient.phone}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-[#64748b]">
                  <Mail className="w-3.5 h-3.5" /> {patient.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
              onClick={() => toast.success(`Opening chat with ${patient.name}…`)}
            >
              Message
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Calendar className="w-3.5 h-3.5" />}
              onClick={() => toast.info("Opening appointment scheduler…")}
            >
              Book appointment
            </Button>
            <Button size="sm" onClick={() => toast.info("Edit record form opens here in production")}>
              Edit record
            </Button>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-[#f1f5f9]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">Adherence</div>
            <div className="text-[22px] font-bold text-[#16a34a]"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              {patient.adherence}%
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">Active Plan</div>
            <div className="text-[14px] font-semibold text-[#1e293b]">{patient.activePlan}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">Today&apos;s Progress</div>
            <div className="text-[14px] font-semibold text-[#1e293b]">{doneToday}/{exercises.length} exercises</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">Joined</div>
            <div className="text-[14px] font-semibold text-[#1e293b]">{patient.joinedDate}</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        <div className="flex border-b border-[#e2e8f0] px-2 overflow-x-auto">
          {TAB_DEFS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-all cursor-pointer",
                activeTab === id
                  ? "border-[#0d9488] text-[#0d9488]"
                  : "border-transparent text-[#64748b] hover:text-[#1e293b]"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
        <div className="p-6 grid grid-cols-2 gap-6">
          {/* Injury summary */}
          <div>
            <h3
              className="text-[14px] font-bold text-[#1e293b] mb-2 uppercase tracking-wider text-[11px] text-[#94a3b8]"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
            >
              INJURY SUMMARY
            </h3>
            <p className="text-[13.5px] text-[#64748b] leading-relaxed">
              {patient.injurySummary}
            </p>
          </div>

          {/* Treatment notes */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
              TREATMENT NOTES
            </h3>
            <p className="text-[13.5px] text-[#64748b] leading-relaxed">
              {patient.treatmentNotes}
            </p>
          </div>

          {/* Upcoming appointment */}
          <div className="bg-[#f0fdf9] border border-[#99f6e4] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-4 h-4 text-[#0d9488]" />
              <span className="text-[12px] font-bold text-[#0f766e] uppercase tracking-wider">
                Next Appointment
              </span>
            </div>
            <div className="text-[16px] font-bold text-[#1e293b]"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              Wednesday, 16 April 2026
            </div>
            <div className="text-[13px] text-[#64748b] mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 10:00 AM · 45 minutes
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="primary" size="sm" onClick={() => toast.info("Reschedule dialog opens here")}>Reschedule</Button>
              <Button variant="danger" size="sm" onClick={() => toast.error("Appointment cancellation requires confirmation in production")}>
                Cancel
              </Button>
            </div>
          </div>

          {/* Exercise summary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                TODAY&apos;S EXERCISES
              </h3>
              <span className="text-[12px] text-[#0d9488] font-semibold">{doneToday}/{exercises.length} done</span>
            </div>
            <div className="space-y-2">
              {exercises.map((ex) => (
                <div key={ex.name} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    ex.done ? "bg-[#0d9488]" : "border-2 border-[#cbd5e1]"
                  }`}>
                    {ex.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-[13px] ${ex.done ? "text-[#94a3b8] line-through" : "text-[#1e293b] font-medium"}`}>
                    {ex.name}
                  </span>
                  <span className="ml-auto text-[11px] text-[#94a3b8] font-mono">
                    {ex.sets}×{ex.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {activeTab === "appointments" && (
          <div className="p-6">
            <p className="text-[14px] font-semibold text-[#1e293b] mb-4">Appointment History</p>
            <div className="space-y-3">
              {appointments.map((a, i) => (
                <div key={i} className="flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] px-4 py-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#1e293b]">{a.date}</div>
                    <div className="text-[12px] text-[#94a3b8]">{a.time} · {a.duration} min</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.status === "completed" ? <Badge variant="success">✓ Done</Badge> : <Badge variant="teal">📅 Upcoming</Badge>}
                    {a.paid ? <Badge variant="success">Paid</Badge> : <Badge variant="error">Unpaid</Badge>}
                    <span className="text-[13px] text-[#64748b]">{a.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "exercises" && (
          <div className="p-6">
            <p className="text-[14px] font-semibold text-[#1e293b] mb-4">Exercise Plan · {patient.activePlan}</p>
            <div className="space-y-2">
              {exercises.map((ex) => (
                <div key={ex.name} className="flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${ex.done ? "bg-[#0d9488]" : "border-2 border-[#cbd5e1]"}` }>
                      {ex.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className={`text-[13px] font-medium ${ex.done ? "text-[#94a3b8] line-through" : "text-[#1e293b]"}`}>{ex.name}</p>
                      <p className="text-[11px] text-[#94a3b8]">{ex.sets} sets · {ex.reps} reps · {ex.freq}</p>
                    </div>
                  </div>
                  <Badge variant={ex.done ? "success" : "slate"}>{ex.done ? "Done" : "Pending"}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="p-6 text-center py-12">
            <MessageSquare className="w-10 h-10 text-[#cbd5e1] mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-[#1e293b]">Chat with {patient.name}</p>
            <p className="text-[13px] text-[#94a3b8] mt-1">Go to the Messages page to view the full conversation thread.</p>
            <Button className="mt-4" size="sm" onClick={() => toast.info("Navigate to Messages → Ravi Jayasuriya")}>
              Open conversation
            </Button>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="p-6">
            <p className="text-[14px] font-semibold text-[#1e293b] mb-4">Payment History</p>
            <div className="space-y-2">
              {appointments.map((a, i) => (
                <div key={i} className="flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] px-4 py-3">
                  <div>
                    <p className="text-[13px] font-semibold text-[#1e293b]">{a.date} · {a.duration} min</p>
                    <p className="text-[11px] text-[#94a3b8] mt-0.5">{a.amount}</p>
                  </div>
                  {a.paid ? <Badge variant="success">✓ Paid</Badge> : <Badge variant="warning">⏳ Pending</Badge>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Recent Appointments mini-table ── */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-[15px] font-bold text-[#1e293b]"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
            Appointment History
          </h2>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {appointments.map((a, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_80px_100px_80px] gap-4 px-6 py-3.5 items-center">
              <div>
                <div className="text-[13.5px] font-semibold text-[#1e293b]">{a.date}</div>
                <div className="text-[12px] text-[#94a3b8]">{a.time} · {a.duration} min</div>
              </div>
              <div>
                {a.status === "completed"
                  ? <Badge variant="success">✓ Done</Badge>
                  : <Badge variant="teal">📅 Upcoming</Badge>}
              </div>
              <div>
                {a.paid
                  ? <Badge variant="success">Paid</Badge>
                  : <Badge variant="error">Unpaid</Badge>}
              </div>
              <div className="text-[13px] text-[#64748b]">{a.amount}</div>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-[11px] px-2 py-1">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
