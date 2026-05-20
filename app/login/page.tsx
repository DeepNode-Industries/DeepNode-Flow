"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router    = useRouter();
  const login     = useAuthStore((s) => s.login);
  const session   = useAuthStore((s) => s.session);
  const hydrating = useAuthStore((s) => s.hydrating);
  const hydrate   = useAuthStore((s) => s.hydrate);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (!hydrating && session) router.replace("/dashboard");
  }, [hydrating, session, router]);

  const fillDemo = () => {
    setEmail("demo@deepnode.app");
    setPassword("demo123");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Completa todos los campos."); return; }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    const result = login(email, password);
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
          href="/register"
          className="text-sm text-white/40 hover:text-white/80 transition-colors"
        >
          ¿Sin cuenta?{" "}
          <span className="text-white/70 font-medium hover:text-white transition-colors">
            Regístrate
          </span>
        </Link>
      </header>

      {/* ── Main ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Inicia sesión en DeepNode
            </h1>
            <p className="text-sm text-white/40">
              Accede a tus flujos de automatización
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
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/60">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="tu@empresa.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/20 outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/60">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      className="text-xs text-white/30 hover:text-white/60 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full px-4 py-3 pr-11 rounded-lg text-sm text-white placeholder:text-white/20 outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                      onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                  }}
                  whileHover={!loading ? { opacity: 0.92, scale: 1.01 } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span key="l" className="flex items-center justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 className="w-4 h-4 animate-spin" /> Verificando…
                      </motion.span>
                    ) : (
                      <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Iniciar sesión
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                <span className="text-xs text-white/20">o</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* Demo */}
              <button
                type="button"
                onClick={fillDemo}
                className="w-full py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white/80 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Usar cuenta demo
              </button>
            </div>
          </div>

          {/* Self-host note */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-white/50 mb-1">
              ¿Quieres auto-alojar DeepNode?
            </p>
            <p className="text-xs text-white/25 leading-relaxed max-w-xs mx-auto">
              La edición Community es gratuita para uso personal con automatizaciones básicas.{" "}
              <a href="https://github.com/DeepNode-Industries" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white/60 underline underline-offset-2 transition-colors">
                Ver docs de instalación
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
