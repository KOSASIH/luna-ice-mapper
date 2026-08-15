import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700/80",
        cyan: "border border-sky-500/30 bg-sky-950/60 text-sky-400 hover:bg-sky-900/60",
        success: "border border-emerald-500/30 bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60",
        destructive: "border border-rose-500/30 bg-rose-950/60 text-rose-400 hover:bg-rose-900/60",
        glow: "border border-sky-400/50 bg-sky-950/80 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.4)]",
        outline: "border border-slate-600 text-slate-300 hover:bg-slate-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
