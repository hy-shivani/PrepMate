import {
  BarChart3,
  Brain,
  Calculator,
  Code,
  FileText,
  Users,
} from 'lucide-react'

import { FeatureCard } from '@/components/home/feature-card'
import { Reveal } from '@/components/motion/reveal'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Code,
    title: 'Technical Interviews',
    description:
      'Practice DSA, system design and role-specific questions with realistic, adaptive AI interviewers.',
  },
  {
    icon: Users,
    title: 'HR Interviews',
    description:
      'Rehearse behavioural and culture-fit rounds and get coached on structure, tone and clarity.',
  },
  {
    icon: Calculator,
    title: 'Aptitude Practice',
    description:
      'Sharpen quantitative, logical and verbal reasoning with timed sets and detailed solutions.',
  },
  {
    icon: Brain,
    title: 'AI Evaluation',
    description:
      'Every answer is scored on correctness, communication and confidence with actionable tips.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description:
      'Visualize your growth over time with streaks, trends and per-topic performance breakdowns.',
  },
  {
    icon: FileText,
    title: 'Interview Reports',
    description:
      'Download detailed reports after each session to review strengths and target weak areas.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="default" className="mx-auto">Features</Badge>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to prepare
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            A complete AI toolkit that covers every stage of your interview journey.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
