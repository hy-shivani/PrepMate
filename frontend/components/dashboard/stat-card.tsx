import { TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Accent = "blue" | "cyan" | "indigo" | "amber"

const accentClasses: Record<Accent, string> = {
  blue: "bg-brand-blue/15 text-brand-blue",
  cyan: "bg-accent/15 text-accent",
  indigo: "bg-brand-indigo/15 text-brand-indigo",
  amber: "bg-amber-500/15 text-amber-500",
}

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: Accent
  hint?: string
}

export function StatCard({ label, value, icon: Icon, accent = "blue", hint }: StatCardProps) {
  return (
    <Card className="p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-brand-blue/5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", accentClasses[accent])}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      {hint ? (
        <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-500">
          <TrendingUp className="size-3.5" />
          {hint}
        </p>
      ) : null}
    </Card>
  )
}
