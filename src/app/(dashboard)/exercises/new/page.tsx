"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  GripVertical,
  Play,
  X,
  Dumbbell,
  User,
  Eye,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─────────────────────────── Schema ──────────────────────────── */
const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.coerce.number().min(1).max(20),
  reps: z.coerce.number().min(1).max(100),
  restSec: z.coerce.number().min(0).max(300),
  frequency: z.string().min(1, "Frequency required"),
  videoUrl: z.string().url("Enter a valid URL").or(z.literal("")),
  notes: z.string(),
});

const planSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  planName: z.string().min(1, "Plan name is required"),
  startDate: z.string().min(1, "Start date required"),
  durationWeeks: z.coerce.number().min(1).max(52),
  exercises: z.array(exerciseSchema).min(1, "Add at least one exercise"),
  notes: z.string(),
});

type PlanData = z.infer<typeof planSchema>;

/* ─────────────────────────── Constants ───────────────────────── */
const PATIENTS = [
  { id: "p1", name: "Ravi Jayasuriya",   condition: "Knee ligament tear" },
  { id: "p2", name: "Amara Perera",      condition: "Lower back pain" },
  { id: "p3", name: "Dinesh Silva",      condition: "Rotator cuff injury" },
  { id: "p4", name: "Priya Rathnayake", condition: "Ankle sprain (Grade 2)" },
  { id: "p5", name: "Kasun Bandara",    condition: "Post-op ACL recovery" },
];

const FREQ_OPTIONS = ["Daily", "2x / week", "3x / week", "4x / week", "5x / week", "Every other day"];

const PRESET_EXERCISES = [
  { name: "Quad stretch",         sets: 3, reps: 12, restSec: 30, frequency: "Daily",      videoUrl: "", notes: "" },
  { name: "Hip bridge",           sets: 3, reps: 10, restSec: 30, frequency: "Daily",      videoUrl: "", notes: "" },
  { name: "Calf raises",          sets: 2, reps: 15, restSec: 20, frequency: "Daily",      videoUrl: "", notes: "" },
  { name: "Side step band",       sets: 2, reps: 20, restSec: 30, frequency: "3x / week", videoUrl: "", notes: "" },
  { name: "Shoulder external rot",sets: 3, reps: 12, restSec: 45, frequency: "3x / week", videoUrl: "", notes: "" },
  { name: "Bird-dog",             sets: 3, reps: 10, restSec: 30, frequency: "Daily",      videoUrl: "", notes: "" },
  { name: "Terminal knee ext",    sets: 3, reps: 15, restSec: 20, frequency: "Daily",      videoUrl: "", notes: "" },
  { name: "Prone hip extension",  sets: 3, reps:  8, restSec: 40, frequency: "3x / week", videoUrl: "", notes: "" },
];

const STEPS = ["Patient & Plan", "Build Exercises", "Preview & Send"] as const;
type Step = 0 | 1 | 2;

