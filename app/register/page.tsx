"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, Loader2, Mail, Lock, User, Zap,
  AlertCircle, ArrowRight, CheckCircle2, Building2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import type { UserPlan } from "@/lib/types";

/* ── Password strength ───────────────────────────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Débil", color: "#ef4444" };
  if (score === 2) return { score, label: "Regular", color: "#f59e0b" };
  if (score === 3) return { score, label: "Buena", color: "#10b981" };
  return { score, label: "Excelente", color: "#06b6d4" };
}

const PLANS: { id: UserPlan; name: string; desc: string; color: string }[] = [
  { id: "starter",    name: "Starter",    desc: "5 workflows · 1K ejecuciones",    color: "#7c3aed" },
  { id: "business",   name: "Business",   desc: "Ilimitados · 50K ejecuciones",    color: "#06b6d4" },
  { id: "enterprise", name: "Enterprise", desc: "Todo ilimitado · SLA 99.9%",      color: "#a855f7" },
];

function Orb({ className, color }: { className: string; color: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{ background: color }}
    />
  );
}

export default function RegisterPage() {
  const router   = useRouter();
  const register = useAuthStore((s) => s.register);
  const session  = useAuthStore((s) => s.session);
  const hydrating = useAuthStore((s) => s.hydrating);
  const hydrate  = useAuthStore((s) => s.hydrate);

  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [plan,      setPlan]      = useState<UserPlan>("starter");
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (!hydrating && session) router.replace("/dashboard");
  }, [hydrating, session, router]);

  const strength = getStrength(password);
  const passwordMatch = password.length > 0 && confirm.length > 0 && password === confirm;
  const passwordMismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("El nombre es requerido."); return; }
    if (!email.trim()) { setError("El email es requerido."); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const result = register(name, email, password, plan);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col overflow-hidden">
      {/* Orbs */}
      <div className="absolute inset-0 dn-grid-bg opacity-20 pointer-events-none" />
      <Orb className="w-[500px] h-[500px] -top-32 -right-32 opacity-[0.06]" color="#a855f7" />
      <Orb className="w-[400px] h-[400px] -bottom-32 -left-32 opacity-[0.05]" color="#06b6d4" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
            <Image src="/logo.png" alt="DeepNode" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-bold text-slate-300 font-[family-name:var(--font-space-grotesk)] group-hover:text-white transition-colors">
            DeepNode Flow
          </span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-purple-400 transition-colors"
        >
          ¿Ya tienes cuenta? <span className="text-purple-400 font-medium">Inicia sesión</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg">

          {/* Title */}
          <div className="text-center mb-7">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/30 border border-white/5">
                  <Image
                    src="/logo.png"
                    alt="DeepNode Industries"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)] mb-1">
              Crear cuenta en{" "}
              <span className="dn-gradient-text">DeepNode Flow</span>
            </h1>
            <p className="text-sm text-slate-500">
              Automatiza tu empresa con IA en minutos
            </p>
          </div>

          {/* Card */}
          <div className="dn-glass-bright rounded-3xl border border-[#1e1e35] shadow-2xl shadow-black/40 overflow-hidden">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            <div className="p-7 space-y-5">

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
                      placeholder="Juan García"
                      autoComplete="name"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Email corporativo
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="juan@empresa.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Passwords row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                      >
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {password.length > 0 && (
                      <div className="mt-1.5">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-all"
                              style={{
                                background: i <= strength.score ? strength.color : "#1e1e35",
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-[10px]" style={{ color: strength.color }}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Confirmar
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input
                        type={showConf ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={`w-full pl-10 pr-10 py-2.5 bg-[#0e0e1c] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 transition-all border ${
                          passwordMismatch
                            ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20"
                            : passwordMatch
                            ? "border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/20"
                            : "border-[#1e1e35] focus:border-purple-500/60 focus:ring-purple-500/20"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConf(!showConf)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                      >
                        {showConf ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {passwordMatch && (
                        <CheckCircle2 className="absolute right-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    {passwordMismatch && (
                      <p className="text-[10px] text-red-400 mt-1">Las contraseñas no coinciden</p>
                    )}
                  </div>
                </div>

                {/* Plan selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    <Building2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    Plan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLANS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlan(p.id)}
                        className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                          plan === p.id
                            ? "border-opacity-60 bg-opacity-10"
                            : "border-[#1e1e35] bg-transparent hover:border-[#2a2a45]"
                        }`}
                        style={
                          plan === p.id
                            ? {
                                borderColor: p.color,
                                backgroundColor: `${p.color}10`,
                              }
                            : {}
                        }
                      >
                        {plan === p.id && (
                          <div
                            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full"
                            style={{ background: p.color }}
                          />
                        )}
                        <span
                          className="text-xs font-semibold"
                          style={{ color: plan === p.id ? p.color : "#94a3b8" }}
                        >
                          {p.name}
                        </span>
                        <span className="text-[9px] text-slate-600 leading-tight">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || passwordMismatch}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creando cuenta…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Crear cuenta gratis
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-600 text-center">
                  Al registrarte aceptas nuestros{" "}
                  <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                    Términos de servicio
                  </a>{" "}
                  y{" "}
                  <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">
                    Política de privacidad
                  </a>
                </p>
              </form>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          </div>

          <p className="text-center text-sm text-slate-600 mt-5">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 px-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-md overflow-hidden opacity-60">
            <Image src="/logo.png" alt="DeepNode" width={16} height={16} className="w-full h-full object-cover" />
          </div>
          <p className="text-[11px] text-slate-600 font-medium">DeepNode Industries © 2026</p>
        </div>
        <p className="text-[10px] text-slate-700">
          Todos los derechos reservados · Plataforma de Automatización con IA
        </p>
      </footer>
    </div>
  );
}
