"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Dumbbell,
  Clock,
  CheckCircle2,
  ChevronRight,
  X,
  Users,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ── Types ── */
type ExerciseStatus = "active" | "completed" | "paused";

interface ExercisePlan {
  id: string;
  patientName: string;
  initials: string;
  planName: string;
  condition: string;
  exercises: number;
  completed: number;
  frequency: string;
  status: ExerciseStatus;
  adherence: number;
  lastActive: string;
}

/* ── Mock Data ── */
const PLANS: ExercisePlan[] = [
  { id: "ep1", patientName: "Ravi Jayasuriya",   initials: "RJ", planName: "Knee Rehab Phase 2",   condition: "ACL Recovery",          exercises: 6, completed: 5, frequency: "Daily",      status: "active",    adherence: 86, lastActive: "Today" },
  { id: "ep2", patientName: "Amara Perera",      initials: "AP", planName: "Core Strengthening",    condition: "Lower back pain",       exercises: 5, completed: 2, frequency: "5x / week",  status: "active",    adherence: 52, lastActive: "Yesterday" },
  { id: "ep3", patientName: "Dinesh Silva",      initials: "DS", planName: "Shoulder Mobility",     condition: "Rotator cuff injury",   exercises: 4, completed: 1, frequency: "3x / week",  status: "active",    adherence: 24, lastActive: "3 days ago" },
  { id: "ep4", patientName: "Priya Rathnayake",  initials: "PR", planName: "Ankle Stability",       condition: "Ankle sprain Grade 2",  exercises: 5, completed: 5, frequency: "Daily",      status: "active",    adherence: 91, lastActive: "Today" },
  { id: "ep5", patientName: "Kasun Bandara",     initials: "KB", planName: "ACL Post-op Phase 1",   condition: "Post-op ACL",           exercises: 7, completed: 4, frequency: "4x / week",  status: "active",    adherence: 68, lastActive: "Today" },
  { id: "ep6", patientName: "Thariq Hamad",      initials: "TH", planName: "Hamstring Recovery",    condition: "Hamstring strain",      exercises: 4, completed: 3, frequency: "Daily",      status: "active",    adherence: 78, lastActive: "Yesterday" },
  { id: "ep7", patientName: "Nilufar Hashim",    initials: "NH", planName: "Cervical Mobility",     condition: "Cervical spondylosis",  exercises: 3, completed: 0, frequency: "3x / week",  status: "paused",    adherence: 0,  lastActive: "2 weeks ago" },
];

const EXERCISE_LIBRARY = [
  { name: "Quad Stretch",        category: "Knee",     muscle: "Quadriceps",   duration: "30 sec hold",  sets: "3 sets" },
  { name: "Hip Bridge",          category: "Core",     muscle: "Glutes",       duration: "10 reps",      sets: "3 sets" },
  { name: "Calf Raises",         category: "Ankle",    muscle: "Gastrocnemius",duration: "15 reps",      sets: "2 sets" },
  { name: "Shoulder Pendulum",   category: "Shoulder", muscle: "Rotator cuff", duration: "60 sec",       sets: "2 sets" },
  { name: "Bird-Dog",            category: "Core",     muscle: "Core / Back",  duration: "10 reps each", sets: "3 sets" },
  { name: "Internal Rotation",   category: "Shoulder", muscle: "Subscapularis",duration: "15 reps",      sets: "2 sets" },
  { name: "Side Step Band",      category: "Hip",      muscle: "Hip Abductors",duration: "20 reps",      sets: "2 sets" },
  { name: "Leg Press",           category: "Knee",     muscle: "Quadriceps",   duration: "8 reps",       sets: "3 sets" },
];

