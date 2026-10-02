import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}) {
  return (
    <Card
      className={cn(
        'group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-brand-blue/10',
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/15 to-brand-indigo/15 text-primary transition-colors group-hover:from-brand-blue group-hover:to-brand-indigo group-hover:text-white">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </Card>
  )
}
