import { useTranslations } from "next-intl"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return <LandingPage />
}

function LandingPage() {
  const t = useTranslations("nav")

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-[#d4b45a] font-serif mb-4">
        Lycée Ibn Mandour
      </h1>
      <p className="text-gray-400 mb-8">{t("home")}</p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-[#8b1c20] text-white rounded-xl font-semibold hover:bg-[#d4b45a] hover:text-black transition-all"
        >
          {t("login")}
        </a>
      </div>
    </main>
  )
}
