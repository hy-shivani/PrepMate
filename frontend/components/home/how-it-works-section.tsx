import { Brain, PlusCircle, Rocket, Send } from 'lucide-react'

import { Reveal } from '@/components/motion/reveal'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const steps = [
  {
    step: '01',
    icon: PlusCircle,
    title: 'Create Interview',
    description: 'Pick a type — Technical, HR or Aptitude — and start in seconds.',
  },
  {
    step: '02',
    icon: Send,
    title: 'Answer Questions',
    description: 'Respond to adaptive, role-specific questions at your own pace.',
  },
  {
    step: '03',
    icon: Brain,
    title: 'AI Evaluation',
    description: 'Get instant, personalized scoring and improvement tips.',
  },
  {
    step: '04',
    icon: Rocket,
    title: 'Improve & Get Hired',
    description: 'Track progress, close gaps and walk in with confidence.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="default" className="mx-auto">How it works</Badge>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From practice to placement in 4 steps
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            A simple, guided flow that turns preparation into results.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08}>
              <Card className="relative h-full p-6">
                <span className="text-4xl font-bold text-gradient">{step.step}</span>
                <span className="mt-4 flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <step.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
