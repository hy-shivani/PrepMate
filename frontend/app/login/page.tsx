import type { Metadata } from 'next'


import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login — PrepMate',
  description: 'Log in to your PrepMate account.',
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your interview preparation."
    >
      <LoginForm />
    </AuthShell>
  )
}
