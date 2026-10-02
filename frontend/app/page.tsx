import { CtaSection } from '@/components/home/cta-section'
import { FeaturesSection } from '@/components/home/features-section'
import { Hero } from '@/components/home/hero'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { WhyChooseSection } from '@/components/home/why-choose-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteNavbar } from '@/components/site-navbar'

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteNavbar />
      <main>
        <Hero />
        <FeaturesSection />
        <WhyChooseSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
