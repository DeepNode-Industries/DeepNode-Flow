"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

/**
 * UpgradeBanner — sticky bottom banner shown to Starter plan users.
 * Shows current usage (workflows used / max) and CTA to upgrade.
 * Dismissed per-session via localStorage.
 */
export function UpgradeBanner() {
  const router  = useRouter();
  const session = useAuthStore((s) => s.session);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only show for starter plan users
    if (session?.plan !== "starter") return;
    // Check if dismissed this session
    const wasDismissed = sessionStorage.getItem("dn_banner_dismissed");
    if (wasDismissed) return;
    // Slight delay before appearing
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, [session]);

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem("dn_banner_dismissed", "1");
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible || session?.plan !== "starter") return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4"
        >
          <div
            className="relative flex items-center gap-3 px-4 py-3 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(6,182,212,0.9))",
              backdropFilter: "blur(20px)",
              boxShadow: "0 16px 48px rgba(99,102,241,0.4), 0 4px 16px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* Background shimmer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                animation: "shimmer 3s infinite",
              }}
            />

            {/* Icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <Zap className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">
                Estás en el plan Starter gratuito
              </p>
              <p className="text-xs text-white/75 truncate">
                Upgrade a Pro y desbloquea AI, Telegram, WhatsApp y modo Producción
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => { router.push("/pricing"); dismiss(); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 shrink-0 transition-transform hover:scale-105 active:scale-95"
              style={{ background: "#fff" }}
            >
              Ver planes
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
