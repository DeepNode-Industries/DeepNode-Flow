import React from "react";
import Link from "next/link";
import {
  Zap, ArrowRight, Globe, Clock, Sparkles, GitBranch,
  MessageSquare, Mail, Database, Users, CheckCircle2,
  Play, Bot, Webhook,
} from "lucide-react";
import { LandingFooter } from "@/components/layout/Footer";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Automatización con IA",
    description: "Integra GPT-4o, Claude y otros modelos para clasificar, generar y resumir datos automáticamente.",
    color: "#a855f7",
  },
  {
    icon: Zap,
    title: "Builder Visual",
    description: "Crea flujos arrastrando nodos y conectando acciones. Sin código. Sin límites.",
    color: "#06b6d4",
  },
  {
    icon: Globe,
    title: "Integraciones Reales",
    description: "Conecta WhatsApp Business, Email, APIs HTTP, Google Sheets, CRMs y bases de datos.",
    color: "#3b82f6",
  },
  {
    icon: Clock,
    title: "Programación Automática",
    description: "Cron jobs, webhooks entrantes y triggers de formularios para activar flujos cuando los necesites.",
    color: "#10b981",
  },
  {
    icon: GitBranch,
    title: "Lógica Condicional",
    description: "IF/Else, loops, delays y transformaciones de datos para flujos complejos y ramificados.",
    color: "#f59e0b",
  },
  {
    icon: Database,
    title: "Multi-Base de Datos",
    description: "PostgreSQL, MySQL, MongoDB y Supabase. Consulta, guarda y actualiza datos en tiempo real.",
    color: "#ef4444",
  },
];

const USE_CASES = [
  {
    icon: Users,
    title: "Calificación de Leads",
    description: "Clasifica automáticamente los leads con IA y notifica al equipo de ventas via WhatsApp.",
    color: "#7c3aed",
  },
  {
    icon: MessageSquare,
    title: "Soporte IA 24/7",
    description: "Un agente IA responde consultas de clientes y escala a humano cuando es necesario.",
    color: "#0369a1",
  },
  {
    icon: Mail,
    title: "Reportes Automáticos",
    description: "Genera y envía resúmenes diarios de ventas, inventario y métricas a tu equipo directivo.",
    color: "#059669",
  },
];

