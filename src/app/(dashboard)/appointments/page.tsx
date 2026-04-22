"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  X,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  addDays,
  addWeeks,
  subWeeks,
  startOfWeek,
  format,
  isSameDay,
  isToday,
} from "date-fns";

/* ─────────────────────────── Types ─────────────────────────── */
type ApptStatus = "confirmed" | "scheduled" | "completed" | "cancelled";

interface Appointment {
  id: string;
  patientName: string;
  initials: string;
  date: Date;
  startHour: number; // 0‑23
  startMin: number;
  durationMin: number;
  status: ApptStatus;
  fee: string;
}

/* ─────────────────────────── Mock data ─────────────────────── */
const today = new Date();
const mkDate = (dayOffset: number, h: number, m = 0) => {
  const d = addDays(today, dayOffset);
  d.setHours(h, m, 0, 0);
  return d;
};

const APPOINTMENTS: Appointment[] = [
  { id: "a1", patientName: "Ravi Jayasuriya",   initials: "RJ", date: mkDate(0, 10),     startHour: 10, startMin: 0,  durationMin: 45, status: "confirmed",  fee: "LKR 3,500" },
  { id: "a2", patientName: "Amara Perera",      initials: "AP", date: mkDate(0, 11, 30), startHour: 11, startMin: 30, durationMin: 45, status: "scheduled",  fee: "LKR 3,500" },
  { id: "a3", patientName: "Dinesh Silva",      initials: "DS", date: mkDate(0, 14),     startHour: 14, startMin: 0,  durationMin: 60, status: "scheduled",  fee: "LKR 3,500" },
  { id: "a4", patientName: "Priya Rathnayake", initials: "PR", date: mkDate(1, 9),      startHour: 9,  startMin: 0,  durationMin: 45, status: "confirmed",  fee: "LKR 3,500" },
  { id: "a5", patientName: "Kasun Bandara",    initials: "KB", date: mkDate(1, 15),     startHour: 15, startMin: 0,  durationMin: 45, status: "scheduled",  fee: "LKR 3,500" },
  { id: "a6", patientName: "Nilufar Hashim",   initials: "NH", date: mkDate(2, 10, 30), startHour: 10, startMin: 30, durationMin: 30, status: "confirmed",  fee: "LKR 3,500" },
  { id: "a7", patientName: "Thariq Hamad",     initials: "TH", date: mkDate(3, 13),     startHour: 13, startMin: 0,  durationMin: 60, status: "scheduled",  fee: "LKR 3,500" },
  { id: "a8", patientName: "Ravi Jayasuriya",  initials: "RJ", date: mkDate(-1, 10),    startHour: 10, startMin: 0,  durationMin: 45, status: "completed",  fee: "LKR 3,500" },
  { id: "a9", patientName: "Amara Perera",     initials: "AP", date: mkDate(-2, 14),    startHour: 14, startMin: 0,  durationMin: 45, status: "cancelled",  fee: "LKR 3,500" },
];

/* ─────────────────────────── Helpers ───────────────────────── */
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8–18
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusConfig: Record<ApptStatus, { badge: React.ReactNode; color: string; bg: string; border: string }> = {
  confirmed: {
    badge: <Badge variant="success">✓ Confirmed</Badge>,
    color: "text-[#16a34a]",
    bg: "bg-[#dcfce7]",
    border: "border-[#86efac]",
  },
  scheduled: {
    badge: <Badge variant="teal">📅 Scheduled</Badge>,
    color: "text-[#0f766e]",
    bg: "bg-[#ccfbf1]",
    border: "border-[#5eead4]",
  },
  completed: {
    badge: <Badge variant="slate">✓ Completed</Badge>,
    color: "text-[#475569]",
    bg: "bg-[#f1f5f9]",
    border: "border-[#cbd5e1]",
  },
  cancelled: {
    badge: <Badge variant="error">✗ Cancelled</Badge>,
    color: "text-[#dc2626]",
    bg: "bg-[#fee2e2]",
    border: "border-[#fca5a5]",
  },
};

