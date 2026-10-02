"use client"

import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ProfileHeaderProps {
  name: string
  email: string
  avatarUrl?: string
  headline?: string
}

export function ProfileHeader({ name, email, avatarUrl, headline }: ProfileHeaderProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-28 w-full bg-gradient-to-r from-primary via-primary to-accent sm:h-32" />
      <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative -mt-12 sm:-mt-14">
            <Avatar className="size-24 border-4 border-card shadow-lg sm:size-28">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
              <AvatarFallback className="bg-primary/15 text-xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full border border-border bg-secondary text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label="Change profile picture"
            >
              <Camera className="size-4" />
            </button>
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">{name}</h1>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Pro
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{email}</p>
            {headline && <p className="mt-1 text-sm text-muted-foreground">{headline}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
