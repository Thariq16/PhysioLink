"use client";

import { useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Clock,
  CheckCircle2,
  Download,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

// Metadata removed — client component

/* ─── Types ─── */
type TxStatus  = "paid" | "pending" | "refunded";
type TxType    = "consultation" | "appointment" | "subscription";
type TxMethod  = "card" | "payhere" | "cash" | "bank-transfer";

interface Transaction {
  id: string;
  patientName: string;
  initials: string;
  date: string;
  amount: number;
  type: TxType;
  status: TxStatus;
  method: TxMethod;
  invoice: string;
}

/* ─── Mock data ─── */
const TRANSACTIONS: Transaction[] = [
  { id: "tx001", patientName: "Ravi Jayasuriya",   initials: "RJ", date: "10 Apr 2026", amount: 3500, type: "appointment",   status: "paid",     method: "card",          invoice: "INV-001" },
  { id: "tx002", patientName: "Amara Perera",      initials: "AP", date: "9 Apr 2026",  amount: 3500, type: "appointment",   status: "pending",  method: "payhere",       invoice: "INV-002" },
  { id: "tx003", patientName: "Priya Rathnayake", initials: "PR", date: "8 Apr 2026",  amount: 3500, type: "consultation",  status: "paid",     method: "card",          invoice: "INV-003" },
  { id: "tx004", patientName: "Kasun Bandara",    initials: "KB", date: "7 Apr 2026",  amount: 3500, type: "appointment",   status: "paid",     method: "cash",          invoice: "INV-004" },
  { id: "tx005", patientName: "Dinesh Silva",      initials: "DS", date: "6 Apr 2026",  amount: 3500, type: "appointment",   status: "refunded", method: "card",          invoice: "INV-005" },
  { id: "tx006", patientName: "Nilufar Hashim",   initials: "NH", date: "5 Apr 2026",  amount: 3500, type: "consultation",  status: "paid",     method: "bank-transfer", invoice: "INV-006" },
  { id: "tx007", patientName: "Thariq Hamad",     initials: "TH", date: "4 Apr 2026",  amount: 3500, type: "appointment",   status: "paid",     method: "payhere",       invoice: "INV-007" },
  { id: "tx008", patientName: "Ravi Jayasuriya",  initials: "RJ", date: "2 Apr 2026",  amount: 3500, type: "appointment",   status: "paid",     method: "card",          invoice: "INV-008" },
  { id: "tx009", patientName: "Amara Perera",     initials: "AP", date: "1 Apr 2026",  amount: 3500, type: "consultation",  status: "paid",     method: "card",          invoice: "INV-009" },
  { id: "tx010", patientName: "Priya Rathnayake", initials: "PR", date: "28 Mar 2026", amount: 3500, type: "appointment",   status: "pending",  method: "payhere",       invoice: "INV-010" },
  { id: "tx011", patientName: "Dr. Priya",        initials: "ME", date: "1 Apr 2026",  amount: 29900, type: "subscription",  status: "paid",     method: "card",          invoice: "INV-SUB-004" },
];

const PAYOUTS = [
  { period: "1–31 Mar 2026", gross: 91000, fees: 2730, net: 88270, status: "paid",    date: "3 Apr 2026"  },
  { period: "1–28 Feb 2026", gross: 73500, fees: 2205, net: 71295, status: "paid",    date: "3 Mar 2026"  },
  { period: "1 Apr (MTD)",   gross: 42000, fees: 1260, net: 40740, status: "pending", date: "Estimated 3 May" },
];

function statusBadge(s: TxStatus) {
  if (s === "paid")     return <Badge variant="success">✓ Paid</Badge>;
  if (s === "pending")  return <Badge variant="warning">⏳ Pending</Badge>;
  return <Badge variant="error">↩ Refunded</Badge>;
}

function typeBadge(t: TxType) {
  if (t === "consultation") return <Badge variant="teal">Consultation</Badge>;
  if (t === "appointment")  return <Badge variant="slate">Appointment</Badge>;
  return <Badge variant="violet">Subscription</Badge>;
}

function methodLabel(m: TxMethod) {
  const map: Record<TxMethod, string> = {
    card: "💳 Card",
    payhere: "🏦 PayHere",
    cash: "💵 Cash",
    "bank-transfer": "🔁 Bank",
  };
  return map[m];
}

const patient_txs = TRANSACTIONS.filter((t) => t.type !== "subscription");
const totalRevenue  = patient_txs.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0);
const pendingAmount = patient_txs.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);
const aprilRevenue  = patient_txs.filter((t) => t.date.includes("Apr") && t.status === "paid").reduce((s, t) => s + t.amount, 0);
const refundedAmount = patient_txs.filter((t) => t.status === "refunded").reduce((s, t) => s + t.amount, 0);

