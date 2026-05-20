"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X, Zap, Star, Building2, Crown,
  CreditCard, Shield, RefreshCw, ArrowRight,
  Users, Activity, Workflow, Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PRICING_PLANS } from "@/lib/pricing";
import { useAuthStore } from "@/store/auth-store";
import type { UserPlan, BillingInterval } from "@/lib/types";

/* ── Plan icons ──────────────────────────────────────────────────── */
const PLAN_ICONS: Record<UserPlan, React.ElementType> = {
  starter:    Zap,
  pro:        Star,
  business:   Building2,
  enterprise: Crown,
};

/* ── FAQ data ────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. Cancela cuando quieras desde el portal de facturación. Tendrás acceso hasta el final del período pagado.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, AMEX, Discover) a través de Stripe. Tus datos están 100% seguros.",
  },
  {
    q: "¿Hay prueba gratuita?",
    a: "El plan Starter es gratuito para siempre con 3 workflows y 100 ejecuciones/mes. No necesitas tarjeta de crédito.",
  },
  {
    q: "¿Qué pasa si supero el límite de ejecuciones?",
    a: "Te notificamos cuando te acerques al límite. Los workflows pausan hasta el siguiente ciclo o puedes hacer upgrade en cualquier momento.",
  },
  {
    q: "¿Puedo cambiar de plan?",
    a: "Sí, puedes hacer upgrade o downgrade en cualquier momento. El cambio se refleja inmediatamente con un ajuste prorrateado.",
  },
  {
    q: "¿Ofrecen descuentos para startups o ONGs?",
    a: "Sí. Contáctanos en enterprise@deepnode.app y evaluamos tu caso con precios especiales.",
  },
];

/* ── Trusted by logos (placeholder) ─────────────────────────────── */
const TRUSTED = ["Acme Corp", "TechStart", "Innovate Inc", "DataFlow", "AutoSys", "CloudOps"];

