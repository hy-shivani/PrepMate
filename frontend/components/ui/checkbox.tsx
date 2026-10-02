'use client'

import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

type CheckboxProps = Omit<ComponentProps<'button'>, 'onChange'> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({
  className,
  checked = false,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-slot="checkbox"
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors',
        'focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
        checked ? 'border-primary bg-primary text-primary-foreground' : 'bg-background',
        className,
      )}
      {...props}
    >
      {checked ? <Check className="size-3" strokeWidth={3} /> : null}
    </button>
  )
}

export { Checkbox }
