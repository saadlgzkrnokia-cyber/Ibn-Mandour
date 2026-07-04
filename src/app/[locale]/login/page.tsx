"use client"

import { useTranslations } from "next-intl"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const t = useTranslations("auth")
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email ou mot de passe incorrect")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
      <div
        className="w-full max-w-md bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl p-8 sm:p-10 shadow-2xl
                    [background:radial-gradient(ellipse_at_top_right,rgba(0,98,51,0.03),transparent_70%)_#0f0f0f]"
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-full border border-[rgba(212,180,90,0.08)] bg-[rgba(0,98,51,0.06)]
                        flex items-center justify-center mx-auto mb-4"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4b45a" strokeWidth="1.2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-xl font-serif text-[#d4b45a] mb-1">
            Lycée Ibn Mandour
          </h1>
          <p className="text-sm text-gray-500">{t("loginTitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#d4b45a] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00884a]" />
              {t("email")}
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl text-[#ececec]
                         placeholder-gray-600 outline-none transition-all
                         focus:border-[#006233] focus:ring-2 focus:ring-[rgba(0,98,51,0.12)] focus:scale-[1.005]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#d4b45a] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00884a]" />
              {t("password")}
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl text-[#ececec]
                         placeholder-gray-600 outline-none transition-all
                         focus:border-[#006233] focus:ring-2 focus:ring-[rgba(0,98,51,0.12)] focus:scale-[1.005]"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#006233] w-4 h-4" />
              {t("rememberMe")}
            </label>
            <a href="#" className="text-[#00884a] hover:text-[#d4b45a] transition-colors">
              {t("forgotPassword")}
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#8b1c20] to-[#6e1417] text-white rounded-xl font-semibold
                       relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(0,98,51,0.2)]
                       hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60
                       before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#006233] before:to-[#00884a]
                       before:opacity-0 before:transition-opacity before:duration-300
                       hover:before:opacity-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              {loading ? "..." : t("login")}
            </span>
          </button>
        </form>
      </div>
    </main>
  )
}
