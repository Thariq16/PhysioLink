"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  Building2,
  CreditCard,
  UserPlus,
  ArrowRight,
  Stethoscope,
  ChevronLeft,
  Phone,
  MapPin,
  Link,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Steps ─── */
const STEPS = [
  { id: 0, label: "Welcome",       icon: Sparkles     },
  { id: 1, label: "Your Profile",  icon: Stethoscope  },
  { id: 2, label: "Clinic Setup",  icon: Building2    },
  { id: 3, label: "Subscription",  icon: CreditCard   },
  { id: 4, label: "Invite Patient",icon: UserPlus     },
] as const;

/* ─── Schemas ─── */
const profileSchema = z.object({
  firstName:       z.string().min(1, "Required"),
  lastName:        z.string().min(1, "Required"),
  specialisation:  z.string().min(1, "Required"),
  regNumber:       z.string().min(1, "Registration number required"),
  yearsExp:        z.coerce.number().min(0).max(50),
});

const clinicSchema = z.object({
  clinicName: z.string().min(1, "Clinic name required"),
  address:    z.string().min(1, "Address required"),
  city:       z.string().min(1, "City required"),
  phone:      z.string().min(7, "Valid phone required"),
  website:    z.string().url("Valid URL").or(z.literal("")),
});

const inviteSchema = z.object({
  patientName:  z.string().min(1, "Name required"),
  patientPhone: z.string().min(7, "Phone required"),
  condition:    z.string().min(1, "Condition required"),
});

type ProfileData = z.infer<typeof profileSchema>;
type ClinicData  = z.infer<typeof clinicSchema>;
type InviteData  = z.infer<typeof inviteSchema>;

