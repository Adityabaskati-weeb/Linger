import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/[0.07] bg-gradient-card p-6 shadow-card",
        glow && "shadow-glow",
        className
      )}
      {...props}
    />
  );
}
