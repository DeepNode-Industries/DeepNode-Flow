"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, Loader2, Mail, Lock, Zap,
  AlertCircle, ArrowRight, Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

/* ── Floating orb ────────────────────────────────────────────────── */
function Orb({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{ background: color }}
    />
  );
}

export default function LoginPage() {
  const router   = useRouter();
  const login    = useAuthStore((s) => s.login);
  const session  = useAuthStore((s) => s.session);
  const hydrating = useAuthStore((s) => s.hydrating);
  const hydrate  = useAuthStore((s) => s.hydrate);

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  /* Restore session on mount */
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  /* Already logged in → go to dashboard */
  useEffect(() => {
    if (!hydrating && session) router.replace("/dashboard");
  }, [hydrating, session, router]);

  /* Demo quick-fill */
  const fillDemo = () => {
    setEmail("demo@deepnode.app");
    setPassword("demo123");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    setError("");

    /* Small artificial delay for feel */
    await new Promise((r) => setTimeout(r, 600));

    const result = login(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col overflow-hidden">
      {/* ── Background effects ────────────────────────────────────── */}
      <div className="absolute inset-0 dn-grid-bg opacity-20 pointer-events-none" />
      <Orb className="w-[600px] h-[600px] -top-40 -left-40 opacity-[0.06]" color="#7c3aed" />
      <Orb className="w-[500px] h-[500px] -bottom-40 -right-40 opacity-[0.05]" color="#06b6d4" />
      <Orb className="w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]" color="#a855f7" />

      {/* ── Top brand bar ─────────────────────────────────────────── */}
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
          href="/register"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-purple-400 transition-colors"
        >
          ¿Sin cuenta? <span className="text-purple-400 font-medium">Regístrate</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
        </Link>
      </header>

      {/* ── Main ──────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* Logo + title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/25 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/40 border border-white/5">
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
              Bienvenido a{" "}
              <span className="dn-gradient-text">DeepNode Flow</span>
            </h1>
            <p className="text-sm text-slate-500">
              Inicia sesión en tu cuenta para continuar
            </p>
          </div>

          {/* Card */}
          <div className="dn-glass-bright rounded-3xl border border-[#1e1e35] shadow-2xl shadow-black/40 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="p-8">

              {/* Demo CTA */}
              <button
                type="button"
                onClick={fillDemo}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all group mb-6"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shrink-0 shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-sm font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">
                    Usar cuenta Demo
                  </div>
                  <div className="text-[11px] text-slate-600">
                    demo@deepnode.app · demo123
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-[#1e1e35]" />
                <span className="text-[11px] text-slate-600 font-medium uppercase tracking-wider">
                  o con tu cuenta
                </span>
                <div className="flex-1 h-px bg-[#1e1e35]" />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="tu@empresa.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-400">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      className="text-[11px] text-purple-500 hover:text-purple-400 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-3 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificando…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Iniciar sesión
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom accent */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-600 mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Crear cuenta gratis
            </Link>
          </p>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
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
