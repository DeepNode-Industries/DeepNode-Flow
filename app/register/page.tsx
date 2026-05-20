"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import type { UserPlan } from "@/lib/types";

/* ── Password strength ──────────────────────────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Débil",     color: "#ef4444" };
  if (score === 2) return { score, label: "Regular",   color: "#f59e0b" };
  if (score === 3) return { score, label: "Buena",     color: "#10b981" };
  return             { score, label: "Excelente", color: "#4f46e5" };
}

/* ── Input style helpers ────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor  = "rgba(124,58,237,0.6)";
  e.currentTarget.style.boxShadow    = "0 0 0 3px rgba(124,58,237,0.12)";
};
const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor  = "rgba(255,255,255,0.10)";
  e.currentTarget.style.boxShadow    = "none";
};

export default function RegisterPage() {
  const router    = useRouter();
  const register  = useAuthStore((s) => s.register);
  const session   = useAuthStore((s) => s.session);
  const hydrating = useAuthStore((s) => s.hydrating);
  const hydrate   = useAuthStore((s) => s.hydrate);

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (!hydrating && session) router.replace("/dashboard");
  }, [hydrating, session, router]);

  const strength       = getStrength(password);
  const passwordMatch  = password.length > 0 && confirm.length > 0 && password === confirm;
  const passwordBad    = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim())          { setError("El nombre es requerido."); return; }
    if (!email.trim())         { setError("El email es requerido."); return; }
    if (password.length < 6)   { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (password !== confirm)  { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = register(name, email, password, "starter" as UserPlan);
    setLoading(false);
    if (!result.ok) { setError(result.error); } else { router.push("/dashboard"); }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(140,40,80,0.18) 0%, transparent 55%), #0e0810",
      }}
    >
      {/* ── Top bar ───────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-8 py-5 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
            <Image src="/logo.png" alt="DeepNode" width={28} height={28} className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
            DeepNode Flow
          </span>
        </Link>
        <Link
          href="/login"
          className="text-sm text-white/40 hover:text-white/80 transition-colors"
        >
          ¿Ya tienes cuenta?{" "}
          <span className="text-white/70 font-medium hover:text-white transition-colors">
            Inicia sesión
          </span>
        </Link>
      </header>

      {/* ── Main ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Comienza a automatizar hoy
            </h1>
            <p className="text-sm text-white/40">
              Crea tu cuenta gratis · Sin tarjeta de crédito
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <div className="p-7 space-y-4">

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-3 rounded-lg text-sm text-red-300"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/60">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    placeholder="Juan García"
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/20 outline-none transition-all"
                    style={inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/60">
                    Email de empresa
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="juan@empresa.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/20 outline-none transition-all"
                    style={inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/60">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-11 rounded-lg text-sm text-white placeholder:text-white/20 outline-none transition-all"
                      style={inputBase}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength */}
                  {password.length > 0 && (
                    <div>
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: i <= strength.score ? strength.color : "rgba(255,255,255,0.08)" }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px]" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/60">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConf ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-11 rounded-lg text-sm text-white placeholder:text-white/20 outline-none transition-all"
                      style={{
                        ...inputBase,
                        borderColor: passwordBad
                          ? "rgba(239,68,68,0.5)"
                          : passwordMatch
                          ? "rgba(16,185,129,0.5)"
                          : "rgba(255,255,255,0.10)",
                      }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      {passwordMatch && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConf(!showConf)}
                        className="text-white/25 hover:text-white/60 transition-colors"
                      >
                        {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {passwordBad && (
                    <p className="text-[11px] text-red-400">Las contraseñas no coinciden</p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading || passwordBad}
                  className="w-full py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                  style={{
                    background: loading || passwordBad
                      ? "rgba(99,102,241,0.4)"
                      : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    boxShadow: loading || passwordBad ? "none" : "0 4px 20px rgba(99,102,241,0.35)",
                  }}
                  whileHover={!loading && !passwordBad ? { opacity: 0.92, scale: 1.01 } : {}}
                  whileTap={!loading && !passwordBad ? { scale: 0.99 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span key="l" className="flex items-center justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta…
                      </motion.span>
                    ) : (
                      <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Crear cuenta gratis
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Terms */}
                <p className="text-[11px] text-white/20 text-center leading-relaxed">
                  Al registrarte aceptas nuestros{" "}
                  <a href="#" className="text-white/35 underline underline-offset-2 hover:text-white/60 transition-colors">
                    Términos de servicio
                  </a>{" "}
                  y{" "}
                  <a href="#" className="text-white/35 underline underline-offset-2 hover:text-white/60 transition-colors">
                    Política de privacidad
                  </a>
                </p>
              </form>
            </div>
          </div>

          {/* Self-host section — mirrors N8N */}
          <div
            className="mt-5 p-5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-sm font-semibold text-white/60 mb-1">
              ¿Quieres auto-alojar DeepNode Flow?
            </p>
            <p className="text-xs text-white/30 leading-relaxed">
              La Community Edition es gratuita para individuos con automatizaciones básicas sin necesidad de cuenta.{" "}
              <a
                href="https://github.com/DeepNode-Industries"
                target="_blank"
                rel="noreferrer"
                className="text-white/45 underline underline-offset-2 hover:text-white/65 transition-colors"
              >
                Abrir docs de instalación
              </a>
            </p>
          </div>
        </motion.div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="shrink-0 text-center py-5 px-4">
        <p className="text-xs text-white/15">DeepNode Industries © 2026</p>
      </footer>
    </div>
  );
}
