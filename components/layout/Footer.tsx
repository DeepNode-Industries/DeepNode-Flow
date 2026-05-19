import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e35] bg-[#080810]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-slate-500">
            <span className="text-slate-400 font-medium">DeepNode Industries</span> © 2026. Todos los derechos reservados.
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <Link href="/" className="hover:text-slate-400 transition-colors">
            Privacidad
          </Link>
          <Link href="/" className="hover:text-slate-400 transition-colors">
            Términos
          </Link>
          <Link href="/" className="hover:text-slate-400 transition-colors">
            Soporte
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-[#1e1e35] bg-[#080810]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white font-[family-name:var(--font-space-grotesk)]">DeepNode Flow</div>
                <div className="text-xs text-slate-500">by DeepNode Industries</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Plataforma de automatización con IA para empresas. Conecta, automatiza y escala tus procesos empresariales.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4 font-[family-name:var(--font-space-grotesk)]">Producto</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/builder" className="hover:text-purple-400 transition-colors">Builder</Link></li>
              <li><Link href="/templates" className="hover:text-purple-400 transition-colors">Templates</Link></li>
              <li><Link href="/workflows" className="hover:text-purple-400 transition-colors">Workflows</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4 font-[family-name:var(--font-space-grotesk)]">Empresa</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Nosotros</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#1e1e35] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            <span className="text-slate-500">DeepNode Industries</span> © 2026. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Seguridad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
