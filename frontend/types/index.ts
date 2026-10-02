export type InterviewType = "technical" | "hr" | "aptitude"

export type InterviewStatus = "completed" | "in-progress" | "scheduled"

export interface Interview {
  id: string
  title: string
  type: InterviewType
  score: number | null
  date: string
  status: InterviewStatus
  questionCount: number
  durationMins: number
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  streak: number
}

export interface Profile {
  id: string
  name: string
  email: string
  avatarUrl?: string
  college: string
  branch: string
  graduationYear: number
  skills: string[]
  github: string
  linkedin: string
  bio: string
  resumeName?: string
}

export interface AuthPayload {
  email: string
  password: string
}

export interface SignupPayload extends AuthPayload {
  fullName: string
}
