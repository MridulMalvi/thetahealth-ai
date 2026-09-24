import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
        secondary:
          "border-transparent bg-slate-800 text-slate-300 border border-slate-700",
        destructive:
          "border-transparent bg-rose-500/15 text-rose-400 border border-rose-500/30",
        warning:
          "border-transparent bg-amber-500/15 text-amber-400 border border-amber-500/30",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        outline:
          "text-slate-300 border border-slate-700",
        ai:
          "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            variant === "destructive" && "bg-rose-400 animate-pulse",
            variant === "warning" && "bg-amber-400",
            variant === "success" && "bg-emerald-400",
            variant === "ai" && "bg-cyan-400",
            (!variant || variant === "default") && "bg-cyan-400",
            variant === "secondary" && "bg-slate-400"
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
