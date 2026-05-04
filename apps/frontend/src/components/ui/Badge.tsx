import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  success: "bg-success/10 text-emerald-200 ring-success/20",
  warning: "bg-warning/10 text-amber-200 ring-warning/20",
  danger: "bg-danger/10 text-red-200 ring-danger/20",
  info: "bg-cyan/10 text-cyan-200 ring-cyan/20",
  neutral: "bg-white/[0.06] text-slate-300 ring-white/10"
};

export function Badge({ className, tone = "neutral", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1",
        tones[tone],
        className
      )}
      {...props}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
