import { Award, Clock, MessageSquare, Sparkles } from 'lucide-react'

import { Reveal } from '@/components/motion/reveal'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const reasons = [
  {
    icon: Sparkles,
    title: 'Personalized AI Feedback',
    description:
      'Tailored insights on every answer so you know exactly what to improve next.',
  },
  {
    icon: MessageSquare,
    title: 'Real Interview Experience',
    description:
      'Adaptive, conversational rounds that feel just like the real thing.',
  },
  {
    icon: Clock,
    title: 'Practice Anytime',
    description:
      'On-demand mock interviews that fit around your schedule, day or night.',
  },
  {
    icon: Award,
    title: 'Detailed Performance Reports',
    description:
      'Track strengths and weaknesses with clear, exportable analytics.',
  },
]

export function WhyChooseSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="accent" className="mx-auto">Why PrepMate</Badge>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why choose PrepMate
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Built to give you a real edge — smarter feedback, real practice, measurable growth.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 0.06}>
              <Card className="group h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-brand-indigo/10">
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent/12 text-accent">
                  <reason.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-foreground">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
