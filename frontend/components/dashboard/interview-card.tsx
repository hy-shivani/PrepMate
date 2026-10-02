import Link from 'next/link'
import { ArrowRight, CalendarClock } from 'lucide-react'

import { StatusBadge, TypeBadge } from '@/components/dashboard/interview-meta'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Interview } from '@/types'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function InterviewCard({ interview }: { interview: Interview }) {
  const cta = interview.status === 'scheduled' ? 'View details' : 'Continue'
  return (
    <Card className="flex h-full flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-brand-blue/5">
      <div className="flex items-start justify-between gap-3">
        <TypeBadge type={interview.type} />
        <StatusBadge status={interview.status} />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{interview.title}</h3>
      <div className="mt-auto flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarClock className="size-3.5" />
          {formatDate(interview.date)}
        </span>
        <Link
          href="#"
          className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'text-primary' })}
        >
          {cta}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  )
}
