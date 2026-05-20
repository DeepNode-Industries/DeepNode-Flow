"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Trash2, ScanSearch, Play, ZoomIn, Maximize2,
  MousePointer2, Layers, Plus, ClipboardPaste, Settings2,
  Link2Off, Scissors,
} from "lucide-react";

export type ContextMenuTarget =
  | { kind: "pane"; x: number; y: number; flowX: number; flowY: number }
  | { kind: "node"; x: number; y: number; nodeId: string; nodeLabel: string; nodeColor: string }
  | { kind: "edge"; x: number; y: number; edgeId: string };

interface MenuItem {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  color?: string;
  danger?: boolean;
  dividerBefore?: boolean;
  onClick: () => void;
}

interface ContextMenuProps {
  target: ContextMenuTarget | null;
  onClose: () => void;
  onDeleteNode: (id: string) => void;
  onDuplicateNode: (id: string) => void;
  onSelectNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onFitView: () => void;
  onRunFromNode?: (id: string) => void;
}

export function ContextMenu({
  target,
  onClose,
  onDeleteNode,
  onDuplicateNode,
  onSelectNode,
  onDeleteEdge,
  onFitView,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  /* Close on outside click or Escape */
  useEffect(() => {
    if (!target) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [target, onClose]);

  if (!target) return null;

  /* Build menu items per context */
  let items: MenuItem[] = [];

  if (target.kind === "node") {
    items = [
      {
        icon: ScanSearch,
        label: "Ver propiedades",
        shortcut: "Click",
        onClick: () => { onSelectNode(target.nodeId); onClose(); },
      },
      {
        icon: Copy,
        label: "Duplicar nodo",
        shortcut: "⌘D",
        onClick: () => { onDuplicateNode(target.nodeId); onClose(); },
      },
      {
        icon: Play,
        label: "Ejecutar desde aquí",
        color: "#06b6d4",
        onClick: () => { onSelectNode(target.nodeId); onClose(); },
      },
      {
        icon: Trash2,
        label: "Eliminar nodo",
        shortcut: "Del",
        danger: true,
        dividerBefore: true,
        onClick: () => { onDeleteNode(target.nodeId); onClose(); },
      },
    ];
  } else if (target.kind === "edge") {
    items = [
      {
        icon: Link2Off,
        label: "Eliminar conexión",
        danger: true,
        onClick: () => { onDeleteEdge(target.edgeId); onClose(); },
      },
    ];
  } else {
    // pane
    items = [
      {
        icon: MousePointer2,
        label: "Seleccionar todo",
        shortcut: "⌘A",
        onClick: () => { onClose(); },
      },
      {
        icon: Maximize2,
        label: "Ajustar vista",
        shortcut: "⌘⇧F",
        onClick: () => { onFitView(); onClose(); },
      },
      {
        icon: ZoomIn,
        label: "Zoom al 100%",
        onClick: () => { onClose(); },
      },
    ];
  }

  /* Smart positioning — keep menu inside viewport */
  const menuW = 220;
  const menuH = items.length * 38 + 16;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const left = target.x + menuW > vw ? target.x - menuW : target.x;
  const top  = target.y + menuH > vh ? target.y - menuH : target.y;

  /* Node accent color dot */
  const nodeColor = target.kind === "node" ? target.nodeColor : null;

  return (
    <AnimatePresence>
      {target && (
        /* Invisible full-screen capture layer */
        <div
          className="fixed inset-0 z-[9999]"
          onContextMenu={(e) => { e.preventDefault(); onClose(); }}
        >
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute select-none overflow-hidden"
            style={{
              left,
              top,
              width: menuW,
              background: "rgba(10,10,20,0.97)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14,
              boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4)",
              backdropFilter: "blur(20px)",
              padding: "6px",
            }}
          >
            {/* Header — node name or context label */}
            {target.kind === "node" && (
              <div
                className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: nodeColor ?? "#7c3aed" }}
                />
                <span className="text-xs font-semibold text-white/70 truncate">
                  {target.nodeLabel}
                </span>
              </div>
            )}
            {target.kind === "pane" && (
              <div className="flex items-center gap-2 px-3 py-2 mb-1">
                <Layers className="w-3 h-3 text-white/20" />
                <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">Canvas</span>
              </div>
            )}
            {target.kind === "edge" && (
              <div className="flex items-center gap-2 px-3 py-2 mb-1">
                <Link2Off className="w-3 h-3 text-white/20" />
                <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">Conexión</span>
              </div>
            )}

            {/* Menu items */}
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <React.Fragment key={i}>
                  {item.dividerBefore && (
                    <div className="my-1 mx-2 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  )}
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left transition-colors group"
                    style={{ color: item.danger ? "#f87171" : item.color ?? "rgba(255,255,255,0.80)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = item.danger
                        ? "rgba(239,68,68,0.12)"
                        : "rgba(255,255,255,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: item.danger ? "#f87171" : item.color ?? "rgba(255,255,255,0.45)" }}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.shortcut && (
                      <span
                        className="text-[10px] font-mono shrink-0"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
