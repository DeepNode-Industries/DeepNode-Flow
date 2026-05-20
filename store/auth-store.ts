"use client";

import { create } from "zustand";
import type { AuthSession, UserPlan } from "@/lib/types";
import {
  getSession,
  saveSession,
  clearSession,
  loginUser,
  registerUser,
} from "@/lib/storage";

interface AuthState {
  session: AuthSession | null;
  /** true while the initial localStorage check is happening */
  hydrating: boolean;

  /** Call once on app mount to restore session from localStorage */
  hydrate: () => void;

  login: (
    email: string,
    password: string
  ) => { ok: true } | { ok: false; error: string };

  register: (
    name: string,
    email: string,
    password: string,
    plan?: UserPlan
  ) => { ok: true } | { ok: false; error: string };

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  hydrating: true,

  hydrate: () => {
    const session = getSession();
    set({ session, hydrating: false });
  },

  login: (email, password) => {
    const user = loginUser(email, password);
    if (!user) {
      return { ok: false, error: "Email o contraseña incorrectos." };
    }

    const session: AuthSession = {
      userId: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      initials: user.initials,
      loginAt: new Date().toISOString(),
    };

    saveSession(session);
    set({ session });
    return { ok: true };
  },

  register: (name, email, password, plan = "starter") => {
    const result = registerUser(name, email, password, plan);
    if (!result.ok) return { ok: false, error: result.error };

    const user = result.user;
    const session: AuthSession = {
      userId: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      initials: user.initials,
      loginAt: new Date().toISOString(),
    };

    saveSession(session);
    set({ session });
    return { ok: true };
  },

  logout: () => {
    clearSession();
    set({ session: null });
  },
}));
