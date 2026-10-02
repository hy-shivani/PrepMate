"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SkillsInputProps {
  skills: string[]
  onChange: (skills: string[]) => void
}

export function SkillsInput({ skills, onChange }: SkillsInputProps) {
  const [draft, setDraft] = useState("")

  function addSkill() {
    const value = draft.trim()
    if (!value) return
    if (skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setDraft("")
      return
    }
    onChange([...skills, value])
    setDraft("")
  }

  function removeSkill(skill: string) {
    onChange(skills.filter((s) => s !== skill))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return
            if (e.key === "Enter") {
              e.preventDefault()
              addSkill()
            }
          }}
          placeholder="Add a skill and press Enter"
          aria-label="Add a skill"
        />
        <Button type="button" variant="outline" size="icon" onClick={addSkill} aria-label="Add skill">
          <Plus className="size-4" />
        </Button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-0.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
                aria-label={`Remove ${skill}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
