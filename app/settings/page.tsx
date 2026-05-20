"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, MessageSquare, Mail, Globe, Shield,
  Save, Eye, EyeOff, CheckCircle2, AlertCircle, Zap, Send,
  User, ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getSettings, saveSettings } from "@/lib/storage";
import { useAuthStore } from "@/store/auth-store";
import type { Settings } from "@/lib/types";

/* ── Field config ───────────────────────────────────────────────── */
interface FieldConfig {
  key: keyof Settings;
  label: string;
  placeholder: string;
  type?: "text" | "password" | "url" | "number";
  hint?: string;
}

/* ── Section type ───────────────────────────────────────────────── */
interface SectionDef {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  fields: FieldConfig[];
}

/* ── Section definitions ────────────────────────────────────────── */
const SECTIONS: SectionDef[] = [
  {
    id: "general",
    title: "General",
    icon: User,
    color: "#6366f1",
    fields: [],
  },
  {
    id: "ai",
    title: "Inteligencia Artificial",
    icon: Sparkles,
    color: "#9333ea",
    fields: [
      { key: "openaiKey",     label: "OpenAI API Key",     placeholder: "sk-...",              type: "password", hint: "Requerido para nodos GPT y análisis de IA" },
      { key: "openrouterKey", label: "OpenRouter API Key", placeholder: "sk-or-...",           type: "password", hint: "Alternativa con acceso a múltiples modelos" },
      { key: "xaiKey",        label: "xAI API Key (Grok)", placeholder: "xai-xxxx",            type: "password", hint: "Para nodos Grok Chat. Obtén en console.x.ai" },
    ],
  },
  {
    id: "telegram",
    title: "Telegram Bot",
    icon: Send,
    color: "#229ED9",
    fields: [
      { key: "telegramToken",  label: "Bot Token",           placeholder: "123456789:ABCdef...", type: "password", hint: "Obtén tu token en @BotFather → /newbot" },
      { key: "telegramChatId", label: "Chat ID por defecto", placeholder: "@mi_canal",           hint: "Envía /start a tu bot y mira el Chat ID" },
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp Business",
    icon: MessageSquare,
    color: "#22c55e",
    fields: [
      { key: "whatsappToken",   label: "Access Token",    placeholder: "EAAxxxx...",    type: "password", hint: "Token de la API de WhatsApp Cloud" },
      { key: "whatsappPhoneId", label: "Phone Number ID", placeholder: "1234567890123", hint: "ID del número en Meta Business" },
    ],
  },
  {
    id: "email",
    title: "Email SMTP",
    icon: Mail,
    color: "#14b8a6",
    fields: [
      { key: "smtpHost", label: "SMTP Host",       placeholder: "smtp.gmail.com"  },
      { key: "smtpPort", label: "SMTP Port",       placeholder: "587",             type: "number" },
      { key: "smtpUser", label: "Usuario SMTP",    placeholder: "user@empresa.com" },
      { key: "smtpPass", label: "Contraseña SMTP", placeholder: "••••••••",        type: "password" },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    icon: Globe,
    color: "#7c3aed",
    fields: [
      { key: "webhookBaseUrl", label: "Base URL", placeholder: "https://deepnode.app/webhooks", type: "url", hint: "URL base para webhooks entrantes" },
    ],
  },
  {
    id: "security",
    title: "Seguridad",
    icon: Shield,
    color: "#10b981",
    fields: [],
  },
];

type SectionId = string;

/* ── Masked input ───────────────────────────────────────────────── */
function MaskInput({
  value, onChange, placeholder, type,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  const [show, setShow] = useState(false);
  const isSecret = type === "password";

  return (
    <div className="relative">
      <input
        type={isSecret && !show ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-10 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors font-mono"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(99,102,241,0.5)";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)";
        }}
      />
      {isSecret && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

/* ── Section content ────────────────────────────────────────────── */
function SectionContent({
  sectionId,
  settings,
  onChange,
}: {
  sectionId: SectionId;
  settings: Settings;
  onChange: (k: keyof Settings, v: string) => void;
}) {
  const session = useAuthStore((s) => s.session);
  const section = SECTIONS.find((s) => s.id === sectionId);

  if (sectionId === "general") {
    return (
      <div className="space-y-6">
        {/* Mode selector */}
        <div
          className="p-4 rounded-2xl flex items-start gap-3"
          style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}
        >
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-amber-300 mb-1">Modo de Ejecución</div>
            <p className="text-xs text-white/40 leading-relaxed mb-3">
              En modo demo, las ejecuciones son simuladas. Activa el modo producción para usar APIs reales.
            </p>
            <div className="flex items-center gap-3">
              {(["demo", "production"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onChange("mode", m)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    settings.mode === m ? "text-white" : "text-white/40 hover:text-white/70"
                  }`}
                  style={settings.mode === m ? {
                    background: m === "production"
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(245,158,11,0.15)",
                    border: m === "production"
                      ? "1px solid rgba(16,185,129,0.3)"
                      : "1px solid rgba(245,158,11,0.3)",
                  } : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: settings.mode === m
                        ? m === "production" ? "#10b981" : "#f59e0b"
                        : "rgba(255,255,255,0.2)",
                    }}
                  />
                  {m === "demo" ? "Demo" : "Producción"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Account info */}
        {session && (
          <div
            className="p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-xs font-medium text-white/40 mb-3">Cuenta activa</div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #7c3aedcc, #7c3aed55)" }}
              >
                {session.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{session.name}</div>
                <div className="text-xs text-white/40">{session.email}</div>
              </div>
              <span
                className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}
              >
                Plan {session.plan.charAt(0).toUpperCase() + session.plan.slice(1)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (sectionId === "security") {
    return (
      <div className="space-y-4">
        {[
          { label: "Cifrado en tránsito", desc: "TLS 1.3 activo en todas las conexiones", ok: true },
          { label: "Secretos cifrados",   desc: "AES-256 en reposo para todas las claves", ok: true },
          { label: "Logs auditables",     desc: "Historial completo de ejecuciones", ok: true },
          { label: "Sesiones seguras",    desc: "Tokens de sesión con expiración", ok: true },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 p-3.5 rounded-xl"
            style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-xs text-white/40 mt-0.5">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!section || section.fields.length === 0) return null;

  return (
    <div className="space-y-5">
      {section.fields.map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-medium text-white/50 mb-1.5">
            {field.label}
          </label>
          <MaskInput
            value={String(settings[field.key] ?? "")}
            onChange={(v) => onChange(field.key, v)}
            placeholder={field.placeholder}
            type={field.type}
          />
          {field.hint && (
            <p className="text-[11px] text-white/25 mt-1">{field.hint}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    openaiKey:      "",
    openrouterKey:  "",
    xaiKey:         "",
    telegramToken:  "",
    telegramChatId: "",
    whatsappToken:  "",
    whatsappPhoneId:"",
    smtpHost:       "",
    smtpPort:       "587",
    smtpUser:       "",
    smtpPass:       "",
    webhookBaseUrl: "https://deepnode.app/webhooks",
    mode:           "demo",
  });
  const [saved,           setSaved]           = useState(false);
  const [activeSection,   setActiveSection]   = useState<SectionId>("general");

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const activeData = SECTIONS.find((s) => s.id === activeSection);

  return (
    <DashboardLayout>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
            Configuración
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            Gestiona tus integraciones y claves de API
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved ? "text-emerald-400" : "text-white"
          }`}
          style={saved ? {
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
          } : {
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            boxShadow: "0 4px 16px rgba(6,182,212,0.2)",
          }}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Guardado" : "Guardar cambios"}
        </button>
      </div>

      {/* ── Two-panel layout ────────────────────────────────────────── */}
      <div className="flex gap-6">

        {/* ── Left nav (desktop: always visible, mobile: tabs) ──────── */}
        <div className="hidden md:block w-52 shrink-0">
          <nav
            className="rounded-2xl overflow-hidden p-1.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {SECTIONS.map((section) => {
              const Icon     = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SectionId)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5 last:mb-0 ${
                    isActive ? "text-white" : "text-white/40 hover:text-white/70 hover:bg-white/3"
                  }`}
                  style={isActive ? {
                    background: `${section.color}15`,
                    border: `1px solid ${section.color}25`,
                  } : {}}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: isActive ? section.color : undefined }}
                    />
                    <span className="font-medium text-xs">{section.title}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3 text-white/30" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Mobile: tab chips ────────────────────────────────────── */}
        <div className="md:hidden w-full mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SectionId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                    activeSection === section.id ? "text-white" : "text-white/40"
                  }`}
                  style={activeSection === section.id ? {
                    background: `${section.color}20`,
                    border: `1px solid ${section.color}30`,
                  } : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: activeSection === section.id ? section.color : undefined }} />
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right content ────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Section header */}
            {activeData && (
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${activeData.color}15`, border: `1px solid ${activeData.color}25` }}
                >
                  <activeData.icon className="w-4 h-4" style={{ color: activeData.color }} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)]">
                    {activeData.title}
                  </h2>
                  <p className="text-[11px] text-white/30">
                    {activeSection === "general"  ? "Cuenta y modo de ejecución"
                    : activeSection === "security" ? "Estado de seguridad del sistema"
                    : "Configura tus credenciales de acceso"}
                  </p>
                </div>
                <div className="ml-auto">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: settings.mode === "demo" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                      color:      settings.mode === "demo" ? "#fbbf24" : "#34d399",
                      border:     settings.mode === "demo" ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(16,185,129,0.2)",
                    }}
                  >
                    {settings.mode === "demo" ? "Demo" : "Producción"}
                  </span>
                </div>
              </div>
            )}

            {/* Section body */}
            <div className="p-5">
              <SectionContent
                sectionId={activeSection}
                settings={settings}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 text-xs text-white/20 pt-8 pb-2">
        <Zap className="w-3 h-3" />
        <span>DeepNode Industries © 2026. Todos los derechos reservados.</span>
      </div>
    </DashboardLayout>
  );
}
