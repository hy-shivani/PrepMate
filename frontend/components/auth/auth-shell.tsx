'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

const highlights = [
  'Practice Technical, HR & Aptitude rounds',
  'Personalized AI feedback on every answer',
  'Track progress with detailed reports',
]

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="relative min-h-dvh bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 size-96 rounded-full bg-brand-blue/15 blur-[130px]" />
        <div className="absolute -right-20 bottom-0 size-96 rounded-full bg-brand-indigo/15 blur-[130px]" />
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between absolute left-4 right-4 top-6 sm:left-6 sm:right-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-border glass shadow-2xl lg:grid-cols-2">
          {/* Brand panel */}
          <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-blue/10 via-brand-indigo/10 to-transparent p-10 lg:flex">
            <Logo />
            <div>
              <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground">
                Ace Every Interview With AI
              </h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                Your personal AI interview companion — prepare smarter and walk in confident.
              </p>
              <ul className="mt-8 flex flex-col gap-3.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 className="size-5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">Trusted by ambitious candidates worldwide.</p>
          </div>

          {/* Form panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card/60 p-8 sm:p-10"
          >
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