/* ─────────────────────────── Step Indicator ──────────────────── */
function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          {/* Circle */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all",
              i < step ? "bg-[#0d9488] text-white"
              : i === step ? "bg-[#0d9488] text-white ring-4 ring-[#ccfbf1]"
              : "bg-[#f1f5f9] text-[#94a3b8]"
            )}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={cn(
              "text-[10px] mt-1 font-semibold whitespace-nowrap",
              i === step ? "text-[#0d9488]" : i < step ? "text-[#0d9488]" : "text-[#94a3b8]"
            )}>
              {label}
            </span>
          </div>

          {/* Connector line */}
          {i < STEPS.length - 1 && (
            <div className={cn(
              "h-0.5 w-16 mx-2 mb-4 transition-all",
              i < step ? "bg-[#0d9488]" : "bg-[#e2e8f0]"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── Exercise Card ───────────────────── */
function ExerciseCard({
  index,
  register,
  errors,
  onRemove,
  value,
}: {
  index: number;
  register: ReturnType<typeof useForm<PlanData>>["register"];
  errors: unknown;
  onRemove: () => void;
  value: PlanData["exercises"][number];
}) {
  const [showVideo, setShowVideo] = useState(false);
  const errs = (errors as Record<string, Record<number, Record<string, { message?: string }>>>)?.exercises?.[index];

  // Extract YouTube embed URL
  function getYTEmbed(url: string) {
    const match = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden group hover:border-[#0d9488] transition-colors">
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
        <GripVertical className="w-4 h-4 text-[#cbd5e1] cursor-grab flex-shrink-0" />
        <div className="w-7 h-7 rounded-lg bg-[#ccfbf1] flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] font-bold text-[#0f766e]">{index + 1}</span>
        </div>
        <input
          {...register(`exercises.${index}.name`)}
          placeholder="Exercise name…"
          className="flex-1 bg-transparent text-[14px] font-semibold text-[#1e293b] placeholder:text-[#94a3b8] placeholder:font-normal focus:outline-none"
        />
        <button
          type="button"
          onClick={onRemove}
          className="w-7 h-7 rounded-lg text-[#94a3b8] hover:bg-[#fee2e2] hover:text-[#dc2626] flex items-center justify-center transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Sets / Reps / Rest */}
        <div className="grid grid-cols-3 gap-3">
          {([
            { field: "sets" as const,    label: "Sets",      min: 1,  max: 20,  placeholder: "3" },
            { field: "reps" as const,    label: "Reps",      min: 1,  max: 100, placeholder: "12" },
            { field: "restSec" as const, label: "Rest (sec)", min: 0, max: 300, placeholder: "30" },
          ]).map(({ field, label, min, max, placeholder }) => (
            <div key={field}>
              <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1 uppercase tracking-wider">{label}</label>
              <input
                type="number"
                min={min}
                max={max}
                {...register(`exercises.${index}.${field}`)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-[14px] text-[#1e293b] text-center font-mono focus:outline-none focus:border-[#0d9488] transition-colors bg-[#f8fafc]"
              />
            </div>
          ))}
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wider">Frequency</label>
          <div className="flex flex-wrap gap-1.5">
            {FREQ_OPTIONS.map((f) => (
              <label key={f} className="cursor-pointer">
                <input type="radio" {...register(`exercises.${index}.frequency`)} value={f} className="sr-only" />
                <span className={cn(
                  "inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                  value.frequency === f
                    ? "bg-[#0d9488] text-white border-[#0d9488]"
                    : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#0d9488] hover:text-[#0d9488]"
                )}>
                  {f}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1 uppercase tracking-wider">Video URL <span className="font-normal normal-case text-[#94a3b8]">(YouTube)</span></label>
          <div className="flex gap-2">
            <input
              {...register(`exercises.${index}.videoUrl`)}
              placeholder="https://youtube.com/watch?v=…"
              className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-[13px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors"
            />
            {value.videoUrl && getYTEmbed(value.videoUrl) && (
              <button
                type="button"
                onClick={() => setShowVideo(!showVideo)}
                className="px-3 py-2 bg-[#f0fdf9] border border-[#99f6e4] text-[#0d9488] rounded-[8px] text-[12px] font-medium flex items-center gap-1.5 hover:bg-[#ccfbf1] transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                Preview
              </button>
            )}
          </div>
          {errs?.videoUrl?.message && (
            <p className="text-[11px] text-[#dc2626] mt-1">{errs.videoUrl.message}</p>
          )}
          {/* Embedded preview */}
          {showVideo && value.videoUrl && getYTEmbed(value.videoUrl) && (
            <div className="mt-2 rounded-[10px] overflow-hidden border border-[#e2e8f0] relative">
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/50 rounded-full text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <iframe
                src={getYTEmbed(value.videoUrl)!}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1 uppercase tracking-wider">Notes</label>
          <input
            {...register(`exercises.${index}.notes`)}
            placeholder="Any cues or modifications…"
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[8px] text-[13px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Preview Step ───────────────────── */
function PreviewStep({ data }: { data: PlanData }) {
  const patient = PATIENTS.find((p) => p.id === data.patientId);

  return (
    <div className="space-y-5">
      {/* Plan header */}
      <div className="bg-[#f0fdf9] border border-[#99f6e4] rounded-[14px] p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0d9488] flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-[#1e293b]"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              {data.planName || "Untitled Plan"}
            </h2>
            <p className="text-[13px] text-[#64748b] mt-0.5">
              {patient?.name} · {patient?.condition}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="teal">{data.exercises.length} exercises</Badge>
              <Badge variant="slate">{data.durationWeeks} weeks</Badge>
              <Badge variant="slate">Starts {data.startDate}</Badge>
            </div>
          </div>
        </div>
        {data.notes && (
          <p className="text-[13px] text-[#64748b] mt-4 pt-4 border-t border-[#99f6e4]">{data.notes}</p>
        )}
      </div>

      {/* Exercise list */}
      <div className="space-y-3">
        {data.exercises.map((ex, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-[12px] px-5 py-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#ccfbf1] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[12px] font-bold text-[#0f766e]">{i + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-[14px] font-semibold text-[#1e293b]">{ex.name || "Unnamed exercise"}</h3>
                  <Badge variant="teal">{ex.frequency}</Badge>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-[#64748b]">
                  <span className="font-mono"><strong className="text-[#1e293b]">{ex.sets}</strong> sets</span>
                  <span className="font-mono"><strong className="text-[#1e293b]">{ex.reps}</strong> reps</span>
                  <span className="font-mono"><strong className="text-[#1e293b]">{ex.restSec}s</strong> rest</span>
                </div>
                {ex.notes && <p className="text-[12px] text-[#94a3b8] mt-1">{ex.notes}</p>}
                {ex.videoUrl && (
                  <a href={ex.videoUrl} target="_blank" rel="noreferrer"
                    className="text-[12px] text-[#0d9488] font-medium mt-1 inline-flex items-center gap-1 hover:text-[#0f766e]">
                    <Play className="w-3 h-3" /> Watch video
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Page ───────────────────────── */
export default function ExerciseBuilderPage() {
  const [step, setStep] = useState<Step>(0);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PlanData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      patientId: "",
      planName: "",
      startDate: new Date().toISOString().split("T")[0],
      durationWeeks: 4,
      exercises: [{ name: "", sets: 3, reps: 12, restSec: 30, frequency: "Daily", videoUrl: "", notes: "" }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "exercises" });
  const formData = watch();

  async function nextStep() {
    let valid = false;
    if (step === 0) {
      valid = await trigger(["patientId", "planName", "startDate", "durationWeeks"]);
    } else if (step === 1) {
      valid = await trigger(["exercises"]);
    }
    if (valid) setStep((s) => (s + 1) as Step);
  }

  async function onSubmit(data: PlanData) {
    setSending(true);
    // TODO: save to Firestore + send push notification
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast.success(`Exercise plan sent to ${PATIENTS.find((p) => p.id === data.patientId)?.name}`);
  }

  const selectedPatient = PATIENTS.find((p) => p.id === formData.patientId);

  return (
    <div className="animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#1e293b] leading-tight"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
            Exercise Plan Builder
          </h1>
          <p className="text-[14px] text-[#64748b] mt-0.5">
            Create and assign a personalised rehabilitation programme
          </p>
        </div>
        {selectedPatient && (
          <div className="flex items-center gap-2 bg-[#f0fdf9] border border-[#99f6e4] rounded-[10px] px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-[#ccfbf1] text-[#0f766e] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
              {selectedPatient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#0f766e]">{selectedPatient.name}</p>
              <p className="text-[10px] text-[#0d9488]">{selectedPatient.condition}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Step indicator ── */}
      <div className="flex justify-center mb-8">
        <StepIndicator step={step} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Step 0: Patient & Plan details ──────────────────── */}
        {step === 0 && (
          <div className="max-w-[620px] mx-auto space-y-5">
            {/* Patient selector */}
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5">
              <h2 className="text-[14px] font-bold text-[#1e293b] mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                <User className="w-4 h-4 text-[#0d9488]" /> Assign to Patient
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {PATIENTS.map((p) => {
                  const selected = formData.patientId === p.id;
                  return (
                    <label key={p.id} className="cursor-pointer">
                      <input type="radio" {...register("patientId")} value={p.id} className="sr-only" />
                      <div className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-[10px] border transition-all",
                        selected
                          ? "bg-[#f0fdf9] border-[#0d9488]"
                          : "border-[#e2e8f0] hover:border-[#0d9488] hover:bg-[#f0fdf9]"
                      )}>
                        <div className="w-8 h-8 rounded-full bg-[#ccfbf1] text-[#0f766e] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="text-[13.5px] font-semibold text-[#1e293b]">{p.name}</p>
                          <p className="text-[11px] text-[#94a3b8]">{p.condition}</p>
                        </div>
                        {selected && <Check className="w-4 h-4 text-[#0d9488] flex-shrink-0" />}
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.patientId && (
                <p className="text-[12px] text-[#dc2626] mt-2">{errors.patientId.message}</p>
              )}
            </div>

            {/* Plan details */}
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 space-y-4">
              <h2 className="text-[14px] font-bold text-[#1e293b] flex items-center gap-2"
                style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                <Dumbbell className="w-4 h-4 text-[#0d9488]" /> Plan Details
              </h2>

              <div>
                <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Plan name</label>
                <input
                  {...register("planName")}
                  placeholder="e.g. Knee Rehab Phase 2"
                  className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors"
                />
                {errors.planName && <p className="text-[12px] text-[#dc2626] mt-1">{errors.planName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Start date</label>
                  <input
                    type="date"
                    {...register("startDate")}
                    className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] focus:outline-none focus:border-[#0d9488] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">Duration</label>
                  <div className="flex gap-2">
                    {[2, 4, 6, 8].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => {}}
                        className={cn(
                          "flex-1 py-2 rounded-[8px] text-[12px] font-medium border transition-all cursor-pointer",
                          formData.durationWeeks === w
                            ? "bg-[#0d9488] text-white border-[#0d9488]"
                            : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#0d9488]"
                        )}
                        {...{ onClick: () => { void 0; } }}
                      >
                        {w}w
                      </button>
                    ))}
                  </div>
                  <input type="hidden" {...register("durationWeeks")} />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">
                  Notes <span className="font-normal text-[#94a3b8]">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  {...register("notes")}
                  placeholder="Overall guidance for this plan…"
                  className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Build Exercises ──────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Presets */}
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-4">
              <p className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3">Quick add from presets</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_EXERCISES.map((ex) => (
                  <button
                    key={ex.name}
                    type="button"
                    onClick={() => append(ex)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0fdf9] border border-[#99f6e4] text-[#0f766e] text-[12px] font-medium rounded-lg hover:bg-[#ccfbf1] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    {ex.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise cards */}
            {fields.length === 0 ? (
              <div className="text-center py-16 bg-white border-2 border-dashed border-[#e2e8f0] rounded-[14px]">
                <Dumbbell className="w-10 h-10 text-[#cbd5e1] mx-auto mb-3" />
                <p className="text-[14px] font-semibold text-[#64748b]">No exercises yet</p>
                <p className="text-[13px] text-[#94a3b8] mb-4">Use the presets above or add your own</p>
                <Button
                  type="button"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => append({ name: "", sets: 3, reps: 12, restSec: 30, frequency: "Daily", videoUrl: "", notes: "" })}
                >
                  Add exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <ExerciseCard
                    key={field.id}
                    index={index}
                    register={register}
                    errors={errors}
                    onRemove={() => remove(index)}
                    value={formData.exercises[index] ?? { name: "", sets: 3, reps: 12, restSec: 30, frequency: "Daily", videoUrl: "", notes: "" }}
                  />
                ))}
              </div>
            )}

            {/* Add exercise button */}
            <button
              type="button"
              onClick={() => append({ name: "", sets: 3, reps: 12, restSec: 30, frequency: "Daily", videoUrl: "", notes: "" })}
              className="w-full py-3.5 border-2 border-dashed border-[#e2e8f0] rounded-[14px] text-[13px] font-semibold text-[#94a3b8] hover:border-[#0d9488] hover:text-[#0d9488] hover:bg-[#f0fdf9] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add another exercise
            </button>

            {errors.exercises?.message && (
              <p className="text-[12px] text-[#dc2626]">{errors.exercises.message as string}</p>
            )}
          </div>
        )}

        {/* ── Step 2: Preview & Send ───────────────────────────── */}
        {step === 2 && <PreviewStep data={formData} />}

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#e2e8f0]">
          {step > 0 ? (
            <Button
              type="button"
              variant="secondary"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setStep((s) => (s - 1) as Step)}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <Button
              type="button"
              onClick={nextStep}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              loading={sending}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Send to patient
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
