"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const session  = useAuthStore((s) => s.session);
  const hydrating = useAuthStore((s) => s.hydrating);
  const hydrate  = useAuthStore((s) => s.hydrate);

  // Restore session on first render
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Redirect to login once hydration finishes and no session found
  useEffect(() => {
    if (!hydrating && !session) {
      router.replace("/login");
    }
  }, [hydrating, session, router]);

  if (hydrating || !session) {
    return (
      <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full scale-150" />
          <Image
            src="/logo.png"
            alt="DeepNode"
            width={56}
            height={56}
            className="relative rounded-2xl shadow-xl shadow-purple-500/30"
          />
        </div>
        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
        <p className="text-xs text-slate-600">Verificando sesión…</p>
      </div>
    );
  }

  return <>{children}</>;
}
