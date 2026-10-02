'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  function toggle() {
    // Enable smooth cross-theme transition just for this change
    const root = document.documentElement
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 500)
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        'relative inline-flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-foreground transition-colors hover:bg-secondary',
        className,
      )}
    >
      {mounted ? (
        <>
          <Sun
            className={cn(
              'size-[18px] transition-all duration-300',
              isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
            )}
          />
          <Moon
            className={cn(
              'absolute size-[18px] transition-all duration-300',
              isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0',
            )}
          />
        </>
      ) : (
        <span className="size-[18px]" />
      )}
    </button>
  )
}
