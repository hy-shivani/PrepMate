"use client"

import { Bell, Moon, Shield, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Reveal } from "@/components/motion/reveal"

const rows = [
  { icon: Bell, title: "Notifications", desc: "Email reminders for practice streaks and reports." },
  { icon: Shield, title: "Privacy", desc: "Control who can see your profile and activity." },
]

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and app preferences.</p>
      </div>

      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="size-4 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Switch between light and dark mode.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-foreground">Theme</span>
            <ThemeToggle />
          </CardContent>
        </Card>
      </Reveal>

      {rows.map((row, i) => (
        <Reveal key={row.title} delay={0.05 * (i + 1)}>
          <Card>
            <CardContent className="flex items-center justify-between gap-4 py-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <row.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{row.title}</p>
                  <p className="text-sm text-muted-foreground">{row.desc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      ))}

      <Reveal delay={0.2}>
        <Card className="border-destructive/30">
          <CardContent className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
                <Trash2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently remove your account and data.</p>
              </div>
            </div>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}
