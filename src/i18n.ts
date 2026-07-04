import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import type { Locale } from "./lib/constants"

export const locales = ["fr", "ar", "en"] as const
export const defaultLocale = "fr" as const

export const routing = {
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: "always" as const,
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(locales, requested) ? requested : defaultLocale

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})