const INTEGRATIONS = [
  { name: "WhatsApp", icon: MessageSquare, color: "#25d366" },
  { name: "OpenAI", icon: Sparkles, color: "#10a37f" },
  { name: "Gmail", icon: Mail, color: "#ea4335" },
  { name: "HubSpot", icon: Users, color: "#ff7a59" },
  { name: "PostgreSQL", icon: Database, color: "#336791" },
  { name: "Webhooks", icon: Webhook, color: "#7c3aed" },
  { name: "Claude AI", icon: Bot, color: "#d97706" },
  { name: "Google Sheets", icon: Database, color: "#34a853" },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$29",
    period: "/mes",
    description: "Para emprendedores y equipos pequeños",
    features: ["5 workflows activos", "1,000 ejecuciones/mes", "Nodos básicos", "Soporte por email"],
    color: "#7c3aed",
    cta: "Comenzar gratis",
    popular: false,
  },
  {
    name: "Business",
    price: "$99",
    period: "/mes",
    description: "Para empresas en crecimiento",
    features: ["Workflows ilimitados", "50,000 ejecuciones/mes", "IA avanzada incluida", "WhatsApp Business", "Soporte prioritario"],
    color: "#06b6d4",
    cta: "Empezar ahora",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/mes",
    description: "Para grandes corporaciones",
    features: ["Todo en Business", "Ejecuciones ilimitadas", "SLA garantizado 99.9%", "Onboarding dedicado", "Soporte 24/7"],
    color: "#a855f7",
    cta: "Contactar ventas",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-slate-200 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e35]/50 bg-[#080810]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white font-[family-name:var(--font-space-grotesk)]">DeepNode Flow</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Características</a>
            <a href="#use-cases" className="hover:text-white transition-colors">Casos de Uso</a>
            <a href="#integrations" className="hover:text-white transition-colors">Integraciones</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/builder"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-medium transition-all"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 dn-grid-bg opacity-40" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Plataforma de Automatización Empresarial con IA
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-[family-name:var(--font-space-grotesk)] tracking-tight">
            Automatiza tu empresa
            <br />
            <span className="dn-gradient-text">con el poder de la IA</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            DeepNode Flow te permite crear flujos de automatización visuales con IA en minutos.
            Sin código. Sin fricciones. Con resultados empresariales reales.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105"
            >
              <Play className="w-5 h-5" />
              Crear mi primer flujo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/templates"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-[#1e1e35] bg-[#0e0e1c]/50 hover:bg-[#13131f] text-slate-300 font-medium text-lg transition-all"
            >
              Ver plantillas
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: "10x", label: "Más rápido" },
              { value: "0", label: "Líneas de código" },
              { value: "∞", label: "Workflows" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold dn-gradient-text font-[family-name:var(--font-space-grotesk)]">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is DeepNode Flow */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs mb-6">
                Qué es DeepNode Flow
              </div>
              <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-6 leading-tight">
                La plataforma que conecta tu empresa
                <span className="dn-gradient-text-purple"> con la IA</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                DeepNode Flow es una plataforma SaaS de automatización empresarial que combina la potencia de los flujos visuales con inteligencia artificial de última generación.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                Crea, conecta y automatiza cualquier proceso de negocio — desde la calificación de leads hasta el soporte al cliente — sin escribir una sola línea de código.
              </p>
              <div className="flex flex-col gap-3">
                {["Sin conocimientos técnicos requeridos", "IA integrada en cada nodo", "Resultados en minutos, no semanas"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="dn-glass-bright rounded-2xl p-6 border border-[#2a2a45]">
                <div className="space-y-3">
                  {[
                    { icon: Globe, label: "Webhook recibido", status: "success", color: "#6366f1" },
                    { icon: Sparkles, label: "IA clasifica el lead", status: "success", color: "#9333ea" },
                    { icon: GitBranch, label: "Condición evaluada: VERDADERO", status: "success", color: "#b91c1c" },
                    { icon: MessageSquare, label: "WhatsApp enviado", status: "success", color: "#15803d" },
                    { icon: Users, label: "Guardado en CRM", status: "running", color: "#b45309" },
                  ].map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#080810]/60 border border-[#1e1e35]">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${step.color}20`, border: `1px solid ${step.color}30` }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: step.color }} />
                        </div>
                        <span className="text-xs text-slate-300 flex-1">{step.label}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs mb-4">
              Características
            </div>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
              Todo lo que necesitas para{" "}
              <span className="dn-gradient-text">automatizar</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Herramientas empresariales de automatización, potenciadas con IA, listas para usar desde el día uno.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="dn-glass-bright rounded-2xl p-6 border border-[#1e1e35] hover:border-[#2a2a45] transition-all group hover:-translate-y-1"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${feat.color}15`, border: `1px solid ${feat.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: feat.color }} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-200 mb-2 font-[family-name:var(--font-space-grotesk)]">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs mb-4">
              Casos de Uso
            </div>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
              Automatiza cualquier <span className="dn-gradient-text">proceso empresarial</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {USE_CASES.map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.title}
                  className="dn-glass-bright rounded-2xl p-6 border border-[#1e1e35] relative overflow-hidden group hover:border-[#2a2a45] transition-all"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, ${uc.color}, transparent)` }}
                  />
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `${uc.color}15`, border: `1px solid ${uc.color}30` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: uc.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-3 font-[family-name:var(--font-space-grotesk)]">
                    {uc.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{uc.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-24 px-6 bg-[#0a0a14]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs mb-4">
            Integraciones
          </div>
          <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
            Conecta con tus <span className="dn-gradient-text">herramientas favoritas</span>
          </h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto">
            DeepNode Flow se integra con las plataformas que ya usas en tu empresa.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INTEGRATIONS.map((int) => {
              const Icon = int.icon;
              return (
                <div
                  key={int.name}
                  className="dn-glass-bright rounded-2xl p-5 border border-[#1e1e35] flex flex-col items-center gap-3 hover:border-[#2a2a45] transition-all hover:-translate-y-1"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${int.color}20`, border: `1px solid ${int.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: int.color }} />
                  </div>
                  <span className="text-xs font-medium text-slate-300">{int.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates preview */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs mb-4">
            Plantillas listas
          </div>
          <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
            Empieza en <span className="dn-gradient-text">segundos</span>
          </h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto">
            Plantillas prediseñadas por expertos para los casos de uso más comunes. Solo personaliza y activa.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {["Lead + IA + WhatsApp", "Resumen Diario de Ventas", "Soporte IA 24/7"].map((name, i) => (
              <div
                key={name}
                className="dn-glass-bright rounded-xl p-4 border border-[#1e1e35] text-left hover:border-purple-500/30 transition-all cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center"
                  style={{
                    background: ["#7c3aed20", "#0369a120", "#9333ea20"][i],
                    border: `1px solid ${["#7c3aed40", "#0369a140", "#9333ea40"][i]}`,
                  }}
                >
                  {[<Users key="u" className="w-4 h-4 text-purple-400" />, <Mail key="m" className="w-4 h-4 text-blue-400" />, <Bot key="b" className="w-4 h-4 text-violet-400" />][i]}
                </div>
                <div className="text-sm font-medium text-slate-200 mb-1">{name}</div>
                <div className="text-xs text-slate-500">Listo para usar</div>
              </div>
            ))}
          </div>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Ver todas las plantillas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-[#0a0a14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mb-4">
              Precios
            </div>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
              Planes para cada <span className="dn-gradient-text">empresa</span>
            </h2>
            <p className="text-slate-400">Sin contratos anuales. Cancela cuando quieras.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`dn-glass-bright rounded-2xl p-6 border relative overflow-hidden flex flex-col ${
                  plan.popular ? "border-cyan-500/30" : "border-[#1e1e35]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
                )}
                {plan.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-medium">
                      Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-200 mb-1 font-[family-name:var(--font-space-grotesk)]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                      {plan.price}
                    </span>
                    <span className="text-slate-500 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/builder"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
                      : "border border-[#2a2a45] hover:bg-[#13131f] text-slate-300"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="dn-glass-bright rounded-3xl p-12 border border-[#1e1e35] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-cyan-500/5" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
                ¿Listo para automatizar?
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Únete a cientos de empresas que ya automatizan con DeepNode Flow.
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all shadow-lg shadow-purple-500/20 hover:scale-105"
              >
                <Play className="w-5 h-5" />
                Crear mi primer flujo gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
