'use client'

import {
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Interviews', href: '/dashboard#interviews', icon: ListChecks },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '#', icon: Settings },
]

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="px-2 py-3">
        <Logo />
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active =
            item.href === pathname ||
            (item.href.startsWith('/dashboard') && pathname === '/dashboard' && item.label === 'Dashboard') ||
            (item.href === '/profile' && pathname === '/profile')
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/12 text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Link
        href="/login"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="size-[18px]" />
        Logout
      </Link>
    </div>
  )
}
