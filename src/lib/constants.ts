export const ROLES = {
  ADMIN: "ADMIN" as const,
  TEACHER: "TEACHER" as const,
  STUDENT: "STUDENT" as const,
  PARENT: "PARENT" as const,
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const LOCALES = ["fr", "ar", "en"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "fr"
