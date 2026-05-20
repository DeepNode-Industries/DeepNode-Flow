interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const ROUNDED: Record<string, string> = {
  sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg",
  xl: "rounded-xl", "2xl": "rounded-2xl", full: "rounded-full",
};

export function Skeleton({ className = "", style, rounded = "lg" }: SkeletonProps) {
  return (
    <div
      className={`dn-shimmer ${ROUNDED[rounded]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/** A full card skeleton matching dashboard workflow rows */
export function WorkflowRowSkeleton() {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <Skeleton className="w-2 h-2 shrink-0" rounded="full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-2.5 w-28" />
      </div>
      <Skeleton className="h-5 w-14" rounded="full" />
      <Skeleton className="h-4 w-4" rounded="sm" />
    </div>
  );
}

/** Stat card skeleton */
export function StatCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <Skeleton className="w-8 h-8 mb-3" rounded="lg" />
      <Skeleton className="h-7 w-12 mb-1" rounded="md" />
      <Skeleton className="h-3 w-20" rounded="sm" />
    </div>
  );
}