/* ─────────────────────────── New Appt Modal ─────────────────── */
function NewAppointmentModal({
  open,
  onClose,
  defaultDate,
}: {
  open: boolean;
  onClose: () => void;
  defaultDate?: Date;
}) {
  const [date, setDate] = useState(defaultDate ? format(defaultDate, "yyyy-MM-dd") : format(today, "yyyy-MM-dd"));
  const [time, setTime] = useState("10:00");
  const [patient, setPatient] = useState("");
  const [dur, setDur] = useState("45");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] mx-4 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <div>
            <h2 className="text-[17px] font-bold text-[#1e293b]"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              New Appointment
            </h2>
            <p className="text-[12px] text-[#94a3b8] mt-0.5">Schedule a session for a patient</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Patient */}
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Patient</label>
            <select
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] bg-white text-[14px] text-[#1e293b] focus:outline-none focus:border-[#0d9488] transition-colors"
            >
              <option value="">Select a patient…</option>
              <option>Ravi Jayasuriya</option>
              <option>Amara Perera</option>
              <option>Dinesh Silva</option>
              <option>Priya Rathnayake</option>
              <option>Kasun Bandara</option>
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] bg-white text-[14px] text-[#1e293b] focus:outline-none focus:border-[#0d9488] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] bg-white text-[14px] text-[#1e293b] focus:outline-none focus:border-[#0d9488] transition-colors"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Duration</label>
            <div className="flex gap-2">
              {["30", "45", "60", "90"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDur(d)}
                  className={cn(
                    "flex-1 py-2 rounded-[8px] text-[13px] font-medium border transition-all cursor-pointer",
                    dur === d
                      ? "bg-[#0d9488] text-white border-[#0d9488]"
                      : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#0d9488]"
                  )}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Notes <span className="text-[#94a3b8] font-normal">(optional)</span></label>
            <textarea
              rows={3}
              placeholder="Session goals or patient notes…"
              className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] bg-white text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc]">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={onClose}>Create appointment</Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Appointment Block ──────────────── */
