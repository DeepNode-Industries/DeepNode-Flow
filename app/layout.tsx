import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DeepNode Flow — Automatización con IA para empresas",
  description:
    "Plataforma SaaS de automatización visual con IA. Crea flujos inteligentes, conecta herramientas y automatiza procesos empresariales sin código.",
  keywords: ["automatización", "IA", "workflows", "no-code", "DeepNode Industries"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} dark`}
    >
      <body className="min-h-screen bg-[#080810] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
