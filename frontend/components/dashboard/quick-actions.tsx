import Link from 'next/link'
import { ChevronRight, Play, RotateCcw, UserCog } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'

const actions: {
  label: string
  description: string
  href: string
  icon: LucideIcon
}[] = [
    {
      label: 'Start Interview',
      description: 'Begin a new AI mock interview',
      href: '/interviews/new',
      icon: Play,
    },
    {
      label: 'Continue Practice',
      description: 'Resume your in-progress session',
      href: '#interviews',
      icon: RotateCcw,
    },
    {
      label: 'Edit Profile',
      description: 'Update your details & skills',
      href: '/profile',
      icon: UserCog,
    },
  ]

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {actions.map((action) => (
        <Link key={action.label} href={action.href} className="group">
          <Card className="flex h-full items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-brand-blue/5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-indigo text-white">
              <action.icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{action.label}</p>
              <p className="truncate text-xs text-muted-foreground">{action.description}</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Card>
        </Link>
      ))}
    </div>
  )
}
