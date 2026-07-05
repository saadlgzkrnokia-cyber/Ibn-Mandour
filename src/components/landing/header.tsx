"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface HeaderProps {
  t: (key: string) => string
}

function getNavLinks(t: (key: string) => string) {
  return [
    { label: t("nav.home"), href: "#accueil" },
    { label: t("nav.about"), href: "#a-propos" },
    { label: t("nav.paths"), href: "#parcours" },
    { label: t("landing.news.title"), href: "#actualites" },
    { label: t("nav.contact"), href: "#contact" },
  ]
}

export default function Header({ t }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navLinks = getNavLinks(t)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#050505]/95 backdrop-blur-xl h-16 shadow-lg shadow-black/20"
            : "bg-transparent h-20"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006233] transition-transform duration-300 group-hover:scale-105">
              <span className="font-serif text-lg font-bold text-[#d4b45a]">LM</span>
            </div>
              <span className="hidden text-lg font-semibold tracking-wide text-[#d4b45a] sm:block">
                {t("landing.header.title")}
              </span>
          </Link>

          {/* Center: Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-[#d4b45a]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden rounded-md bg-[#8b1c20] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#a32226] hover:shadow-lg hover:shadow-[#8b1c20]/30 sm:block"
            >
              {t("nav.login")}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative flex h-10 w-10 items-center justify-center md:hidden"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <motion.div
                className="flex flex-col items-center justify-center gap-[5px]"
                animate={mobileOpen ? "open" : "closed"}
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 7 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="block h-[2px] w-6 bg-[#d4b45a]"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="block h-[2px] w-6 bg-[#d4b45a]"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -7 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="block h-[2px] w-6 bg-[#d4b45a]"
                />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[#050505]/98 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-medium text-gray-300 transition-colors duration-200 hover:text-[#d4b45a]"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.08, duration: 0.3 }}
            >
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-4 block rounded-md bg-[#8b1c20] px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:bg-[#a32226]"
              >
                {t("nav.login")}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
