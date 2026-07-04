"use client"

import { usePathname, useRouter } from "@/navigation"
import { useLocale } from "next-intl"
import { LOCALES, type Locale } from "@/lib/constants"

const localeNames: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l as Locale)}
          className={`px-2 py-1 text-xs rounded-lg transition-all ${
            locale === l
              ? "bg-[#006233] text-white font-semibold"
              : "text-gray-500 hover:text-[#d4b45a] hover:bg-[#0f0f0f]"
          }`}
        >
          {l === "ar" ? "ع" : l === "fr" ? "FR" : "EN"}
        </button>
      ))}
    </div>
  )
}
