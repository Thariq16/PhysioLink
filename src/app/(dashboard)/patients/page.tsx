"use client";

import { useState } from "react";
import {
  Search,
  UserPlus,
  ArrowUpDown,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";

// Metadata removed — client component

// ── Mock data ──
const patients = [
  { id: "p1", name: "Ravi Jayasuriya",   initials: "RJ", condition: "Knee ligament tear",    adherence: 86, lastAppt: "9 Apr 2026",  nextAppt: "16 Apr 2026", status: "active",   plan: "Knee Rehab Phase 2" },
  { id: "p2", name: "Amara Perera",      initials: "AP", condition: "Lower back pain",       adherence: 52, lastAppt: "7 Apr 2026",  nextAppt: "11 Apr 2026", status: "active",   plan: "Core Strengthening" },
  { id: "p3", name: "Dinesh Silva",      initials: "DS", condition: "Rotator cuff injury",   adherence: 24, lastAppt: "5 Apr 2026",  nextAppt: "12 Apr 2026", status: "at-risk",  plan: "Shoulder Mobility" },
  { id: "p4", name: "Priya Rathnayake", initials: "PR", condition: "Ankle sprain (Grade 2)", adherence: 91, lastAppt: "8 Apr 2026",  nextAppt: "15 Apr 2026", status: "active",   plan: "Ankle Stability" },
  { id: "p5", name: "Kasun Bandara",    initials: "KB", condition: "Post-op ACL recovery",   adherence: 68, lastAppt: "6 Apr 2026",  nextAppt: "13 Apr 2026", status: "active",   plan: "ACL Post-op Phase 1" },
  { id: "p6", name: "Nilufar Hashim",   initials: "NH", condition: "Cervical spondylosis",   adherence: 0,  lastAppt: "1 Apr 2026",  nextAppt: "—",           status: "inactive", plan: "—" },
  { id: "p7", name: "Thariq Hamad",     initials: "TH", condition: "Hamstring strain",       adherence: 78, lastAppt: "10 Apr 2026", nextAppt: "17 Apr 2026", status: "active",   plan: "Hamstring Recovery" },
];

function adherenceColor(val: number) {
  if (val === 0) return "text-[#94a3b8]";
  if (val >= 75) return "text-[#16a34a] font-bold";
  if (val >= 50) return "text-[#d97706] font-bold";
  return "text-[#dc2626] font-bold";
}

function adherenceBar(val: number) {
  const color =
    val >= 75 ? "bg-[#16a34a]" : val >= 50 ? "bg-[#d97706]" : val === 0 ? "bg-[#e2e8f0]" : "bg-[#dc2626]";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${val}%` }}
        />
      </div>
      <span className={`text-[12px] tabular-nums ${adherenceColor(val)}`}>
        {val === 0 ? "—" : `${val}%`}
      </span>
    </div>
  );
}

function statusBadge(status: string) {
  if (status === "active")   return <Badge variant="success">Active</Badge>;
  if (status === "at-risk")  return <Badge variant="warning">At risk</Badge>;
  if (status === "inactive") return <Badge variant="slate">Inactive</Badge>;
  return null;
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");

  const filtered = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All status" ||
      (statusFilter === "Active"   && p.status === "active") ||
      (statusFilter === "At risk"  && p.status === "at-risk") ||
      (statusFilter === "Inactive" && p.status === "inactive");
    return matchesSearch && matchesStatus;
  });

  const active = patients.filter((p) => p.status === "active" || p.status === "at-risk").length;
  const atRisk = patients.filter((p) => p.adherence > 0 && p.adherence < 50).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-[28px] font-bold text-[#1e293b] leading-tight"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
          >
            Patients
          </h1>
          <p className="text-[14px] text-[#64748b] mt-0.5">
            {active} active · {atRisk} need attention
          </p>
        </div>
        <Button leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => toast.info("Invite flow launches after beta!")}>
          Invite patient
        </Button>
      </div>

      {/* ── Filters bar ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients…"
            className="w-full pl-9 pr-4 py-2 text-[14px] border border-[#e2e8f0] rounded-[10px] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-[10px] bg-white text-[#64748b] focus:outline-none focus:border-[#0d9488] cursor-pointer"
        >
          <option>All status</option>
          <option>Active</option>
          <option>At risk</option>
          <option>Inactive</option>
        </select>
        <select className="px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-[10px] bg-white text-[#64748b] focus:outline-none focus:border-[#0d9488] cursor-pointer">
          <option>Sort: Adherence ↓</option>
          <option>Sort: Name A–Z</option>
          <option>Sort: Last appointment</option>
          <option>Sort: Next appointment</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        {/* Table Head */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] gap-4 px-6 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
          {[
            { label: "Patient",     sortable: true },
            { label: "Condition",   sortable: false },
            { label: "Adherence",   sortable: true },
            { label: "Last appt",   sortable: true },
            { label: "Status",      sortable: false },
            { label: "",            sortable: false },
          ].map(({ label, sortable }) => (
            <div
              key={label}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]"
            >
              {label}
              {sortable && <ArrowUpDown className="w-3 h-3 cursor-pointer hover:text-[#0d9488]" />}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#f1f5f9] stagger">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/patients/${p.id}`}
              className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] gap-4 px-6 py-4 items-center hover:bg-[#f8fafc] transition-colors group cursor-pointer"
            >
              {/* Name + initials */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center text-[12px] font-bold flex-shrink-0">
                  {p.initials}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#1e293b] group-hover:text-[#0d9488] transition-colors">
                    {p.name}
                  </div>
                  <div className="text-[12px] text-[#94a3b8]">{p.plan}</div>
                </div>
              </div>

              {/* Condition */}
              <div className="text-[13px] text-[#64748b]">{p.condition}</div>

              {/* Adherence bar */}
              <div>{adherenceBar(p.adherence)}</div>

              {/* Last appt */}
              <div className="text-[13px] text-[#64748b]">{p.lastAppt}</div>

              {/* Status */}
              <div>{statusBadge(p.status)}</div>

              {/* Chevron */}
              <div className="flex justify-end">
                <ChevronRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#0d9488] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between text-[13px] text-[#64748b]">
        <span>Showing {filtered.length} of {patients.length} patients</span>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled>Previous</Button>
          <span className="px-3 py-1.5 rounded-lg bg-[#0d9488] text-white text-[12px] font-semibold">1</span>
          <Button variant="secondary" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