export default function PricingPage() {
  const router   = useRouter();
  const session  = useAuthStore((s) => s.session);
  const [interval, setInterval] = useState<BillingInterval>("annual");
  const [loading, setLoading]   = useState<string | null>(null);
  const [openFaq, setOpenFaq]   = useState<number | null>(null);

  const annualSaving = 2; // months free on annual

  async function handleSubscribe(plan: UserPlan) {
    if (plan === "starter") {
      router.push("/register");
      return;
    }
    if (plan === "enterprise") {
      window.location.href = "mailto:enterprise@deepnode.app?subject=Enterprise%20Plan%20-%20DeepNode%20Flow";
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          interval,
          email: session?.email,
        }),
      });

      interface CheckoutResult { url?: string; error?: string }
      const data = (await res.json()) as CheckoutResult;

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Error al crear sesión de pago");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <DashboardLayout noPadding>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-8 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a5b4fc",
            }}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Precios simples y transparentes · Cancela cuando quieras
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Elige tu plan
            <br />
            <span className="dn-gradient-text-primary">y automatiza todo</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Desde gratis hasta enterprise. Sin sorpresas. Tarjeta crédito o débito.
          </p>
        </motion.div>

        {/* ── Interval toggle ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <button
            onClick={() => setInterval("monthly")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              interval === "monthly"
                ? "text-white"
                : "text-white/40 hover:text-white/70"
            }`}
            style={interval === "monthly" ? {
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            } : {}}
          >
            Mensual
          </button>

          <div
            onClick={() => setInterval(interval === "monthly" ? "annual" : "monthly")}
            className="relative w-12 h-6 rounded-full cursor-pointer transition-all"
            style={{
              background: interval === "annual"
                ? "linear-gradient(135deg, #6366f1, #06b6d4)"
                : "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            role="switch"
            aria-checked={interval === "annual"}
          >
            <motion.div
              animate={{ x: interval === "annual" ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
            />
          </div>

          <button
            onClick={() => setInterval("annual")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              interval === "annual"
                ? "text-white"
                : "text-white/40 hover:text-white/70"
            }`}
            style={interval === "annual" ? {
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            } : {}}
          >
            Anual
            <span
              className="px-1.5 py-0.5 rounded-md text-xs font-bold"
              style={{
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#34d399",
              }}
            >
              -{annualSaving} meses gratis
            </span>
          </button>
        </motion.div>
      </section>

      {/* ── Pricing cards ────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {PRICING_PLANS.map((plan, i) => {
            const PlanIcon   = PLAN_ICONS[plan.id];
            const isCurrent  = session?.plan === plan.id;
            const price      = interval === "annual" ? plan.annualPrice : plan.monthlyPrice;
            const monthlyEq  = plan.annualPrice ? Math.round(plan.annualPrice / 12) : null;
            const isLoading  = loading === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative flex flex-col rounded-2xl overflow-hidden"
                style={{
                  background: plan.popular
                    ? `linear-gradient(160deg, rgba(6,182,212,0.12), rgba(59,130,246,0.08))`
                    : "rgba(255,255,255,0.03)",
                  border: plan.popular
                    ? `1px solid rgba(6,182,212,0.35)`
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: plan.popular
                    ? "0 0 40px rgba(6,182,212,0.1), 0 24px 48px rgba(0,0,0,0.4)"
                    : "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div
                    className="absolute top-0 inset-x-0 h-0.5"
                    style={{ background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)` }}
                  />
                )}
                {plan.popular && (
                  <div
                    className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b-lg text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${plan.color}, ${plan.accentColor})`,
                      color: "#fff",
                    }}
                  >
                    Más popular
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Plan header */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${plan.color}30, ${plan.accentColor}15)`,
                        border: `1px solid ${plan.color}30`,
                      }}
                    >
                      <PlanIcon className="w-4.5 h-4.5" style={{ color: plan.color, width: 18, height: 18 }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{plan.name}</p>
                      <p className="text-xs text-white/40 leading-tight">{plan.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    {price === null ? (
                      <div>
                        <p className="text-3xl font-black text-white">Custom</p>
                        <p className="text-sm text-white/40 mt-0.5">Contactar ventas</p>
                      </div>
                    ) : price === 0 ? (
                      <div>
                        <p className="text-3xl font-black text-white">Gratis</p>
                        <p className="text-sm text-white/40 mt-0.5">Para siempre</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-end gap-1">
                          <span className="text-white/40 text-lg font-semibold self-start mt-1">$</span>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={`${plan.id}-${interval}`}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              transition={{ duration: 0.2 }}
                              className="text-4xl font-black text-white leading-none"
                            >
                              {interval === "annual" ? monthlyEq : price}
                            </motion.span>
                          </AnimatePresence>
                          <span className="text-white/40 text-sm mb-1">/ mes</span>
                        </div>
                        {interval === "annual" && (
                          <p className="text-xs text-emerald-400 mt-1">
                            ${price} facturado anualmente · Ahorra ${(price! * 12) - price!}/año
                          </p>
                        )}
                        {interval === "monthly" && (
                          <p className="text-xs text-white/30 mt-1">
                            ${monthlyEq}/mes con plan anual
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Limits strip */}
                  <div
                    className="flex gap-2 mb-5 p-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="flex-1 text-center">
                      <p className="text-[11px] text-white/30">Workflows</p>
                      <p className="text-sm font-bold text-white">
                        {plan.limits.workflows === "unlimited" ? "∞" : plan.limits.workflows}
                      </p>
                    </div>
                    <div className="w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="flex-1 text-center">
                      <p className="text-[11px] text-white/30">Ejecuciones</p>
                      <p className="text-sm font-bold text-white">
                        {plan.limits.executions === "unlimited"
                          ? "∞"
                          : plan.limits.executions >= 1000
                          ? `${plan.limits.executions / 1000}K`
                          : plan.limits.executions}
                      </p>
                    </div>
                    <div className="w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="flex-1 text-center">
                      <p className="text-[11px] text-white/30">Usuarios</p>
                      <p className="text-sm font-bold text-white">
                        {plan.limits.teamMembers === "unlimited" ? "∞" : plan.limits.teamMembers}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2">
                        {feat.included ? (
                          <Check
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: plan.color }}
                          />
                        ) : (
                          <X className="w-4 h-4 shrink-0 mt-0.5 text-white/20" />
                        )}
                        <span
                          className={`text-sm leading-snug ${
                            feat.included ? "text-white/80" : "text-white/25"
                          }`}
                        >
                          {feat.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading || isCurrent}
                    className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={
                      isCurrent
                        ? {
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.4)",
                          }
                        : plan.id === "enterprise"
                        ? {
                            background: `linear-gradient(135deg, ${plan.color}20, ${plan.accentColor}10)`,
                            border: `1px solid ${plan.color}40`,
                            color: plan.accentColor,
                          }
                        : {
                            background: `linear-gradient(135deg, ${plan.color}, ${plan.accentColor})`,
                            boxShadow: `0 4px 20px ${plan.color}30`,
                            color: "#fff",
                          }
                    }
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : isCurrent ? (
                      "Plan actual"
                    ) : plan.id === "starter" ? (
                      <>Empezar gratis <ArrowRight className="w-3.5 h-3.5" /></>
                    ) : plan.id === "enterprise" ? (
                      <>Contactar ventas <ArrowRight className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Suscribirse <CreditCard className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Trust badges ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/30 text-xs"
        >
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Pagos cifrados con SSL
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
            Procesado por Stripe
          </span>
          <span className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
            Cancela en cualquier momento
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            Sin contratos de permanencia
          </span>
        </motion.div>
      </section>

      {/* ── Metrics / value props ─────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              ¿Por qué DeepNode Flow?
            </h2>
            <p className="text-white/40">
              Más potente que N8N. Más sencillo que Make. Más económico que Zapier.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Workflow,   value: "21+",    label: "Tipos de nodos",        color: "#6366f1" },
              { icon: Sparkles,   value: "5",      label: "Modelos de AI",          color: "#a855f7" },
              { icon: Activity,   value: "99.9%",  label: "Uptime garantizado",     color: "#06b6d4" },
              { icon: Users,      value: "10x",    label: "Más rápido que N8N",    color: "#10b981" },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="p-5 rounded-2xl text-center"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}
                >
                  <m.icon className="w-5 h-5" style={{ color: m.color }} />
                </div>
                <p className="text-2xl font-black text-white mb-1">{m.value}</p>
                <p className="text-xs text-white/40">{m.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Comparison table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-white/60">Característica</th>
                    {["DeepNode Flow", "Zapier", "Make", "N8N"].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-sm font-bold text-center ${
                          h === "DeepNode Flow" ? "text-cyan-400" : "text-white/40"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Precio inicial",         "$0/mes",      "$20/mes",    "$9/mes",    "$0 (self-host)"],
                    ["Sin límite workflows",   "✓ Pro+",      "✗",          "✗",         "✓"],
                    ["AI nativa integrada",    "✓ 5 modelos", "✗",          "Parcial",   "Parcial"],
                    ["Telegram nativo",        "✓",           "✗",          "✗",         "✓"],
                    ["Setup en minutos",       "✓",           "✓",          "Complejo",  "Complejo"],
                    ["Modo demo / sandbox",    "✓",           "✗",          "✗",         "✗"],
                    ["Deploy en la nube",      "✓ Incluido",  "✓",          "✓",         "Self-host"],
                    ["Soporte en Español",     "✓ Nativo",    "✗",          "Parcial",   "✗"],
                  ].map(([feat, ...vals], ri) => (
                    <tr
                      key={ri}
                      style={{
                        background: ri % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                        borderTop: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td className="px-5 py-3 text-sm text-white/60">{feat}</td>
                      {vals.map((v, vi) => (
                        <td
                          key={vi}
                          className={`px-4 py-3 text-sm text-center font-medium ${
                            vi === 0 ? "text-cyan-300" : "text-white/30"
                          }`}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white/90">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    className="text-white/40 text-xl shrink-0 ml-4 leading-none"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a5b4fc",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Empieza gratis hoy mismo
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Automatiza tu negocio
            <br />
            <span className="dn-gradient-text-primary">en minutos, no semanas</span>
          </h2>
          <p className="text-white/40 mb-8">
            Sin tarjeta de crédito. Sin servidor. Sin código.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/register")}
              className="px-8 py-3.5 rounded-2xl text-white font-bold text-sm transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
              }}
            >
              Empezar gratis →
            </button>
            <button
              onClick={() => handleSubscribe("pro")}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm transition-all hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Ver plan Pro →
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
