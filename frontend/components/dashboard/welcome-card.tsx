import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface WelcomeCardProps {
  name: string
}

export function WelcomeCard({ name }: WelcomeCardProps) {
  const firstName = name.split(" ")[0]

  return (
    <Card className="relative overflow-hidden border-primary/20 p-6 sm:p-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-10 -top-10 size-56 rounded-full bg-brand-blue/15 blur-[90px]" />
        <div className="absolute -bottom-16 right-24 size-56 rounded-full bg-brand-indigo/15 blur-[90px]" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          Welcome back
        </p>

        <h2 className="mt-1 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {`Hi ${firstName}, ready to practice?`}
        </h2>

        <p className="mt-1 max-w-lg text-pretty text-sm text-muted-foreground">
          Practice with an AI interviewer tailored to your resume.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href="/interviews/new"
          className={buttonVariants({ variant: "gradient", size: "lg" })}
        >
          Start New Interview
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </Card>
  )
}