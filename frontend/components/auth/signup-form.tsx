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

export function SignupForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!agreed) return;

    const form = new FormData(e.currentTarget);

    setLoading(true);

    try {
      await authService.signup({
        fullName: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });

      router.push("/login");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" placeholder="Aarav Sharma" autoComplete="name" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" name="password" placeholder="Create a password" autoComplete="new-password" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" autoComplete="new-password" required />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
        <Checkbox checked={agreed} onCheckedChange={setAgreed} className="mt-0.5" />
        <span>
          I agree to the{' '}
          <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and{' '}
          <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
        </span>
      </label>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={!agreed || loading}
        className="mt-1 w-full"
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  )
}
