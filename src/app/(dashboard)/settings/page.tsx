"use client";

import { useState } from "react";
import {
  Building2,
  CreditCard,
  Clock,
  Bell,
  Shield,
  Camera,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─────────────────── Tab definitions ─────────────────────────── */
const TABS = [
  { id: "clinic",        label: "Clinic",        icon: Building2  },
  { id: "subscription",  label: "Subscription",  icon: CreditCard },
  { id: "availability",  label: "Availability",  icon: Clock      },
  { id: "notifications", label: "Notifications", icon: Bell       },
  { id: "security",      label: "Security",      icon: Shield     },
] as const;

type TabId = typeof TABS[number]["id"];

/* ─────────────────── Availability grid ───────────────────────── */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOT_TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const defaultAvailability: Record<string, boolean[]> = {
  Mon: [false, true,  true,  true,  false, false, true,  true,  true,  false, false],
  Tue: [false, true,  true,  true,  false, false, true,  true,  true,  false, false],
  Wed: [false, false, false, false, false, false, false, false, false, false, false],
  Thu: [false, true,  true,  true,  false, false, true,  true,  true,  false, false],
  Fri: [false, true,  true,  true,  false, false, false, false, false, false, false],
  Sat: [false, false, false, false, false, false, false, false, false, false, false],
  Sun: [false, false, false, false, false, false, false, false, false, false, false],
};

/* ─────────────────── Toggle Switch ───────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        "w-10 h-5.5 rounded-full relative transition-colors duration-200 cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-2",
        on ? "bg-[#0d9488]" : "bg-[#e2e8f0]"
      )}
      style={{ height: "22px", width: "40px" }}
    >
      <span className={cn(
        "absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200",
        on ? "translate-x-[18px]" : "translate-x-0"
      )} />
    </button>
  );
}

/* ─────────────────── Field wrapper ───────────────────────────── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-[#94a3b8] mt-1">{hint}</p>}
    </div>
  );
}

function Input({ placeholder, defaultValue, type = "text" }: { placeholder?: string; defaultValue?: string; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors bg-white"
    />
  );
}

/* ─────────────────── CLINIC tab ──────────────────────────────── */
function ClinicTab() {
  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5 pb-6 border-b border-[#f1f5f9]">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#0d9488] flex items-center justify-center">
            <span className="text-white text-[26px] font-bold" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>P</span>
          </div>
          <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border-2 border-[#e2e8f0] rounded-full flex items-center justify-center hover:border-[#0d9488] transition-colors cursor-pointer shadow-sm">
            <Camera className="w-3.5 h-3.5 text-[#64748b]" />
          </button>
        </div>
        <div>
          <p className="text-[15px] font-bold text-[#1e293b]">Dr. Priya Rathnayake</p>
          <p className="text-[13px] text-[#64748b] mt-0.5">Sports & Rehabilitation Physiotherapy</p>
          <Badge variant="success" className="mt-2">Verified practitioner</Badge>
        </div>
      </div>

      {/* Personal info */}
      <div>
        <h3 className="text-[13px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name"><Input defaultValue="Priya" /></Field>
          <Field label="Last name"><Input defaultValue="Rathnayake" /></Field>
          <Field label="Specialisation"><Input defaultValue="Sports & Rehabilitation" /></Field>
          <Field label="Registration number" hint="Your regulatory body registration ID"><Input defaultValue="SL-PHYSIO-004821" /></Field>
          <Field label="Email"><Input type="email" defaultValue="dr.priya@physiolink.lk" /></Field>
          <Field label="Phone"><Input type="tel" defaultValue="+94 77 234 5678" /></Field>
        </div>
      </div>

      {/* Clinic info */}
      <div>
        <h3 className="text-[13px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4">Clinic Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Clinic name" className="col-span-2"><Input defaultValue="Rathnayake Physiotherapy Centre" /></Field>
          <Field label="Address line 1"><Input defaultValue="45 Galle Road" /></Field>
          <Field label="Address line 2"><Input defaultValue="Colombo 03" /></Field>
          <Field label="City"><Input defaultValue="Colombo" /></Field>
          <Field label="Province"><Input defaultValue="Western" /></Field>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#f1f5f9]">
        <Button onClick={() => toast.success("Clinic details saved")}>Save changes</Button>
      </div>
    </div>
  );
}

/* ─────────────────── SUBSCRIPTION tab ────────────────────────── */
function SubscriptionTab() {
  return (
    <div className="space-y-5">
      {/* Current plan */}
      <div className="bg-[#0f172a] rounded-[14px] p-6 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-[20px] border-[#0d9488]/10 pointer-events-none" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] text-white/50 uppercase tracking-widest mb-1">Current plan</p>
            <h2 className="text-[24px] font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              Professional
            </h2>
            <p className="text-[13px] text-white/60 mt-0.5">Billed monthly · Renews 1 May 2026</p>
          </div>
          <span className="px-3 py-1 bg-[#0d9488] text-white text-[11px] font-bold rounded-full">ACTIVE</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
          {[
            { label: "Monthly price", value: "LKR 2,990" },
            { label: "Patients",      value: "Unlimited" },
            { label: "Next billing",  value: "1 May 2026" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
              <p className="text-[14px] font-semibold text-white mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features included */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5">
        <h3 className="text-[13px] font-bold text-[#1e293b] mb-3" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
          Plan includes
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Unlimited patients",
            "Real-time messaging",
            "Exercise plan builder",
            "Appointment calendar",
            "Payment processing",
            "Analytics dashboard",
            "SMS reminders",
            "Priority support",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-[13px] text-[#64748b]">
              <Check className="w-4 h-4 text-[#0d9488] flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Billing actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-4">
          <h4 className="text-[13px] font-bold text-[#1e293b] mb-1">Payment method</h4>
          <div className="flex items-center gap-2 mt-2">
            <CreditCard className="w-5 h-5 text-[#64748b]" />
            <span className="text-[13px] text-[#64748b]">Visa ending ···4242</span>
          </div>
          <button className="mt-3 text-[12px] text-[#0d9488] font-semibold hover:text-[#0f766e] cursor-pointer">
            Update card →
          </button>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-4">
          <h4 className="text-[13px] font-bold text-[#1e293b] mb-1">Manage plan</h4>
          <p className="text-[12px] text-[#94a3b8] mt-1">Upgrade, downgrade, or cancel via Stripe portal</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => toast.info("Opening Stripe customer portal…")}
          >
            Open billing portal
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── AVAILABILITY tab ────────────────────────── */
function AvailabilityTab() {
  const [avail, setAvail] = useState(defaultAvailability);

  function toggle(day: string, slotIndex: number) {
    setAvail((prev) => ({
      ...prev,
      [day]: prev[day].map((v, i) => (i === slotIndex ? !v : v)),
    }));
  }

  function toggleDay(day: string, on: boolean) {
    setAvail((prev) => ({ ...prev, [day]: prev[day].map(() => on) }));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#64748b]">
          Click time slots to toggle your availability. Patients can book within these windows.
        </p>
        <Button size="sm" onClick={() => toast.success("Availability saved")}>Save schedule</Button>
      </div>

      {/* Grid */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        {/* Header */}
        <div className="grid border-b border-[#e2e8f0]" style={{ gridTemplateColumns: "80px repeat(11, 1fr)" }}>
          <div className="bg-[#f8fafc] border-r border-[#e2e8f0]" />
          {SLOT_TIMES.map((t) => (
            <div key={t} className="bg-[#f8fafc] py-2 text-center border-r border-[#e2e8f0] last:border-r-0">
              <span className="text-[9px] font-bold text-[#94a3b8] tracking-wider">{t}</span>
            </div>
          ))}
        </div>

        {/* Day rows */}
        {DAYS.map((day) => {
          const isWeekend = day === "Sat" || day === "Sun";
          const anyOn = avail[day].some(Boolean);
          return (
            <div key={day} className="grid border-b border-[#e2e8f0] last:border-b-0" style={{ gridTemplateColumns: "80px repeat(11, 1fr)" }}>
              {/* Day label */}
              <div className={cn("border-r border-[#e2e8f0] flex flex-col items-center justify-center py-2.5 gap-1", isWeekend ? "bg-[#f8fafc]" : "bg-white")}>
                <span className={cn("text-[11px] font-bold", isWeekend ? "text-[#94a3b8]" : "text-[#475569]")}>{day}</span>
                <Toggle on={anyOn} onChange={(v) => toggleDay(day, v)} />
              </div>

              {/* Slots */}
              {avail[day].map((on, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(day, i)}
                  className={cn(
                    "border-r border-[#e2e8f0] last:border-r-0 py-3.5 transition-colors cursor-pointer",
                    on
                      ? "bg-[#0d9488] hover:bg-[#0f766e]"
                      : isWeekend
                        ? "bg-[#f8fafc] hover:bg-[#f1f5f9]"
                        : "bg-white hover:bg-[#f0fdf9]"
                  )}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[12px] text-[#64748b]">
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-[#0d9488]" /> Available</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-[#f1f5f9] border border-[#e2e8f0]" /> Unavailable</div>
      </div>
    </div>
  );
}

/* ─────────────────── NOTIFICATIONS tab ───────────────────────── */
function NotificationsTab() {
  const sections: Array<{ category: string; items: Array<{ label: string; hint: string; defaultOn: boolean }> }> = [
    {
      category: "Email Notifications",
      items: [
        { label: "New appointment booked",      hint: "When a patient books a session",          defaultOn: true },
        { label: "Appointment reminder",         hint: "24 hours before each appointment",        defaultOn: true },
        { label: "Appointment cancellation",     hint: "When a patient cancels",                  defaultOn: true },
        { label: "New message received",         hint: "When a patient sends you a message",      defaultOn: false },
        { label: "Payment received",             hint: "When a session fee is collected",          defaultOn: true },
        { label: "Subscription renewal",         hint: "7 days before your plan renews",          defaultOn: true },
      ],
    },
    {
      category: "SMS Notifications",
      items: [
        { label: "Appointment reminders (1h)",   hint: "SMS to patients 1 hour before sessions",  defaultOn: true },
        { label: "Appointment reminders (24h)",  hint: "SMS to patients 24 hours before sessions", defaultOn: true },
        { label: "New exercise plan assigned",   hint: "Notify patients of new plans",             defaultOn: true },
      ],
    },
    {
      category: "Push Notifications",
      items: [
        { label: "New messages",                 hint: "In-app push for patient messages",         defaultOn: true },
        { label: "Missed appointments",          hint: "Alert when a patient doesn't show",        defaultOn: false },
        { label: "Low adherence alert",          hint: "When a patient's adherence drops below 40%", defaultOn: true },
      ],
    },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    sections.forEach((s) => s.items.forEach((item) => { m[item.label] = item.defaultOn; }));
    return m;
  });

  return (
    <div className="space-y-6">
      {sections.map(({ category, items }) => (
        <div key={category}>
          <h3 className="text-[13px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3 pb-3 border-b border-[#f1f5f9]">
            {category}
          </h3>
          <div className="space-y-1">
            {items.map(({ label, hint }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-b-0">
                <div>
                  <p className="text-[13.5px] font-medium text-[#1e293b]">{label}</p>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">{hint}</p>
                </div>
                <Toggle
                  on={toggles[label] ?? false}
                  onChange={(v) => setToggles((prev) => ({ ...prev, [label]: v }))}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Notification preferences saved")}>Save preferences</Button>
      </div>
    </div>
  );
}

/* ─────────────────── SECURITY tab ────────────────────────────── */
function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twofa, setTwofa] = useState(false);

  return (
    <div className="space-y-6">
      {/* Change password */}
      <div>
        <h3 className="text-[13px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4">Change Password</h3>
        <div className="space-y-4 max-w-[420px]">
          <Field label="Current password">
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] focus:outline-none focus:border-[#0d9488] transition-colors"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] cursor-pointer">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>
          <Field label="New password" hint="Minimum 8 characters, one uppercase, one number">
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] focus:outline-none focus:border-[#0d9488] transition-colors"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] cursor-pointer">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>
          <Field label="Confirm new password">
            <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] focus:outline-none focus:border-[#0d9488] transition-colors" />
          </Field>
          <Button onClick={() => toast.success("Password updated successfully")}>Update password</Button>
        </div>
      </div>

      {/* 2FA */}
      <div className="pt-5 border-t border-[#f1f5f9]">
        <h3 className="text-[13px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4">Two-Factor Authentication</h3>
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center justify-between max-w-[480px]">
          <div>
            <p className="text-[14px] font-semibold text-[#1e293b]">Authenticator app (TOTP)</p>
            <p className="text-[12px] text-[#94a3b8] mt-0.5">Add an extra layer of security to your account</p>
            {twofa && <Badge variant="success" className="mt-2">Enabled</Badge>}
          </div>
          <Toggle on={twofa} onChange={(v) => { setTwofa(v); toast.success(v ? "2FA enabled" : "2FA disabled"); }} />
        </div>
      </div>

      {/* Sessions */}
      <div className="pt-5 border-t border-[#f1f5f9]">
        <h3 className="text-[13px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4">Active Sessions</h3>
        <div className="space-y-2 max-w-[480px]">
          {[
            { device: "Chrome on Windows 11", location: "Colombo, LK", current: true,  last: "Now" },
            { device: "Safari on iPhone",     location: "Colombo, LK", current: false, last: "2 hours ago" },
          ].map(({ device, location, current, last }) => (
            <div key={device} className="bg-white border border-[#e2e8f0] rounded-[12px] p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-[#1e293b]">{device}</p>
                  {current && <Badge variant="success">This device</Badge>}
                </div>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">{location} · {last}</p>
              </div>
              {!current && (
                <button className="text-[12px] text-[#dc2626] font-semibold hover:text-[#b91c1c] cursor-pointer">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Main Page ────────────────────────────────── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("clinic");
  const ActiveContent = {
    clinic:        ClinicTab,
    subscription:  SubscriptionTab,
    availability:  AvailabilityTab,
    notifications: NotificationsTab,
    security:      SecurityTab,
  }[activeTab];

  return (
    <div className="animate-fade-in">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1
          className="text-[28px] font-bold text-[#1e293b] leading-tight"
          style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
        >
          Settings
        </h1>
        <p className="text-[14px] text-[#64748b] mt-0.5">Manage your clinic, subscription, and preferences</p>
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-6 items-start">
        {/* ── Vertical tab nav ── */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium border-b border-[#f1f5f9] last:border-b-0 transition-colors cursor-pointer text-left",
                activeTab === id
                  ? "bg-[#f0fdf9] text-[#0d9488] border-r-2 border-r-[#0d9488]"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              <ChevronRight className={cn(
                "w-3.5 h-3.5 ml-auto transition-transform",
                activeTab === id ? "text-[#0d9488] rotate-90" : "text-[#cbd5e1]"
              )} />
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-6">
          <ActiveContent />
        </div>
      </div>
    </div>
  );
}
