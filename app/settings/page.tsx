"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, MessageSquare, Mail, Globe, Database, Shield,
  Save, Eye, EyeOff, CheckCircle2, AlertCircle, Zap,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getSettings, saveSettings } from "@/lib/storage";
import type { Settings } from "@/lib/types";

interface FieldConfig {
  key: keyof Settings;
  label: string;
  placeholder: string;
  type?: "text" | "password" | "url" | "number";
  hint?: string;
}

const SECTIONS: {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  fields: FieldConfig[];
}[] = [
  {
    id: "ai",
    title: "Inteligencia Artificial",
    icon: Sparkles,
    color: "#9333ea",
    fields: [
      { key: "openaiKey", label: "OpenAI API Key", placeholder: "sk-...", type: "password", hint: "Requerido para nodos de IA con modelos GPT" },
      { key: "openrouterKey", label: "OpenRouter API Key", placeholder: "sk-or-...", type: "password", hint: "Alternativa a OpenAI con acceso a múltiples modelos" },
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp Business",
    icon: MessageSquare,
    color: "#22c55e",
    fields: [
      { key: "whatsappToken", label: "Access Token", placeholder: "EAAxxxx...", type: "password", hint: "Token de acceso de la API de WhatsApp Cloud" },
      { key: "whatsappPhoneId", label: "Phone Number ID", placeholder: "1234567890123", hint: "ID del número de teléfono en Meta Business" },
    ],
  },
  {
    id: "email",
    title: "Email SMTP",
    icon: Mail,
    color: "#14b8a6",
    fields: [
      { key: "smtpHost", label: "SMTP Host", placeholder: "smtp.gmail.com" },
      { key: "smtpPort", label: "SMTP Port", placeholder: "587", type: "number" },
      { key: "smtpUser", label: "Usuario SMTP", placeholder: "usuario@empresa.com" },
      { key: "smtpPass", label: "Contraseña SMTP", placeholder: "••••••••", type: "password" },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    icon: Globe,
    color: "#7c3aed",
    fields: [
      { key: "webhookBaseUrl", label: "Base URL", placeholder: "https://deepnode.app/webhooks", type: "url", hint: "URL base para los webhooks entrantes de tus flujos" },
    ],
  },
];

function MaskInput({
  value,
  onChange,
  placeholder,
  type,
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
        className="w-full px-3 py-2 pr-10 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
      />
      {isSecret && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    openaiKey: "",
    openrouterKey: "",
    whatsappToken: "",
    whatsappPhoneId: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    webhookBaseUrl: "https://deepnode.app/webhooks",
    mode: "demo",
  });
  const [saved, setSaved] = useState(false);

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

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
            Configuración
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configura tus integraciones y claves de API
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg shadow-purple-500/20"
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Guardado" : "Guardar cambios"}
        </button>
      </div>

      {/* Demo mode banner */}
      <div className="dn-glass-bright rounded-2xl border border-amber-500/20 p-4 mb-8 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-amber-300 mb-1">Modo Demo Activo</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Actualmente en modo demo. Las ejecuciones son simuladas y no se requieren API keys reales.
            Configura tus credenciales y cambia a modo producción para activar integraciones reales.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <select
            value={settings.mode}
            onChange={(e) => handleChange("mode", e.target.value)}
            className="text-xs bg-[#0e0e1c] border border-[#1e1e35] rounded-lg px-2 py-1 text-slate-400 focus:outline-none focus:border-purple-500/50"
          >
            <option value="demo">Demo</option>
            <option value="production">Producción</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="dn-glass-bright rounded-2xl border border-[#1e1e35] overflow-hidden"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e1e35]">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${section.color}15`, border: `1px solid ${section.color}25` }}
                >
                  <Icon className="w-4 h-4" style={{ color: section.color }} />
                </div>
                <h2 className="text-sm font-semibold text-slate-300 font-[family-name:var(--font-space-grotesk)]">
                  {section.title}
                </h2>
                <div className="ml-auto">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e1e35] text-slate-600">
                    {settings.mode === "demo" ? "Demo" : "Producción"}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      {field.label}
                    </label>
                    <MaskInput
                      value={String(settings[field.key] ?? "")}
                      onChange={(v) => handleChange(field.key, v)}
                      placeholder={field.placeholder}
                      type={field.type}
                    />
                    {field.hint && (
                      <p className="text-[11px] text-slate-600 mt-1">{field.hint}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & account section */}
      <div className="mt-6 dn-glass-bright rounded-2xl border border-[#1e1e35] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-slate-500/15 border border-slate-500/25 flex items-center justify-center">
            <Shield className="w-4 h-4 text-slate-400" />
          </div>
          <h2 className="text-sm font-semibold text-slate-300 font-[family-name:var(--font-space-grotesk)]">
            Seguridad
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Cifrado en tránsito", desc: "TLS 1.3 activo", ok: true },
            { label: "Secretos cifrados", desc: "AES-256 en reposo", ok: true },
            { label: "Logs auditables", desc: "Historial completo", ok: true },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#080810]/50 border border-[#1e1e35]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-slate-300">{item.label}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer branding */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-700">
        <Zap className="w-3 h-3" />
        <span>DeepNode Industries © 2026. Todos los derechos reservados.</span>
      </div>
    </DashboardLayout>
  );
}