function adherenceBar(val: number) {
  const color = val >= 75 ? "bg-[#16a34a]" : val >= 50 ? "bg-[#d97706]" : val === 0 ? "bg-[#e2e8f0]" : "bg-[#dc2626]";
  const textColor = val >= 75 ? "text-[#16a34a]" : val >= 50 ? "text-[#d97706]" : val === 0 ? "text-[#94a3b8]" : "text-[#dc2626]";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${val}%` }} />
      </div>
      <span className={`text-[12px] tabular-nums font-bold ${textColor}`}>
        {val === 0 ? "—" : `${val}%`}
      </span>
    </div>
  );
}

function statusBadge(s: ExerciseStatus) {
  if (s === "active")    return <Badge variant="success">Active</Badge>;
  if (s === "completed") return <Badge variant="slate">Completed</Badge>;
  return <Badge variant="warning">Paused</Badge>;
}

/* ── New Plan Modal ── */
function NewPlanModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [patient, setPatient] = useState("");
  const [planName, setPlanName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[500px] mx-4 animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <div>
            <h2 className="text-[17px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              New Exercise Plan
            </h2>
            <p className="text-[12px] text-[#94a3b8] mt-0.5">Assign a plan to a patient</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Patient</label>
            <select
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] focus:outline-none focus:border-[#0d9488] bg-white"
            >
              <option value="">Select a patient…</option>
              <option>Ravi Jayasuriya</option>
              <option>Amara Perera</option>
              <option>Dinesh Silva</option>
              <option>Priya Rathnayake</option>
              <option>Kasun Bandara</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Plan name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Knee Rehab Phase 3"
              className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#475569] mb-2 tracking-wide">Add exercises from library</label>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
              {EXERCISE_LIBRARY.map((ex) => (
                <div key={ex.name} className="border border-[#e2e8f0] rounded-[10px] p-3 hover:border-[#0d9488] cursor-pointer transition-colors">
                  <p className="text-[13px] font-semibold text-[#1e293b]">{ex.name}</p>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">{ex.duration} · {ex.sets}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#f0fdf9] text-[#0f766e] text-[10px] rounded-full font-medium">{ex.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc]">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1"
            onClick={() => {
              toast.success(`Plan "${planName || "New Plan"}" created for ${patient || "patient"}!`);
              onClose();
            }}
          >
            Create plan
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ExercisesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const activePlans   = PLANS.filter((p) => p.status === "active").length;
  const avgAdherence  = Math.round(PLANS.filter((p) => p.adherence > 0).reduce((s, p) => s + p.adherence, 0) / PLANS.filter((p) => p.adherence > 0).length);
  const atRisk        = PLANS.filter((p) => p.adherence > 0 && p.adherence < 50).length;

  const filtered = PLANS.filter((p) =>
    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
    p.planName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <NewPlanModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="space-y-6 animate-fade-in">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#1e293b] leading-tight" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              Exercises
            </h1>
            <p className="text-[14px] text-[#64748b] mt-0.5">{activePlans} active plans · {atRisk} need attention</p>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            New plan
          </Button>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Plans",      value: String(activePlans),    icon: Dumbbell,     bg: "bg-[#ccfbf1]", ic: "text-[#0f766e]" },
            { label: "Avg Adherence",     value: `${avgAdherence}%`,     icon: TrendingUp,   bg: "bg-[#dcfce7]", ic: "text-[#16a34a]" },
            { label: "Patients Enrolled", value: String(PLANS.length),   icon: Users,        bg: "bg-[#dbeafe]", ic: "text-[#2563eb]" },
          ].map(({ label, value, icon: Icon, bg, ic }) => (
            <div key={label} className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-4 hover:border-[#0d9488] transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${ic}`} />
              </div>
              <div>
                <div className="text-[24px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>{value}</div>
                <div className="text-[12px] text-[#94a3b8]">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search bar ── */}
        <div className="relative max-w-[340px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans or patients…"
            className="w-full pl-9 pr-4 py-2 text-[14px] border border-[#e2e8f0] rounded-[10px] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors"
          />
        </div>

        {/* ── Plans table ── */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
          <div className="grid gap-4 px-6 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]" style={{ gridTemplateColumns: "2fr 1.5fr 80px 80px 120px 120px 40px" }}>
            {["Patient", "Plan", "Exercises", "Today", "Adherence", "Status", ""].map((h) => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">{h}</span>
            ))}
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {filtered.map((plan) => (
              <div
                key={plan.id}
                onClick={() => router.push(`/patients/${plan.id.replace("ep", "p")}`)}
                className="grid gap-4 px-6 py-4 items-center hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                style={{ gridTemplateColumns: "2fr 1.5fr 80px 80px 120px 120px 40px" }}
              >
                {/* Patient */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center text-[12px] font-bold flex-shrink-0">
                    {plan.initials}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#1e293b] group-hover:text-[#0d9488] transition-colors">{plan.patientName}</div>
                    <div className="text-[12px] text-[#94a3b8]">{plan.condition}</div>
                  </div>
                </div>

                {/* Plan */}
                <div>
                  <div className="text-[13px] font-medium text-[#1e293b]">{plan.planName}</div>
                  <div className="text-[11px] text-[#94a3b8] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {plan.frequency}
                  </div>
                </div>

                {/* Exercises */}
                <div className="text-[13px] text-[#64748b]">{plan.exercises} total</div>

                {/* Today */}
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className={cn("w-4 h-4", plan.completed === plan.exercises ? "text-[#16a34a]" : "text-[#cbd5e1]")} />
                  <span className="text-[13px] text-[#64748b]">{plan.completed}/{plan.exercises}</span>
                </div>

                {/* Adherence */}
                <div>{adherenceBar(plan.adherence)}</div>

                {/* Status */}
                <div>{statusBadge(plan.status)}</div>

                {/* Arrow */}
                <div className="flex justify-end">
                  <ChevronRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#0d9488] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-[#94a3b8] text-[14px]">
            No plans match your search.
          </div>
        )}
      </div>
    </>
  );
}
