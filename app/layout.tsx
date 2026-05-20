import type { Metadata } from "next";
import { Onest, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * DeepNode Flow — Typography System
 *
 * Onest             → headings, brand text, display titles
 * Plus Jakarta Sans → body, UI labels, paragraphs
 * JetBrains Mono    → execution logs, code nodes, API keys
 */

/* ── Onest — futurista, geométrica, distinti va para AI/tech ──────── */
const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

/* ── Plus Jakarta Sans — moderna, refinada, muy legible ──────────── */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

/* ── JetBrains Mono — para logs, código y secrets ───────────────── */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DeepNode Flow — Automatización con IA para empresas",
  description:
    "Plataforma SaaS de automatización visual con IA. Crea flujos inteligentes, conecta herramientas y automatiza procesos empresariales sin código.",
  keywords: ["automatización", "IA", "workflows", "no-code", "DeepNode Industries"],
  openGraph: {
    title: "DeepNode Flow",
    description: "Automatización con IA para empresas — sin código",
    siteName: "DeepNode Flow",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${onest.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#080810] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