function ApptBlock({ appt, onClick }: { appt: Appointment; onClick: () => void }) {
  const cfg = statusConfig[appt.status];
  const topPx = (appt.startMin / 60) * 64;
  const heightPx = (appt.durationMin / 60) * 64;

  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute left-1 right-1 rounded-lg border px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden group",
        cfg.bg, cfg.border
      )}
      style={{ top: `${topPx}px`, height: `${Math.max(heightPx, 28)}px` }}
    >
      <p className={cn("text-[11px] font-bold truncate leading-tight", cfg.color)}>
        {appt.patientName}
      </p>
      {heightPx > 40 && (
        <p className="text-[10px] text-[#64748b] truncate mt-0.5 font-mono">
          {String(appt.startHour).padStart(2, "0")}:{String(appt.startMin).padStart(2, "0")} · {appt.durationMin}min
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────── Detail Drawer ─────────────────── */
function ApptDetailDrawer({ appt, onClose }: { appt: Appointment | null; onClose: () => void }) {
  if (!appt) return null;
  const cfg = statusConfig[appt.status];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white w-[340px] h-full shadow-2xl flex flex-col animate-fade-in">
        {/* Header */}
        <div className={cn("px-5 py-4 border-b border-[#e2e8f0]", cfg.bg)}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Appointment</span>
            <button onClick={onClose} className="text-[#94a3b8] hover:text-[#475569] cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center text-[13px] font-bold">
              {appt.initials}
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#1e293b]"
                style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                {appt.patientName}
              </p>
              <div className="mt-0.5">{cfg.badge}</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-3 flex-1 overflow-y-auto">
          {[
            { icon: Calendar, label: "Date",     value: format(appt.date, "EEEE, d MMMM yyyy") },
            { icon: Clock,    label: "Time",     value: `${String(appt.startHour).padStart(2,"0")}:${String(appt.startMin).padStart(2,"0")} — ${appt.durationMin} min` },
            { icon: User,     label: "Patient",  value: appt.patientName },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 py-3 border-b border-[#f1f5f9]">
              <div className="w-7 h-7 rounded-lg bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-[#64748b]" />
              </div>
              <div>
                <p className="text-[11px] text-[#94a3b8] font-semibold tracking-wide uppercase">{label}</p>
                <p className="text-[13.5px] text-[#1e293b] font-medium">{value}</p>
              </div>
            </div>
          ))}

          {/* Fee */}
          <div className="bg-[#f0fdf9] border border-[#99f6e4] rounded-xl p-4 mt-2">
            <p className="text-[11px] text-[#0f766e] font-bold uppercase tracking-wider mb-1">Session Fee</p>
            <p className="text-[22px] font-bold text-[#0d9488]"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              {appt.fee}
            </p>
          </div>
        </div>

        {/* Actions */}
        {appt.status !== "completed" && appt.status !== "cancelled" && (
          <div className="p-5 border-t border-[#e2e8f0] space-y-2">
            <Button className="w-full" size="sm">Reschedule</Button>
            <Button variant="danger" className="w-full" size="sm">Cancel appointment</Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Page ─────────────────────── */
export default function AppointmentsPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today, { weekStartsOn: 1 }));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | undefined>();
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [view, setView] = useState<"week" | "list">("week");

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  function apptForDayHour(day: Date, hour: number) {
    return APPOINTMENTS.filter(
      (a) => isSameDay(a.date, day) && a.startHour === hour
    );
  }

  function handleSlotClick(day: Date, hour: number) {
    const d = new Date(day);
    d.setHours(hour, 0, 0, 0);
    setModalDate(d);
    setModalOpen(true);
  }

  // Summary counts
  const todayAppts  = APPOINTMENTS.filter((a) => isToday(a.date));
  const weekAppts   = APPOINTMENTS.filter((a) => weekDays.some((d) => isSameDay(d, a.date)));
  const confirmed   = weekAppts.filter((a) => a.status === "confirmed").length;
  const cancelled   = weekAppts.filter((a) => a.status === "cancelled").length;

  return (
    <>
      <NewAppointmentModal open={modalOpen} onClose={() => setModalOpen(false)} defaultDate={modalDate} />
      <ApptDetailDrawer appt={selectedAppt} onClose={() => setSelectedAppt(null)} />

      <div className="space-y-5 animate-fade-in">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#1e293b] leading-tight"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              Appointments
            </h1>
            <p className="text-[14px] text-[#64748b] mt-0.5">
              {todayAppts.length} today · {weekAppts.length} this week
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex border border-[#e2e8f0] rounded-[10px] overflow-hidden bg-white">
              {(["week", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer capitalize",
                    view === v
                      ? "bg-[#0d9488] text-white"
                      : "text-[#64748b] hover:bg-[#f8fafc]"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => { setModalDate(undefined); setModalOpen(true); }}>
              New appointment
            </Button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-4 gap-3 stagger">
          {[
            { label: "Today",       value: String(todayAppts.length),  icon: Calendar,     bg: "bg-[#dbeafe]", ic: "text-[#2563eb]" },
            { label: "This week",   value: String(weekAppts.length),   icon: Calendar,     bg: "bg-[#ccfbf1]", ic: "text-[#0f766e]" },
            { label: "Confirmed",   value: String(confirmed),          icon: CheckCircle2, bg: "bg-[#dcfce7]", ic: "text-[#16a34a]" },
            { label: "Cancelled",   value: String(cancelled),          icon: XCircle,      bg: "bg-[#fee2e2]", ic: "text-[#dc2626]" },
          ].map(({ label, value, icon: Icon, bg, ic }) => (
            <div key={label} className="bg-white border border-[#e2e8f0] rounded-[12px] p-4 flex items-center gap-3 hover:border-[#0d9488] transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon className={`w-4.5 h-4.5 ${ic}`} />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[#1e293b] leading-none"
                  style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>{value}</div>
                <div className="text-[11px] text-[#94a3b8] mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Week nav ── */}
        <div className="flex items-center justify-between bg-white border border-[#e2e8f0] rounded-[12px] px-4 py-2.5">
          <button
            onClick={() => setWeekStart(subWeeks(weekStart, 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-[#1e293b]">
              {format(weekStart, "d MMM")} – {format(addDays(weekStart, 6), "d MMM yyyy")}
            </p>
            <p className="text-[11px] text-[#94a3b8]">Week {format(weekStart, "w")}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setWeekStart(startOfWeek(today, { weekStartsOn: 1 }))}
              className="px-3 py-1 text-[12px] font-medium text-[#0d9488] hover:bg-[#f0fdf9] rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => setWeekStart(addWeeks(weekStart, 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Week View ── */}
        {view === "week" && (
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
            {/* Day header row */}
            <div className="grid border-b border-[#e2e8f0]" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
              <div className="border-r border-[#e2e8f0] bg-[#f8fafc]" />
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "py-2.5 text-center border-r border-[#e2e8f0] last:border-r-0",
                    isToday(day) ? "bg-[#f0fdf9]" : "bg-[#f8fafc]"
                  )}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    {DAYS_SHORT[day.getDay()]}
                  </p>
                  <p className={cn(
                    "text-[18px] font-bold leading-tight mt-0.5",
                    isToday(day) ? "text-[#0d9488]" : "text-[#1e293b]"
                  )}
                    style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                    {format(day, "d")}
                  </p>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="overflow-y-auto" style={{ maxHeight: "520px" }}>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="grid border-b border-[#f1f5f9]"
                  style={{ gridTemplateColumns: "56px repeat(7, 1fr)", minHeight: "64px" }}
                >
                  {/* Hour label */}
                  <div className="border-r border-[#e2e8f0] flex items-start justify-center pt-1.5">
                    <span className="text-[10px] font-mono text-[#94a3b8]">
                      {String(hour).padStart(2, "0")}:00
                    </span>
                  </div>

                  {/* Day cells */}
                  {weekDays.map((day) => {
                    const appts = apptForDayHour(day, hour);
                    return (
                      <div
                        key={day.toISOString()}
                        className={cn(
                          "relative border-r border-[#f1f5f9] last:border-r-0 cursor-pointer group",
                          isToday(day) ? "bg-[#fafffe]" : "hover:bg-[#f8fafc]"
                        )}
                        style={{ minHeight: "64px" }}
                        onClick={() => appts.length === 0 && handleSlotClick(day, hour)}
                      >
                        {/* Empty slot hover hint */}
                        {appts.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-3.5 h-3.5 text-[#0d9488]/40" />
                          </div>
                        )}
                        {/* Appointment blocks */}
                        {appts.map((a) => (
                          <ApptBlock
                            key={a.id}
                            appt={a}
                            onClick={(e?: React.MouseEvent) => {
                              e?.stopPropagation?.();
                              setSelectedAppt(a);
                            }}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── List View ── */}
        {view === "list" && (
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_160px_100px_80px] gap-4 px-6 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
              {["Patient", "Time", "Date", "Status", "Fee"].map((h) => (
                <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-[#f1f5f9] stagger">
              {[...APPOINTMENTS]
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((appt) => (
                  <div
                    key={appt.id}
                    onClick={() => setSelectedAppt(appt)}
                    className="grid grid-cols-[1fr_100px_160px_100px_80px] gap-4 px-6 py-3.5 items-center hover:bg-[#f8fafc] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ccfbf1] text-[#0f766e] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {appt.initials}
                      </div>
                      <span className="text-[13.5px] font-semibold text-[#1e293b] group-hover:text-[#0d9488] transition-colors">
                        {appt.patientName}
                      </span>
                    </div>
                    <span className="text-[13px] text-[#64748b] font-mono">
                      {String(appt.startHour).padStart(2,"0")}:{String(appt.startMin).padStart(2,"0")}
                    </span>
                    <span className="text-[13px] text-[#64748b]">{format(appt.date, "EEE, d MMM yyyy")}</span>
                    <div>{statusConfig[appt.status].badge}</div>
                    <span className="text-[13px] text-[#64748b]">{appt.fee}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
