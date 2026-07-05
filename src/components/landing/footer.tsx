"use client"

import { motion } from "framer-motion"
import { GraduationCap, ArrowRight } from "lucide-react"

interface FooterProps {
  t: (key: string) => string
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

const quickLinks = [
  { label: "nav.home", href: "/" },
  { label: "nav.about", href: "#a-propos" },
  { label: "nav.paths", href: "#parcours" },
  { label: "nav.news", href: "#actualites" },
  { label: "nav.contact", href: "#contact" },
  { label: "nav.students", href: "/login" },
]

const socials = [
  { label: "F", href: "#" },
  { label: "L", href: "#" },
  { label: "I", href: "#" },
  { label: "Y", href: "#" },
]

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="bg-[#050505] border-t border-[#1c1c1c]">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 - School info */}
          <motion.div variants={fadeUp} className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006233]">
                <span className="font-serif text-lg font-bold text-[#d4b45a]">LM</span>
              </div>
              <span className="font-serif text-lg font-semibold text-[#d4b45a]">
                {t("landing.header.title")}
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {t("landing.footer.description")}
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-xs font-medium text-gray-400 transition-colors duration-200 hover:border-[#d4b45a] hover:text-[#d4b45a]"
                  aria-label={s.label}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 - Quick links */}
          <motion.div variants={fadeUp}>
            <h3 className="text-white font-semibold mb-4">{t("landing.footer.quickLinks")}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-500 text-sm transition-colors duration-200 hover:text-[#d4b45a]"
                  >
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 - Contact */}
          <motion.div variants={fadeUp}>
            <h3 className="text-white font-semibold mb-4">{t("landing.footer.contact")}</h3>
            <div className="space-y-3 text-sm text-gray-500">
              <p>{t("landing.contact.address")}</p>
              <p>{t("landing.contact.phone")}</p>
              <a
                href={`mailto:${t("landing.contact.email")}`}
                className="block transition-colors duration-200 hover:text-[#d4b45a]"
              >
                {t("landing.contact.email")}
              </a>
            </div>
          </motion.div>

          {/* Column 4 - Newsletter / vision */}
          <motion.div variants={fadeUp}>
            <h3 className="text-white font-semibold mb-4">{t("landing.footer.vision")}</h3>
            <p className="text-gray-400 text-sm italic leading-relaxed mb-4">
              &ldquo;{t("landing.footer.quote")}&rdquo;
            </p>
            <div className="w-12 h-0.5 bg-[#d4b45a] mb-4" />
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-sm text-[#d4b45a] transition-opacity duration-200 hover:opacity-80"
            >
              {t("landing.footer.learnMore")}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1c1c1c] pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} {t("landing.footer.copyright")}
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-gray-600 text-xs transition-colors duration-200 hover:text-[#d4b45a]">
              {t("landing.footer.privacy")}
            </a>
            <a href="/terms" className="text-gray-600 text-xs transition-colors duration-200 hover:text-[#d4b45a]">
              {t("landing.footer.terms")}
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