/* ─── Step indicator bar ─── */
function OnboardStepBar({ current }: { current: number }) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 mb-10">
      {STEPS.map(({ id, label, icon: Icon }) => (
        <div key={id} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
              id < current  ? "bg-[#0d9488] text-white"
              : id === current ? "bg-[#0d9488] text-white ring-4 ring-[#ccfbf1] shadow-sm"
              : "bg-[#f1f5f9] text-[#94a3b8]"
            )}>
              {id < current ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <span className={cn(
              "text-[10px] font-semibold whitespace-nowrap",
              id === current ? "text-[#0d9488]"
              : id < current ? "text-[#0d9488]"
              : "text-[#94a3b8]"
            )}>{label}</span>
          </div>
          {id < STEPS.length - 1 && (
            <div className={cn(
              "w-10 h-0.5 mb-4 transition-all duration-300",
              id < current ? "bg-[#0d9488]" : "bg-[#e2e8f0]"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Field helper ─── */
function FormField({
  label, error, children, hint
}: { label: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">{label}</label>
      {children}
      {hint  && !error && <p className="text-[11px] text-[#94a3b8] mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-[#dc2626] mt-1">{error}</p>}
    </div>
  );
}

function TextInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors bg-white"
    />
  );
}

/* ─── Step 0: Welcome ─── */
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      {/* Animated logo */}
      <div className="w-20 h-20 rounded-2xl bg-[#0d9488] flex items-center justify-center mx-auto shadow-lg shadow-[#0d9488]/25">
        <span className="text-white text-[32px] font-bold" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
          PL
        </span>
      </div>

      <div>
        <h1
          className="text-[32px] font-bold text-[#1e293b] leading-tight"
          style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
        >
          Welcome to PhysioLink
        </h1>
        <p className="text-[16px] text-[#64748b] mt-2 max-w-[440px] mx-auto leading-relaxed">
          Let&apos;s set up your practice in just a few minutes. We&apos;ll walk you through your profile, clinic details, and invite your first patient.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[480px] mx-auto">
        {[
          { emoji: "📅", label: "Smart appointments", desc: "Drag-and-drop calendar" },
          { emoji: "💪", label: "Exercise builder",   desc: "Assign rehab plans fast" },
          { emoji: "💬", label: "Secure messaging",   desc: "Private patient chats" },
        ].map(({ emoji, label, desc }) => (
          <div key={label} className="bg-[#f0fdf9] border border-[#99f6e4] rounded-[12px] p-3 text-center">
            <div className="text-[24px] mb-1">{emoji}</div>
            <p className="text-[12px] font-semibold text-[#0f766e]">{label}</p>
            <p className="text-[10px] text-[#64748b] mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button onClick={onNext} size="lg">
          Get started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-[12px] text-[#94a3b8] mt-3">Takes about 3 minutes · Free 3-month trial included</p>
      </div>
    </div>
  );
}

/* ─── Step 1: Profile ─── */
function ProfileStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileData>,
    defaultValues: { firstName: "", lastName: "", specialisation: "", regNumber: "", yearsExp: 1 },
  });

  const SPECIALISATIONS = [
    "Sports & Rehabilitation",
    "Orthopaedic Physiotherapy",
    "Neurological Physiotherapy",
    "Paediatric Physiotherapy",
    "Cardiopulmonary",
    "Geriatric Physiotherapy",
    "Women's Health",
    "Other",
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h2 className="text-[22px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
          Your professional profile
        </h2>
        <p className="text-[13px] text-[#64748b] mt-1">This is displayed to your patients and on reports.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="First name" error={errors.firstName?.message}>
          <TextInput {...register("firstName")} placeholder="Theebaluxmy" />
        </FormField>
        <FormField label="Last name" error={errors.lastName?.message}>
          <TextInput {...register("lastName")} placeholder="Thangarasu" />
        </FormField>
      </div>

      <FormField label="Specialisation" error={errors.specialisation?.message}>
        <select
          {...register("specialisation")}
          className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] focus:outline-none focus:border-[#0d9488] transition-colors bg-white"
        >
          <option value="">Select specialisation…</option>
          {SPECIALISATIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Registration number" hint="Your SLCPT or equivalent"
          error={errors.regNumber?.message}>
          <TextInput {...register("regNumber")} placeholder="SL-PHYSIO-XXXXX" />
        </FormField>
        <FormField label="Years of experience" error={errors.yearsExp?.message}>
          <TextInput type="number" {...register("yearsExp")} placeholder="5" min={0} max={50} />
        </FormField>
      </div>

      <div className="flex justify-between pt-4 border-t border-[#f1f5f9]">
        <Button type="button" variant="secondary" onClick={onBack} leftIcon={<ChevronLeft className="w-4 h-4" />}>Back</Button>
        <Button type="submit">Continue <ArrowRight className="w-4 h-4 ml-1" /></Button>
      </div>
    </form>
  );
}

/* ─── Step 2: Clinic ─── */
function ClinicStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ClinicData>({
    resolver: zodResolver(clinicSchema) as Resolver<ClinicData>,
    defaultValues: { clinicName: "", address: "", city: "Colombo", phone: "", website: "" },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h2 className="text-[22px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
          Clinic details
        </h2>
        <p className="text-[13px] text-[#64748b] mt-1">Patients will see this information on their app.</p>
      </div>

      <FormField label="Clinic name" error={errors.clinicName?.message}>
        <TextInput {...register("clinicName")} placeholder="Thangarasu Physiotherapy Centre" />
      </FormField>

      <FormField label="Street address" error={errors.address?.message}>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <TextInput {...register("address")} placeholder="45 Galle Road, Colombo 03"
            className="pl-10 w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors bg-white" />
        </div>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="City" error={errors.city?.message}>
          <TextInput {...register("city")} placeholder="Colombo" />
        </FormField>
        <FormField label="Phone" error={errors.phone?.message}>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              {...register("phone")}
              type="tel"
              placeholder="+94 11 234 5678"
              className="w-full pl-10 pr-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors bg-white"
            />
          </div>
        </FormField>
      </div>

      <FormField label="Website" hint="Optional" error={errors.website?.message}>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            {...register("website")}
            type="url"
            placeholder="https://yoursite.lk"
            className="w-full pl-10 pr-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors bg-white"
          />
        </div>
      </FormField>

      <div className="flex justify-between pt-4 border-t border-[#f1f5f9]">
        <Button type="button" variant="secondary" onClick={onBack} leftIcon={<ChevronLeft className="w-4 h-4" />}>Back</Button>
        <Button type="submit">Continue <ArrowRight className="w-4 h-4 ml-1" /></Button>
      </div>
    </form>
  );
}

/* ─── Step 3: Subscription / Stripe ─── */
function SubscriptionStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<"starter" | "professional" | "clinic">("professional");

  const PLANS = [
    {
      id: "starter" as const,
      name: "Starter",
      price: "Free",
      priceSub: "3 months then LKR 990/mo",
      patients: "Up to 10 patients",
      highlights: ["Appointments calendar", "Basic messaging", "Exercise builder (5 plans)"],
      badge: null,
    },
    {
      id: "professional" as const,
      name: "Professional",
      price: "LKR 2,990",
      priceSub: "per month · most popular",
      patients: "Unlimited patients",
      highlights: ["Everything in Starter", "Unlimited exercise plans", "Stripe payments", "SMS reminders", "Analytics"],
      badge: "MOST POPULAR",
    },
    {
      id: "clinic" as const,
      name: "Clinic",
      price: "LKR 7,990",
      priceSub: "per month",
      patients: "Multi-practitioner",
      highlights: ["Everything in Professional", "Up to 5 therapists", "Team dashboard", "Priority support"],
      badge: null,
    },
  ] as const;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[22px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
          Choose your plan
        </h2>
        <p className="text-[13px] text-[#64748b] mt-1">All plans include a 3-month free trial. No credit card required now.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelected(plan.id)}
            className={cn(
              "relative text-left rounded-[14px] border-2 p-4 cursor-pointer transition-all",
              selected === plan.id
                ? "border-[#0d9488] bg-[#f0fdf9]"
                : "border-[#e2e8f0] bg-white hover:border-[#0d9488]/40"
            )}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d9488] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider">
                {plan.badge}
              </span>
            )}
            {selected === plan.id && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-[#0d9488] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <p className="text-[14px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              {plan.name}
            </p>
            <p className="text-[18px] font-bold text-[#0d9488] mt-1">{plan.price}</p>
            <p className="text-[10px] text-[#94a3b8] mb-2">{plan.priceSub}</p>
            <p className="text-[11px] font-semibold text-[#475569] mb-2">{plan.patients}</p>
            <ul className="space-y-1">
              {plan.highlights.map((h) => (
                <li key={h} className="flex items-start gap-1.5 text-[11px] text-[#64748b]">
                  <Check className="w-3 h-3 text-[#0d9488] flex-shrink-0 mt-0.5" />
                  {h}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="bg-[#fef3c7] border border-[#fde68a] rounded-[10px] px-4 py-3 text-[12px] text-[#92400e]">
        ✨ <strong>3-month free trial included.</strong> You won&apos;t be charged until your trial ends. Cancel anytime.
      </div>

      <div className="flex justify-between pt-4 border-t border-[#f1f5f9]">
        <Button type="button" variant="secondary" onClick={onBack} leftIcon={<ChevronLeft className="w-4 h-4" />}>Back</Button>
        <Button onClick={() => { toast.success("Trial activated — Stripe setup skipped for now"); onNext(); }}>
          Start free trial <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/* ─── Step 4: Invite first patient ─── */
function InviteStep({ onBack }: { onBack: () => void }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<InviteData>({
    resolver: zodResolver(inviteSchema) as Resolver<InviteData>,
    defaultValues: { patientName: "", patientPhone: "", condition: "" },
  });

  async function onSubmit(data: InviteData) {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success(`Invite sent to ${data.patientName}`);
  }

  if (sent) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-[#16a34a]" />
        </div>
        <div>
          <h2 className="text-[24px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
            You&apos;re all set! 🎉
          </h2>
          <p className="text-[14px] text-[#64748b] mt-2 max-w-[380px] mx-auto">
            Your invite link has been sent. Your patient will receive an SMS to download the PhysioLink app.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[420px] mx-auto">
          {[
            { label: "Profile", done: true },
            { label: "Clinic",  done: true },
            { label: "Patient", done: true },
          ].map(({ label }) => (
            <div key={label} className="bg-[#f0fdf9] border border-[#99f6e4] rounded-[10px] p-3 text-center">
              <div className="w-7 h-7 bg-[#0d9488] rounded-full flex items-center justify-center mx-auto mb-1">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-[11px] font-semibold text-[#0f766e]">{label} ✓</p>
            </div>
          ))}
        </div>
        <Button size="lg" onClick={() => window.location.href = "/dashboard"}>
          Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <h2 className="text-[22px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
          Invite your first patient
        </h2>
        <p className="text-[13px] text-[#64748b] mt-1">
          They&apos;ll receive an SMS with a link to download the PhysioLink app and connect with you.
        </p>
      </div>

      <FormField label="Patient full name" error={errors.patientName?.message}>
        <TextInput {...register("patientName")} placeholder="e.g. Ravi Jayasuriya" />
      </FormField>

      <FormField label="Mobile number" hint="We'll send an SMS invite" error={errors.patientPhone?.message}>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            {...register("patientPhone")}
            type="tel"
            placeholder="+94 77 XXX XXXX"
            className="w-full pl-10 pr-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors bg-white"
          />
        </div>
      </FormField>

      <FormField label="Condition / reason for referral" error={errors.condition?.message}>
        <textarea
          {...register("condition")}
          rows={3}
          placeholder="e.g. Post-op ACL recovery, right knee"
          className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors resize-none"
        />
      </FormField>

      <div className="bg-[#f0fdf9] border border-[#99f6e4] rounded-[10px] px-4 py-3 flex items-center gap-3">
        <Send className="w-4 h-4 text-[#0d9488] flex-shrink-0" />
        <p className="text-[12px] text-[#0f766e]">
          A secure invite link will be sent via SMS. The patient only needs to tap the link to get started.
        </p>
      </div>

      <div className="flex justify-between pt-4 border-t border-[#f1f5f9]">
        <Button type="button" variant="secondary" onClick={onBack} leftIcon={<ChevronLeft className="w-4 h-4" />}>Back</Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.location.href = "/dashboard"}
          >
            Skip for now
          </Button>
          <Button type="submit" loading={sending} leftIcon={<Send className="w-4 h-4" />}>
            Send invite
          </Button>
        </div>
      </div>
    </form>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function OnboardPage() {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-[8px] bg-[#0d9488] flex items-center justify-center">
          <span className="text-white text-[13px] font-bold" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>PL</span>
        </div>
        <span className="text-[17px] font-bold text-[#1e293b]" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>PhysioLink</span>
      </div>

      {/* Step bar */}
      {step > 0 && <OnboardStepBar current={step} />}

      {/* Card */}
      <div className={cn(
        "bg-white border border-[#e2e8f0] rounded-2xl shadow-sm w-full animate-fade-in",
        step === 3 ? "max-w-[760px]" : "max-w-[560px]"
      )}>
        <div className="p-4 sm:p-7">
          {step === 0 && <WelcomeStep onNext={next} />}
          {step === 1 && <ProfileStep onNext={next} onBack={back} />}
          {step === 2 && <ClinicStep  onNext={next} onBack={back} />}
          {step === 3 && <SubscriptionStep onNext={next} onBack={back} />}
          {step === 4 && <InviteStep onBack={back} />}
        </div>
      </div>

      {/* Progress footer */}
      {step > 0 && step < 4 && (
        <p className="mt-5 text-[12px] text-[#94a3b8]">
          Step {step} of 4 — {STEPS[step].label}
        </p>
      )}
    </div>
  );
}