function fmtLKR(n: number) {
  return `LKR ${n.toLocaleString("en-LK")}`;
}

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState("All status");
  const visibleTxs = TRANSACTIONS.filter((tx) => {
    if (statusFilter === "All status") return true;
    return tx.status === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[28px] font-bold text-[#1e293b] leading-tight"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
          >
            Payments
          </h1>
          <p className="text-[14px] text-[#64748b] mt-0.5">
            {patient_txs.length} transactions · {fmtLKR(totalRevenue)} collected
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" size="sm" leftIcon={<Filter className="w-3.5 h-3.5" />}
            onClick={() => toast.info("Advanced filters coming soon!")}>
            Filter
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => toast.success("CSV export downloaded (demo)!")}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {[
          { label: "Total collected",  value: fmtLKR(totalRevenue),   icon: TrendingUp,    bg: "bg-[#dcfce7]", ic: "text-[#16a34a]", delta: "+12% vs last month", pos: true },
          { label: "April revenue",    value: fmtLKR(aprilRevenue),   icon: ArrowUpRight,  bg: "bg-[#ccfbf1]", ic: "text-[#0f766e]", delta: "Month to date",       pos: true },
          { label: "Pending",          value: fmtLKR(pendingAmount),  icon: Clock,         bg: "bg-[#fef3c7]", ic: "text-[#d97706]", delta: `${patient_txs.filter((t) => t.status === "pending").length} invoices`,  pos: false },
          { label: "Refunded",         value: fmtLKR(refundedAmount), icon: ArrowDownLeft, bg: "bg-[#fee2e2]", ic: "text-[#dc2626]", delta: "1 transaction",        pos: false },
        ].map(({ label, value, icon: Icon, bg, ic, delta, pos }) => (
          <div key={label} className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 hover:border-[#0d9488] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-4.5 h-4.5 ${ic}`} />
              </div>
            </div>
            <div
              className="text-[22px] font-bold text-[#1e293b] leading-tight mb-0.5 tabular-nums"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
            >
              {value}
            </div>
            <div className="text-[11px] text-[#94a3b8] mb-1">{label}</div>
            <div className={`text-[11px] font-semibold ${pos ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
              {delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* ── Transactions table ── */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
          {/* Filters row */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e2e8f0]">
            <h2
              className="text-[15px] font-bold text-[#1e293b]"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
            >
              Transactions
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-[8px] bg-white text-[#64748b] focus:outline-none focus:border-[#0d9488] cursor-pointer"
              >
                <option>All status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Refunded</option>
              </select>
              <select className="px-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-[8px] bg-white text-[#64748b] focus:outline-none focus:border-[#0d9488] cursor-pointer">
                <option>April 2026</option>
                <option>March 2026</option>
                <option>February 2026</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
          {/* Table head */}
          <div className="grid gap-4 px-5 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0]"
            style={{ gridTemplateColumns: "1fr 90px 90px 110px 100px 60px" }}>
            {["Patient", "Date", "Amount", "Type", "Status", ""].map((h) => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#f1f5f9] stagger">
            {visibleTxs.map((tx) => (
              <div
                key={tx.id}
                onClick={() => toast.info(`Invoice ${tx.invoice} · ${tx.patientName} · ${tx.date}`)}
                className="grid gap-4 px-5 py-3.5 items-center hover:bg-[#f8fafc] transition-colors group cursor-pointer"
                style={{ gridTemplateColumns: "1fr 90px 90px 110px 100px 60px" }}
              >
                {/* Patient */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#ccfbf1] text-[#0f766e] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {tx.initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1e293b] group-hover:text-[#0d9488] transition-colors truncate">
                      {tx.patientName}
                    </p>
                    <p className="text-[10px] text-[#94a3b8] font-mono">{tx.invoice}</p>
                  </div>
                </div>

                <span className="text-[12px] text-[#64748b]">{tx.date}</span>

                <span className="text-[13px] font-semibold text-[#1e293b] tabular-nums font-mono">
                  {fmtLKR(tx.amount)}
                </span>

                <div>{typeBadge(tx.type)}</div>

                <div>{statusBadge(tx.status)}</div>

                {/* Method */}
                <span className="text-[11px] text-[#94a3b8]">{methodLabel(tx.method)}</span>
              </div>
            ))}
          </div>
            </div>
          </div>
        </div>

        {/* ── Stripe Payout Panel ── */}
        <div className="space-y-4">
          {/* Stripe connect card */}
          <div className="bg-[#0f172a] rounded-[14px] p-5 text-white relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-[16px] border-[#0d9488]/15 pointer-events-none" />
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-[#2dd4bf]" />
              <span className="text-[13px] font-bold text-white">Stripe Connect</span>
              <span className="ml-auto px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] text-[10px] font-bold rounded-full">ACTIVE</span>
            </div>
            <p className="text-[11px] text-white/50 mb-1">Connected account</p>
            <p className="text-[13px] font-semibold text-white/80">acct_1···XkBfT</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[11px] text-white/50 mb-0.5">Next payout estimate</p>
              <p
                className="text-[20px] font-bold text-[#2dd4bf]"
                style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
              >
                {fmtLKR(40740)}
              </p>
              <p className="text-[11px] text-white/40 mt-0.5">Expected 3 May 2026</p>
            </div>
            <button className="mt-4 w-full py-2 rounded-[8px] bg-[#0d9488] text-white text-[12px] font-semibold hover:bg-[#0f766e] transition-colors cursor-pointer">
              Open Stripe Dashboard ↗
            </button>
          </div>

          {/* Payout history */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#e2e8f0]">
              <h3
                className="text-[14px] font-bold text-[#1e293b]"
                style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
              >
                Payout History
              </h3>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {PAYOUTS.map((p) => (
                <div key={p.period} className="px-5 py-3.5">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-[12px] font-semibold text-[#1e293b]">{p.period}</p>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5">{p.date}</p>
                    </div>
                    {p.status === "paid"
                      ? <Badge variant="success"><CheckCircle2 className="w-2.5 h-2.5" /> Paid</Badge>
                      : <Badge variant="warning"><Clock className="w-2.5 h-2.5" /> Pending</Badge>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2.5">
                    {[
                      { label: "Gross",  value: fmtLKR(p.gross), color: "text-[#1e293b]" },
                      { label: "Fees",   value: `−${fmtLKR(p.fees)}`, color: "text-[#dc2626]" },
                      { label: "Net",    value: fmtLKR(p.net),  color: "text-[#16a34a] font-bold" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center bg-[#f8fafc] rounded-[8px] py-1.5 px-2">
                        <p className="text-[9px] text-[#94a3b8] uppercase tracking-wider">{label}</p>
                        <p className={`text-[11px] font-semibold tabular-nums ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment methods split */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5">
            <h3
              className="text-[13px] font-bold text-[#1e293b] mb-3"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
            >
              By payment method
            </h3>
            {[
              { label: "Card (Stripe)", pct: 64, count: 7,  color: "bg-[#0d9488]" },
              { label: "PayHere",       pct: 27, count: 3,  color: "bg-[#14b8a6]" },
              { label: "Cash",          pct: 9,  count: 1,  color: "bg-[#94a3b8]" },
            ].map(({ label, pct, count, color }) => (
              <div key={label} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#64748b]">{label}</span>
                  <span className="text-[12px] font-semibold text-[#1e293b]">{pct}% · {count} tx</span>
                </div>
                <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
