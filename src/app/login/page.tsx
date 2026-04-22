"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    // TODO: replace with Firebase Auth signInWithEmailAndPassword
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Signed in successfully");
    setLoading(false);
    console.log(data);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[#0f172a] flex-shrink-0 p-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[40px] border-[#0d9488]/10" />
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full border-[24px] border-[#0d9488]/8" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#0d9488] flex items-center justify-center">
            <span className="text-white text-[15px] font-bold"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>PL</span>
          </div>
          <span className="text-white text-[18px] font-bold"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
            PhysioLink
          </span>
        </div>

        {/* Tagline centre */}
        <div className="relative">
          <p className="text-[11px] font-mono tracking-widest text-[#0d9488] uppercase mb-4">
            Physiotherapy Management
          </p>
          <h2 className="text-[36px] font-bold text-white leading-snug mb-4"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
            Your recovery,<br />
            <span className="text-[#2dd4bf]">connected.</span>
          </h2>
          <p className="text-[14px] text-white/60 leading-relaxed">
            Manage patients, appointments, exercise plans, and payments — all in one place built for South Asian practitioners.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative grid grid-cols-2 gap-3">
          {[
            { value: "500+", label: "Physiotherapists" },
            { value: "12k+", label: "Patients managed" },
            { value: "98%",  label: "Satisfaction rate" },
            { value: "3mo",  label: "Free trial" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-[20px] font-bold text-[#2dd4bf]"
                style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                {value}
              </div>
              <div className="text-[11px] text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-[8px] bg-[#0d9488] flex items-center justify-center">
            <span className="text-white text-[13px] font-bold">PL</span>
          </div>
          <span className="text-[17px] font-bold text-[#1e293b]"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
            PhysioLink
          </span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#1e293b] leading-tight"
              style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              Sign in
            </h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] mb-1.5 tracking-wide">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                <input
                  type="email"
                  placeholder="dr.priya@clinic.lk"
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-2.5 text-[14px] border rounded-[10px] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none transition-colors ${
                    errors.email
                      ? "border-[#dc2626] focus:border-[#dc2626]"
                      : "border-[#e2e8f0] focus:border-[#0d9488]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[12px] text-[#dc2626] mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-[#475569] tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] text-[#0d9488] hover:text-[#0f766e] font-medium transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full px-4 py-2.5 pr-10 text-[14px] border rounded-[10px] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none transition-colors ${
                    errors.password
                      ? "border-[#dc2626] focus:border-[#dc2626]"
                      : "border-[#e2e8f0] focus:border-[#0d9488]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-[#dc2626] mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              loading={loading}
            >
              Sign in
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#e2e8f0]" />
            <span className="text-[12px] text-[#94a3b8]">or</span>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>

          {/* Register CTA */}
          <p className="text-center text-[13px] text-[#64748b]">
            New to PhysioLink?{" "}
            <a href="/register" className="text-[#0d9488] font-semibold hover:text-[#0f766e] transition-colors">
              Create an account
            </a>
          </p>

          {/* Trial note */}
          <div className="mt-6 bg-[#f0fdf9] border border-[#99f6e4] rounded-[10px] px-4 py-3 text-center">
            <p className="text-[12px] text-[#0f766e]">
              <strong>3-month free trial</strong> · No credit card required on sign-up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
