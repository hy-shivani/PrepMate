"use client"

import { useEffect, useState } from "react"
import type { Profile } from "@/types"
import { mockProfile } from "@/lib/mock-data"

/**
 * Placeholder data hook. Swap the mock source for profileService.getProfile()
 * once the backend is connected.
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile(mockProfile)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return { profile, loading }
}
