"use client"

import { useEffect, useState } from "react"
import type { Interview } from "@/types"
import { mockInterviews } from "@/lib/mock-data"

/**
 * Placeholder data hook. Swap the mock source for interviewService.list()
 * once the backend is connected.
 */
export function useInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setInterviews(mockInterviews)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return { interviews, loading }
}
