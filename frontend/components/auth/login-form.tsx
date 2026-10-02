'use client'

import Link from 'next/link'
import { useState } from 'react'

import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/auth.service'
import { useRouter } from "next/navigation";


export function LoginForm() {
  const router = useRouter();

  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setLoading(true)
    // Placeholder only — no real authentication implemented.
    await authService.login({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    })
    setLoading(false)

    router.push("/dashboard");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" name="password" placeholder="Enter your password" autoComplete="current-password" required />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={setRemember} />
          Remember me
        </label>
        <Link href="#" className="text-sm font-medium text-primary hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="gradient" size="lg" disabled={loading} className="mt-1 w-full">
        {loading ? 'Logging in…' : 'Login'}
      </Button>

      <div className="relative py-1 text-center">
        <span className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-border" />
        <span className="bg-card px-3 text-xs text-muted-foreground">OR</span>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New to PrepMate?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  )
}
