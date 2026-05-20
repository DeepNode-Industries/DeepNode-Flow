"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number | string;
  /** Animation duration in seconds */
  duration?: number;
  className?: string;
  /** Custom formatter — receives the current animated integer */
  format?: (n: number) => string;
  /** Delay before animation starts (s) */
  delay?: number;
}

/**
 * Smoothly counts up to `value` using a spring-like easing.
 * Handles string values (like "∞" or "100%") as pass-through.
 */
export function AnimatedNumber({
  value,
  duration = 1.2,
  className,
  format,
  delay = 0,
}: AnimatedNumberProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(String(value));
  const isNumeric = !isNaN(numericValue);

  const [display, setDisplay] = useState(isNumeric ? 0 : value);
  const prevRef = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isNumeric) { setDisplay(value); return; }

    const timer = setTimeout(() => {
      started.current = true;
      const controls = animate(prevRef.current, numericValue, {
        duration,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        onUpdate: (v) => setDisplay(Math.round(v)),
        onComplete: () => { prevRef.current = numericValue; },
      });
      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [numericValue, duration, delay, isNumeric, value]);

  const rendered = typeof display === "number" && format ? format(display) : display;

  return (
    <span className={className} aria-live="polite">
      {typeof value === "string" && isNaN(numericValue)
        ? value
        : rendered}
    </span>
  );
}
