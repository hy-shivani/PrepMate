import Link from 'next/link'
import { Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Logo({
  className,
  href = '/',
  showText = true,
}: {
  className?: string
  href?: string
  showText?: boolean
}) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-indigo text-white shadow-md shadow-brand-blue/30">
        <Sparkles className="size-[18px]" />
      </span>
      {showText ? (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Prep<span className="text-gradient">Mate</span>
        </span>
      ) : null}
    </Link>
  )
}
