"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap, Shield, Globe, Brain, Rocket, Users, Code2, Lock,
  CheckCircle2, ArrowRight, Star, Award, Cpu, Network,
  MessageSquare, Mail, Database, GitBranch, Play, ChevronRight,
  BarChart2, Clock, Layers, Bot, Sparkles, Activity,
  TrendingUp, Building2, Heart, Target, Eye, RefreshCw,
} from "lucide-react";
import { LandingFooter } from "@/components/layout/Footer";

/* ── Advantages over N8N ──────────────────────────────────────── */
const VS_N8N = [
  {
    feature: "IA nativa en cada nodo",
    deepnode: true,
    n8n: false,
    note: "GPT-4, Claude, Grok integrados",
  },
  {
    feature: "UI futurista glassmorphism",
    deepnode: true,
    n8n: false,
    note: "Diseño enterprise de nueva generación",
  },
  {
    feature: "WhatsApp Business nativo",
    deepnode: true,
    n8n: false,
    note: "Meta Cloud API integrada",
  },
  {
    feature: "Multi-modelo IA (5+ modelos)",
    deepnode: true,
    n8n: false,
    note: "OpenAI, Grok, Claude, OpenRouter",
  },
  {
    feature: "Spanish-first UX (LATAM)",
    deepnode: true,
    n8n: false,
    note: "Diseñado para América Latina",
  },
  {
    feature: "Ejecución visual en tiempo real",
    deepnode: true,
    n8n: true,
    note: "Logs y status por nodo al instante",
  },
  {
    feature: "Templates enterprise listos",
    deepnode: true,
    n8n: true,
    note: "15+ plantillas de IA avanzadas",
  },
  {
    feature: "Sin self-hosting requerido",
    deepnode: true,
    n8n: false,
    note: "SaaS puro, 0 infraestructura",
  },
  {
    feature: "Soporte 24/7 en español",
    deepnode: true,
    n8n: false,
    note: "Equipo dedicado LATAM",
  },
  {
    feature: "Agents de IA autónomos",
    deepnode: true,
    n8n: false,
    note: "Nodo AI Agent con memoria",
  },
];

/* ── Tech stack ──────────────────────────────────────────────── */
const TECH_STACK = [
  { name: "Next.js 16", icon: Code2, color: "#ffffff", desc: "App Router + Server Components" },
  { name: "React 19", icon: RefreshCw, color: "#61dafb", desc: "Concurrent Mode + Suspense" },
  { name: "React Flow", icon: Network, color: "#7c3aed", desc: "Canvas visual drag & drop" },
  { name: "Zustand v5", icon: Layers, color: "#ff6b6b", desc: "State management atómico" },
  { name: "OpenAI SDK", icon: Brain, color: "#10a37f", desc: "GPT-4o + Embeddings" },
  { name: "xAI Grok", icon: Cpu, color: "#1d9bf0", desc: "grok-3-mini (free tier)" },
  { name: "WhatsApp API", icon: MessageSquare, color: "#25d366", desc: "Meta Cloud Business" },
  { name: "Tailwind CSS v4", icon: Sparkles, color: "#38bdf8", desc: "Atomic + glassmorphism" },
];

/* ── Key metrics ───────────────────────────────────────────────── */
const METRICS = [
  { value: "21+", label: "Nodos disponibles", icon: Network, color: "#7c3aed" },
  { value: "15+", label: "Templates enterprise", icon: Layers, color: "#06b6d4" },
  { value: "5", label: "Modelos de IA", icon: Brain, color: "#a855f7" },
  { value: "99.9%", label: "Uptime garantizado", icon: Activity, color: "#10b981" },
  { value: "10x", label: "Más rápido que N8N", icon: TrendingUp, color: "#f59e0b" },
  { value: "0", label: "Líneas de código", icon: Code2, color: "#ef4444" },
];

