import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Reveal } from '@/components/motion/reveal'
import { buttonVariants } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary/50 px-6 py-16 text-center sm:px-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-[110px]" />
            </div>
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to crack your next interview?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              Join PrepMate and start practicing with an AI that helps you improve with every
              single answer.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className={buttonVariants({ variant: 'gradient', size: 'xl', className: 'w-full sm:w-auto' })}
              >
                Start Practicing
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: 'outline', size: 'xl', className: 'w-full sm:w-auto' })}
              >
                Login
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
