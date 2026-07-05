"use client"

import { motion } from "framer-motion"
import { Phone, MapPin, Mail, ArrowRight } from "lucide-react"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const easeOut = [0.25, 0.1, 0.25, 1] as const

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
}

const socials = [
  { label: "Y", href: "#" },
  { label: "in", href: "#" },
  { label: "F", href: "#" },
  { label: "I", href: "#" },
]

export default function Admission({ t }: { t: (key: string) => string }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,28,32,0.15)_0%,_transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <div className="size-16 rounded-full border border-[#d4b45a]/30 flex items-center justify-center text-[#d4b45a]/60">
            <span className="text-3xl font-serif italic">M</span>
          </div>
        </motion.div>

        <motion.span
          variants={itemVariants}
          className="inline-block text-[#d4b45a] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-4"
        >
          {t("landing.admission.badge")}
        </motion.span>

        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#d4b45a] leading-tight mb-6"
        >
          {t("landing.admission.title")}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          {t("landing.admission.text")}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="/login"
            className="group inline-flex items-center gap-2 bg-[#8b1c20] hover:bg-[#d4b45a] hover:text-black text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {t("landing.admission.cta1")}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 border border-gray-600 hover:border-[#d4b45a] text-gray-300 hover:text-[#d4b45a] font-semibold px-8 py-3.5 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {t("landing.admission.cta2")}
          </a>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500 mb-8"
        >
          <span className="inline-flex items-center gap-2">
            <Phone className="size-4 text-[#d4b45a]/70" />
            {t("landing.contact.phone")}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-[#d4b45a]/70" />
            {t("landing.contact.address")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="size-4 text-[#d4b45a]/70" />
            {t("landing.contact.email")}
          </span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="size-9 rounded-full border border-gray-700 hover:border-[#d4b45a] text-gray-400 hover:text-[#d4b45a] text-xs font-bold flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              {s.label}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