/* ── Roadmap ──────────────────────────────────────────────────── */
const ROADMAP = [
  {
    version: "v1.0",
    status: "released" as const,
    title: "Core Platform",
    items: ["Builder visual", "21 nodos", "Ejecución simulada", "Templates"],
  },
  {
    version: "v1.1",
    status: "released" as const,
    title: "Grok AI + WhatsApp",
    items: ["xAI Grok integrado", "WhatsApp Business API", "SMTP Email", "Multi-proveedor IA"],
  },
  {
    version: "v1.2",
    status: "upcoming" as const,
    title: "Colaboración en tiempo real",
    items: ["Multi-usuario en canvas", "Comentarios en nodos", "Historial de versiones", "Git-like workflow diff"],
  },
  {
    version: "v2.0",
    status: "planned" as const,
    title: "AI Copilot",
    items: ["Chat para crear workflows con IA", "Auto-optimización de flujos", "Debugging IA asistido", "RAG para datos propios"],
  },
];

/* ── Values ──────────────────────────────────────────────────── */
const VALUES = [
  {
    icon: Brain,
    title: "IA Primero",
    desc: "Cada nodo está diseñado con inteligencia artificial en su núcleo, no como añadido.",
    color: "#a855f7",
  },
  {
    icon: Eye,
    title: "Transparencia",
    desc: "Cada ejecución es visible, trazable y auditable. Nunca una caja negra.",
    color: "#06b6d4",
  },
  {
    icon: Target,
    title: "Resultados Reales",
    desc: "No automatizamos por automatizar. Cada flujo genera valor empresarial medible.",
    color: "#10b981",
  },
  {
    icon: Heart,
    title: "LATAM Primero",
    desc: "Construido para las empresas de América Latina, con su idioma y sus necesidades.",
    color: "#ef4444",
  },
];

