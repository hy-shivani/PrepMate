'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradient + animated blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-[130px] dark:bg-brand-blue/25" />
        <motion.div
          className="absolute -left-20 top-24 size-72 rounded-full bg-brand-indigo/20 blur-[110px]"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-16 top-40 size-72 rounded-full bg-brand-cyan/20 blur-[110px]"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mx-auto gap-1.5 border-primary/30 bg-primary/10 py-1 text-primary lg:mx-0">
              <Sparkles className="size-3.5" />
              Powered by AI
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Ace Every Interview With <span className="text-gradient">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            Prepare smarter with PrepMate, your personal AI interview companion. Practice
            Technical, HR and Aptitude interviews, receive personalized AI feedback, monitor
            your progress, and build confidence for your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link
              href="/signup"
              className={buttonVariants({ variant: 'gradient', size: 'xl', className: 'w-full sm:w-auto' })}
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: 'outline', size: 'xl', className: 'w-full sm:w-auto' })}
            >
              Login
            </Link>
          </motion.div>
        </div>

        {/* Illustration + floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border glass shadow-2xl shadow-brand-blue/10">
            <Image
              src="/hero-ai.png"
              alt="AI interview assistant dashboard illustration"
              width={720}
              height={720}
              priority
              className="h-auto w-full"
            />
          </div>

          <motion.div
            className="absolute -left-4 top-10 flex items-center gap-2 rounded-xl border border-border glass px-3 py-2 shadow-lg sm:-left-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
              <CheckCircle2 className="size-4" />
            </span>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">AI Feedback</p>
              <p className="text-[11px] text-muted-foreground">Instant & personal</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-3 bottom-10 flex items-center gap-2 rounded-xl border border-border glass px-3 py-2 shadow-lg sm:-right-6"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-blue/15 text-brand-blue">
              <TrendingUp className="size-4" />
            </span>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">Score +18%</p>
              <p className="text-[11px] text-muted-foreground">This month</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
