"use client"

import { useState } from "react"
import { PlusCircle, Search } from "lucide-react"
import { InterviewCard } from "@/components/dashboard/interview-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal } from "@/components/motion/reveal"
import { mockInterviews } from "@/lib/mock-data"
import type { InterviewType } from "@/types"

const filters: { label: string; value: InterviewType }[] = [
  { label: "Technical", value: "technical" },
  { label: "HR", value: "hr" },
  { label: "Aptitude", value: "aptitude" },
]

export default function InterviewsPage() {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState<InterviewType>("technical")

  const interviews = mockInterviews.filter((i) => {
    const matchesType = i.type === active
    const matchesQuery = i.title.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesQuery
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Interviews</h1>
          <p className="text-sm text-muted-foreground">Browse your practice sessions and start new ones.</p>
        </div>
        <Button variant="gradient">
          <PlusCircle className="size-4" />
          New Interview
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${active === f.value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search interviews..."
            className="pl-9"
            aria-label="Search interviews"
          />
        </div>
      </div>

      {interviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview, i) => (
            <Reveal key={interview.id} delay={i * 0.05}>
              <InterviewCard interview={interview} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-sm text-muted-foreground">No interviews match your filters.</p>
        </div>
      )}
    </div>
  )
}
