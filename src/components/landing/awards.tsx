"use client"

import { Award, Quote } from "lucide-react"
import { motion } from "framer-motion"

export default function Awards({ t }: { t: (key: string) => string }) {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <Quote className="mb-4 h-16 w-16 text-[#006233]/30" strokeWidth={1.5} />
            <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">
              {t("landing.awards.prefix")}
            </p>
            <h2 className="font-serif text-5xl font-bold text-[#d4b45a]">
              {t("landing.awards.title")}
            </h2>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {t("landing.awards.subtitle")}
            </h3>
            <p className="mt-6 max-w-xl leading-relaxed text-gray-400">
              {t("landing.awards.text")}
            </p>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#d4b45a] transition-colors hover:text-[#b8993e]"
            >
              {t("landing.awards.cta")}
              <span className="text-lg leading-none">→</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="flex h-72 w-72 items-center justify-center rounded-full border-2 border-[#d4b45a]/30 p-8 md:h-96 md:w-96">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#d4b45a]/10 to-[#006233]/10">
                <div className="text-center">
                  <Award className="mx-auto h-16 w-16 text-[#d4b45a] md:h-20 md:w-20" />
                  <span className="mt-4 block font-serif text-6xl font-bold text-[#d4b45a] md:text-7xl">
                    1
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
