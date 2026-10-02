import type { Metadata } from 'next'

import { AuthShell } from '@/components/auth/auth-shell'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up — PrepMate',
  description: 'Create your PrepMate account and start acing interviews with AI.',
}

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start preparing smarter with your AI interview companion."
    >
      <SignupForm />
    </AuthShell>
  )
}
