"use client";

/**
 * AuroraBackground — subtle animated gradient orbs.
 * Render as the first child inside a `position: relative` container.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Orb 1 — purple / top-left */}
      <div
        className="absolute animate-aurora-1"
        style={{
          top: "-10%",
          left: "-5%",
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Orb 2 — cyan / top-right */}
      <div
        className="absolute animate-aurora-2"
        style={{
          top: "-15%",
          right: "-10%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Orb 3 — blue / bottom-center */}
      <div
        className="absolute animate-aurora-3"
        style={{
          bottom: "-5%",
          left: "30%",
          width: "45%",
          height: "40%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
