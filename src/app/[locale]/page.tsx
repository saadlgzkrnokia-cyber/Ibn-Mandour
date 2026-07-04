import { useTranslations } from "next-intl"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Star,
  Calendar,
  ArrowRight,
} from "lucide-react"

export default async function Home() {
  const session = await auth()
  if (session?.user) redirect("/dashboard")
  return <LandingPage />
}

function LandingPage() {
  const t = useTranslations()
  const paths = [
    {
      key: "preschool",
      icon: <Users className="w-8 h-8" />,
      ages: "3-5 ans",
    },
    {
      key: "primary",
      icon: <BookOpen className="w-8 h-8" />,
      ages: "6-11 ans",
    },
    {
      key: "middle",
      icon: <GraduationCap className="w-8 h-8" />,
      ages: "12-15 ans",
    },
    {
      key: "high",
      icon: <Award className="w-8 h-8" />,
      ages: "16-18 ans",
    },
  ]

  const stats = [
    { value: "40+", key: "years" },
    { value: "2000+", key: "students" },
    { value: "99%", key: "success" },
    { value: "150+", key: "staff" },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-[#ececec]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-[#1c1c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#006233] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4b45a]" />
              </div>
              <span className="text-base sm:text-lg font-bold text-[#d4b45a] font-serif whitespace-nowrap">
                {t("landing.header.title")}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
              <a href="#about" className="hover:text-[#d4b45a] transition-colors">{t("nav.about")}</a>
              <a href="#paths" className="hover:text-[#d4b45a] transition-colors">{t("nav.paths")}</a>
              <a href="#news" className="hover:text-[#d4b45a] transition-colors">{t("landing.news.title")}</a>
              <a href="#contact" className="hover:text-[#d4b45a] transition-colors">{t("nav.contact")}</a>
            </nav>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-2 bg-[#8b1c20] text-white text-sm rounded-xl font-semibold hover:bg-[#d4b45a] hover:text-black transition-all"
              >
                {t("nav.login")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ===== HERO ===== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(2px 2px at 20% 30%, #d4b45a, transparent),
                radial-gradient(2px 2px at 40% 70%, #d4b45a, transparent),
                radial-gradient(2px 2px at 60% 20%, #006233, transparent),
                radial-gradient(2px 2px at 80% 80%, #006233, transparent),
                radial-gradient(1px 1px at 10% 50%, #d4b45a, transparent),
                radial-gradient(1px 1px at 30% 90%, #d4b45a, transparent),
                radial-gradient(1px 1px at 50% 10%, #006233, transparent),
                radial-gradient(1px 1px at 70% 40%, #d4b45a, transparent),
                radial-gradient(1px 1px at 90% 60%, #006233, transparent),
                radial-gradient(1px 1px at 15% 15%, #d4b45a, transparent),
                radial-gradient(1px 1px at 45% 45%, #006233, transparent),
                radial-gradient(1px 1px at 75% 75%, #d4b45a, transparent),
                radial-gradient(1px 1px at 95% 95%, #006233, transparent)
              `,
              backgroundSize: "200px 200px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#006233]/10 via-transparent to-[#d4b45a]/10" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4b45a]/30 bg-[#d4b45a]/5 text-[#d4b45a] text-xs sm:text-sm mb-6 sm:mb-8">
              <Award className="w-3.5 h-3.5" />
              {t("landing.hero.badge")}
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#d4b45a] font-serif leading-tight mb-4 sm:mb-6">
              {t("landing.hero.title")}
            </h1>
            <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              {t("landing.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#8b1c20] text-white rounded-xl font-semibold hover:bg-[#d4b45a] hover:text-black transition-all text-base flex items-center justify-center gap-2"
              >
                {t("landing.hero.cta")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#about"
                className="w-full sm:w-auto px-8 py-3.5 border border-gray-700 text-gray-300 rounded-xl font-semibold hover:border-[#d4b45a] hover:text-[#d4b45a] transition-all text-base"
              >
                {t("landing.hero.learnMore")}
              </a>
            </div>

            <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.key} className="p-4 rounded-xl bg-white/[0.03] border border-[#1c1c1c]">
                  <div className="text-2xl sm:text-3xl font-bold text-[#d4b45a]">{s.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{t(`landing.stats.${s.key}`)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section id="about" className="py-16 sm:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-[#d4b45a] font-serif mb-4 sm:mb-6">
                  {t("landing.about.title")}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
                  {t("landing.about.text1")}
                </p>
                <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                  {t("landing.about.text2")}
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#006233]/20 to-[#d4b45a]/10 border border-[#1c1c1c] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        linear-gradient(30deg, #d4b45a 12%, transparent 12.5%, transparent 87%, #d4b45a 87.5%),
                        linear-gradient(150deg, #d4b45a 12%, transparent 12.5%, transparent 87%, #d4b45a 87.5%),
                        linear-gradient(30deg, #d4b45a 12%, transparent 12.5%, transparent 87%, #d4b45a 87.5%),
                        linear-gradient(150deg, #d4b45a 12%, transparent 12.5%, transparent 87%, #d4b45a 87.5%)
                      `,
                      backgroundSize: "80px 140px",
                      backgroundPosition: "0 0, 0 0, 40px 70px, 40px 70px",
                    }}
                  />
                  <GraduationCap className="w-16 h-16 sm:w-24 sm:h-24 text-[#d4b45a]/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PATHS ===== */}
        <section id="paths" className="py-16 sm:py-24 px-4 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-[#d4b45a] font-serif mb-4">
                {t("landing.paths.title")}
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
                {t("landing.paths.subtitle")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {paths.map((p) => (
                <div
                  key={p.key}
                  className="group p-6 rounded-2xl bg-[#0f0f0f] border border-[#1c1c1c] hover:border-[#006233]/50 transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#006233]/20 flex items-center justify-center text-[#d4b45a] mb-4 group-hover:bg-[#006233]/30 transition-all">
                    {p.icon}
                  </div>
                  <div className="text-xs text-[#d4b45a]/70 mb-1">{p.ages}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t(`landing.paths.${p.key}.name`)}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t(`landing.paths.${p.key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== NEWS ===== */}
        <section id="news" className="py-16 sm:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-[#d4b45a] font-serif">
                  {t("landing.news.title")}
                </h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                  {t("landing.news.subtitle")}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[#0f0f0f] border border-[#1c1c1c] overflow-hidden hover:border-[#006233]/50 transition-all group cursor-pointer"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-[#006233]/10 to-[#d4b45a]/5 flex items-center justify-center">
                    <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="text-xs text-[#d4b45a] mb-2">
                      {t("landing.news.date")} {i}
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#d4b45a] transition-colors">
                      {t(`landing.news.item${i}.title`)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                      {t(`landing.news.item${i}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-16 sm:py-24 px-4 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-[#d4b45a] font-serif mb-4">
              {t("landing.testimonials.title")}
            </h2>
            <p className="text-gray-500 mb-10 sm:mb-14 text-sm sm:text-base">
              {t("landing.testimonials.subtitle")}
            </p>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0f0f0f] border border-[#1c1c1c] text-left"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-[#d4b45a] text-[#d4b45a]" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4 italic">
                    &ldquo;{t(`landing.testimonials.item${i}.text`)}&rdquo;
                  </p>
                  <div className="text-sm font-semibold text-white">
                    {t(`landing.testimonials.item${i}.name`)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t(`landing.testimonials.item${i}.role`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="py-16 sm:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-bold text-[#d4b45a] font-serif mb-4">
                {t("landing.contact.title")}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                {t("landing.contact.subtitle")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#006233]/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4b45a]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{t("landing.contact.addressLabel")}</div>
                    <div className="text-sm text-gray-500">{t("landing.contact.address")}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#006233]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4b45a]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{t("landing.contact.phoneLabel")}</div>
                    <div className="text-sm text-gray-500">{t("landing.contact.phone")}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#006233]/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4b45a]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{t("landing.contact.emailLabel")}</div>
                    <div className="text-sm text-gray-500">{t("landing.contact.email")}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#0f0f0f] border border-[#1c1c1c] p-5 sm:p-8">
                <div className="mb-4 sm:mb-5">
                  <label className="block text-sm text-gray-400 mb-1.5">{t("landing.contact.formName")}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#1c1c1c] text-white text-sm focus:outline-none focus:border-[#006233] transition-colors"
                    placeholder={t("landing.contact.formNamePlaceholder")}
                  />
                </div>
                <div className="mb-4 sm:mb-5">
                  <label className="block text-sm text-gray-400 mb-1.5">{t("landing.contact.formEmail")}</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#1c1c1c] text-white text-sm focus:outline-none focus:border-[#006233] transition-colors"
                    placeholder={t("landing.contact.formEmailPlaceholder")}
                  />
                </div>
                <div className="mb-5 sm:mb-6">
                  <label className="block text-sm text-gray-400 mb-1.5">{t("landing.contact.formMessage")}</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#1c1c1c] text-white text-sm focus:outline-none focus:border-[#006233] transition-colors resize-none"
                    placeholder={t("landing.contact.formMessagePlaceholder")}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#006233] text-white rounded-xl font-semibold hover:bg-[#00884a] transition-all text-sm"
                >
                  {t("landing.contact.formSubmit")}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#1c1c1c] py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#006233] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-[#d4b45a]" />
                </div>
                <span className="text-base font-bold text-[#d4b45a] font-serif">{t("landing.header.title")}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t("landing.footer.description")}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("landing.footer.quickLinks")}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#about" className="hover:text-[#d4b45a] transition-colors">{t("nav.about")}</a></li>
                <li><a href="#paths" className="hover:text-[#d4b45a] transition-colors">{t("nav.paths")}</a></li>
                <li><a href="#news" className="hover:text-[#d4b45a] transition-colors">{t("landing.news.title")}</a></li>
                <li><a href="#contact" className="hover:text-[#d4b45a] transition-colors">{t("nav.contact")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("landing.footer.contact")}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>{t("landing.contact.address")}</li>
                <li>{t("landing.contact.phone")}</li>
                <li>{t("landing.contact.email")}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("landing.footer.follow")}</h4>
              <div className="flex gap-3">
                {["Facebook", "Twitter", "Instagram", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-9 h-9 rounded-xl bg-[#0f0f0f] border border-[#1c1c1c] flex items-center justify-center text-gray-500 hover:text-[#d4b45a] hover:border-[#d4b45a]/30 transition-all text-xs"
                  >
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-[#1c1c1c] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-600">
            <p>{t("landing.footer.copyright")}</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#d4b45a] transition-colors">{t("landing.footer.privacy")}</a>
              <a href="#" className="hover:text-[#d4b45a] transition-colors">{t("landing.footer.terms")}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