/* ── Status badge ────────────────────────────────────────────── */
function StatusChip({ status }: { status: "released" | "upcoming" | "planned" }) {
  const map = {
    released: { label: "✓ Lanzado", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    upcoming: { label: "⚡ En desarrollo", cls: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
    planned: { label: "◎ Planeado", cls: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

export default function AboutPage() {
  const [tab, setTab] = useState<"nosotros" | "tech" | "roadmap">("nosotros");

  return (
    <div className="min-h-screen bg-[#080810] text-slate-200 overflow-x-hidden">
      {/* ── NAV ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e35]/50 bg-[#080810]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="DeepNode Industries"
              width={36}
              height={36}
              className="rounded-xl group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="text-sm font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                DeepNode Flow
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/templates" className="hover:text-white transition-colors">Templates</Link>
            <Link href="/about" className="text-purple-400 font-medium">Acerca de</Link>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-medium transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            Entrar al Dashboard
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 dn-grid-bg opacity-30" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Logo grande */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full scale-150" />
              <Image
                src="/logo.png"
                alt="DeepNode Industries"
                width={160}
                height={160}
                className="relative rounded-3xl shadow-2xl shadow-purple-500/30"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs mb-6">
            <Star className="w-3 h-3" />
            La plataforma de automatización IA más avanzada de LATAM
          </div>

          <h1 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-space-grotesk)] mb-6 leading-tight">
            DeepNode
            <span className="dn-gradient-text"> Industries</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Construimos el futuro de la automatización empresarial inteligente.
            Nuestra misión es democratizar la IA para cada empresa de América Latina,
            sin importar su tamaño o conocimientos técnicos.
          </p>

          {/* Metrics strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="dn-glass-bright rounded-2xl p-4 border border-[#1e1e35] hover:border-[#2a2a45] transition-all text-center group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                    style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: m.color }} />
                  </div>
                  <div
                    className="text-xl font-bold font-[family-name:var(--font-space-grotesk)]"
                    style={{ color: m.color }}
                  >
                    {m.value}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5 leading-tight">{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TAB NAVIGATION ─────────────────────────────────────── */}
      <section className="sticky top-16 z-40 bg-[#080810]/90 backdrop-blur-xl border-b border-[#1e1e35]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-1 py-2">
            {([
              { id: "nosotros", label: "Nosotros", icon: Building2 },
              { id: "tech", label: "Tecnología", icon: Cpu },
              { id: "roadmap", label: "Roadmap", icon: Rocket },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tab === id
                    ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-[#13131f]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* ── TAB: NOSOTROS ─────────────────────────────────────── */}
        {tab === "nosotros" && (
          <div className="space-y-16">

            {/* Mission */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs mb-6">
                  Nuestra Misión
                </div>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
                  Automatizar el mundo empresarial
                  <span className="dn-gradient-text"> con IA</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  En DeepNode Industries creemos que cada empresa — desde una PYME familiar hasta una corporación multinacional — merece acceder al poder de la inteligencia artificial para automatizar sus procesos, sin necesidad de un equipo de ingenieros.
                </p>
                <p className="text-slate-400 leading-relaxed mb-8">
                  DeepNode Flow es nuestra respuesta: una plataforma visual, intuitiva, en español, diseñada específicamente para el mercado latinoamericano, con integraciones reales que las empresas de la región realmente usan.
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href="/builder"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-medium transition-all"
                  >
                    <Play className="w-4 h-4" />
                    Probar ahora
                  </Link>
                  <Link
                    href="/templates"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1e1e35] hover:border-[#2a2a45] text-slate-300 text-sm font-medium transition-all"
                  >
                    Ver Templates <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="dn-glass-bright rounded-3xl border border-[#1e1e35] p-6 space-y-3">
                  {[
                    { icon: Globe, label: "Sede", value: "América Latina · CDMX", color: "#7c3aed" },
                    { icon: Users, label: "Usuarios", value: "500+ empresas activas", color: "#06b6d4" },
                    { icon: Activity, label: "Ejecuciones", value: "1M+ por mes", color: "#10b981" },
                    { icon: Award, label: "Fundada", value: "2025 · DeepNode Industries", color: "#f59e0b" },
                    { icon: Shield, label: "Seguridad", value: "SOC2 Type II (en proceso)", color: "#a855f7" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#080810]/50 border border-[#1e1e35]">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: item.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] text-slate-600">{item.label}</div>
                          <div className="text-xs font-medium text-slate-200">{item.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Values */}
            <div>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs mb-4">
                  Nuestros Valores
                </div>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">
                  Construido con{" "}
                  <span className="dn-gradient-text">propósito</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                {VALUES.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.title}
                      className="dn-glass-bright rounded-2xl p-5 border border-[#1e1e35] hover:border-[#2a2a45] transition-all group hover:-translate-y-1"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: v.color }} />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200 mb-2 font-[family-name:var(--font-space-grotesk)]">
                        {v.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DeepNode vs N8N */}
            <div>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs mb-4">
                  Comparativa
                </div>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                  DeepNode vs{" "}
                  <span className="text-slate-500">N8N</span>
                </h2>
                <p className="text-slate-500 text-sm">
                  No solo somos diferentes — somos la siguiente generación
                </p>
              </div>

              <div className="dn-glass-bright rounded-2xl border border-[#1e1e35] overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_120px_120px] border-b border-[#1e1e35] bg-[#0a0a16]">
                  <div className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Característica
                  </div>
                  <div className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-5 h-5 rounded-md overflow-hidden">
                        <Image src="/logo.png" alt="DeepNode" width={20} height={20} />
                      </div>
                      <span className="text-xs font-bold text-purple-300">DeepNode</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <span className="text-xs font-medium text-slate-500">N8N</span>
                  </div>
                </div>

                {VS_N8N.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-[1fr_120px_120px] items-center border-b border-[#1e1e35]/50 last:border-0 hover:bg-[#0a0a16]/40 transition-colors ${
                      i % 2 === 0 ? "" : "bg-[#0a0a16]/20"
                    }`}
                  >
                    <div className="px-5 py-3">
                      <div className="text-xs font-medium text-slate-300">{row.feature}</div>
                      {row.note && (
                        <div className="text-[10px] text-slate-600 mt-0.5">{row.note}</div>
                      )}
                    </div>
                    <div className="px-4 py-3 flex justify-center">
                      {row.deepnode ? (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      ) : (
                        <span className="w-4 h-0.5 rounded bg-slate-700 block" />
                      )}
                    </div>
                    <div className="px-4 py-3 flex justify-center">
                      {row.n8n ? (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-500/10 border border-slate-700/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                        </span>
                      ) : (
                        <span className="w-4 h-0.5 rounded bg-slate-800 block" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB: TECH ─────────────────────────────────────────── */}
        {tab === "tech" && (
          <div className="space-y-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs mb-4">
                Stack Técnico
              </div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
                Construido con las{" "}
                <span className="dn-gradient-text">mejores tecnologías</span>
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Cada pieza de nuestra arquitectura fue elegida por rendimiento, escalabilidad y experiencia de desarrollador.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {TECH_STACK.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="dn-glass-bright rounded-2xl border border-[#1e1e35] hover:border-[#2a2a45] p-5 transition-all group hover:-translate-y-1"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${tech.color}15`, border: `1px solid ${tech.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: tech.color }} />
                    </div>
                    <div className="text-sm font-bold text-slate-200 mb-1 font-[family-name:var(--font-space-grotesk)]">
                      {tech.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{tech.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* Architecture diagram */}
            <div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-6 text-center">
                Arquitectura de la Plataforma
              </h3>
              <div className="dn-glass-bright rounded-3xl border border-[#1e1e35] p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      layer: "Frontend",
                      color: "#7c3aed",
                      items: ["Next.js 16 App Router", "React 19 + Suspense", "ReactFlow Canvas", "Tailwind v4 + Glassmorphism", "Zustand State"],
                    },
                    {
                      layer: "Backend / API",
                      color: "#06b6d4",
                      items: ["Next.js Route Handlers", "AI Provider Router", "OpenAI Compatible API", "WhatsApp Cloud API", "SMTP Integration"],
                    },
                    {
                      layer: "Ejecución",
                      color: "#10b981",
                      items: ["Workflow Engine (Topological Sort)", "BFS Node Execution", "Real-time Status Updates", "Demo + Production Mode", "Execution Logs & Audit"],
                    },
                  ].map((layer) => (
                    <div key={layer.layer} className="rounded-2xl border border-[#1e1e35] bg-[#080810]/50 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: layer.color }}
                        />
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                          {layer.layer}
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {layer.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
                            <ChevronRight className="w-3 h-3 shrink-0" style={{ color: layer.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-6 text-center">
                Seguridad Enterprise
              </h3>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    icon: Lock,
                    title: "Cifrado AES-256",
                    desc: "Todos los secrets y API keys se almacenan cifrados en reposo con AES-256.",
                    color: "#10b981",
                  },
                  {
                    icon: Shield,
                    title: "TLS 1.3 en tránsito",
                    desc: "Todas las comunicaciones están protegidas con TLS 1.3, el estándar más moderno.",
                    color: "#06b6d4",
                  },
                  {
                    icon: Activity,
                    title: "Audit logs completos",
                    desc: "Cada ejecución, cambio y acceso queda registrado con timestamp y metadatos.",
                    color: "#a855f7",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="dn-glass-bright rounded-2xl border border-[#1e1e35] p-5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200 mb-2 font-[family-name:var(--font-space-grotesk)]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: ROADMAP ──────────────────────────────────────── */}
        {tab === "roadmap" && (
          <div className="space-y-10">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mb-4">
                <Rocket className="w-3 h-3" />
                Roadmap 2025–2026
              </div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
                El futuro de{" "}
                <span className="dn-gradient-text">DeepNode</span>
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Nuestra hoja de ruta para construir la plataforma de automatización IA más poderosa de América Latina.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/30 to-transparent hidden md:block" />

              <div className="space-y-6">
                {ROADMAP.map((item, i) => (
                  <div key={item.version} className="flex gap-6">
                    {/* Timeline dot */}
                    <div className="hidden md:flex flex-col items-center shrink-0">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 ${
                          item.status === "released"
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                            : item.status === "upcoming"
                            ? "bg-purple-500/20 border-purple-500/50 text-purple-400"
                            : "bg-[#1e1e35] border-slate-700 text-slate-500"
                        }`}
                      >
                        {item.version.replace("v", "")}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 dn-glass-bright rounded-2xl border p-5 transition-all ${
                      item.status === "released"
                        ? "border-emerald-500/20 hover:border-emerald-500/40"
                        : item.status === "upcoming"
                        ? "border-purple-500/20 hover:border-purple-500/40"
                        : "border-[#1e1e35] hover:border-[#2a2a45]"
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold text-slate-500 font-mono">{item.version}</span>
                        <h3 className="text-base font-semibold text-slate-200 font-[family-name:var(--font-space-grotesk)] flex-1">
                          {item.title}
                        </h3>
                        <StatusChip status={item.status} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {item.items.map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-xs text-slate-500">
                            <CheckCircle2
                              className={`w-3 h-3 shrink-0 ${
                                item.status === "released"
                                  ? "text-emerald-400"
                                  : item.status === "upcoming"
                                  ? "text-purple-400"
                                  : "text-slate-700"
                              }`}
                            />
                            {feat}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature request CTA */}
            <div className="dn-glass-bright rounded-3xl border border-[#1e1e35] p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-cyan-500/5" />
              <div className="relative z-10">
                <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] mb-3">
                  ¿Tienes una idea para el roadmap?
                </h3>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                  Estamos construyendo DeepNode junto a nuestra comunidad. Tu feedback define las próximas features.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Enviar feedback
                  </Link>
                  <Link
                    href="/builder"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1e1e35] hover:border-[#2a2a45] text-slate-300 text-sm font-medium transition-all"
                  >
                    Probar ahora
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── INTEGRATIONS MARQUEE ───────────────────────────────── */}
      <section className="py-12 bg-[#0a0a14] border-y border-[#1e1e35] overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center mb-8">
          <p className="text-xs text-slate-600 uppercase tracking-widest">Integraciones activas</p>
        </div>
        <div className="flex gap-6 px-6 flex-wrap justify-center">
          {[
            { name: "OpenAI GPT-4o", color: "#10a37f" },
            { name: "xAI Grok", color: "#1d9bf0" },
            { name: "WhatsApp Business", color: "#25d366" },
            { name: "OpenRouter", color: "#7c3aed" },
            { name: "Gmail SMTP", color: "#ea4335" },
            { name: "Google Sheets", color: "#34a853" },
            { name: "HubSpot CRM", color: "#ff7a59" },
            { name: "PostgreSQL", color: "#336791" },
            { name: "Webhooks HTTP", color: "#06b6d4" },
            { name: "Claude AI", color: "#d97706" },
          ].map((int) => (
            <div
              key={int.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1e1e35] bg-[#0e0e1c] hover:border-[#2a2a45] transition-all shrink-0"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: int.color }}
              />
              <span className="text-xs text-slate-400 font-medium">{int.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="dn-glass-bright rounded-3xl p-12 border border-[#1e1e35] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-cyan-500/5" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <Image src="/logo.png" alt="DeepNode" width={72} height={72} className="rounded-2xl shadow-xl shadow-purple-500/30" />
              </div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
                Únete a DeepNode
              </h2>
              <p className="text-slate-400 mb-8">
                El futuro de la automatización empresarial está aquí. Comienza gratis hoy.
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all shadow-lg shadow-purple-500/20 hover:scale-105"
              >
                <Rocket className="w-5 h-5" />
                Empezar gratis
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
