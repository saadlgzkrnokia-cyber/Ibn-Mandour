"use client"

import { motion } from "framer-motion"
import { Trophy, Palette, Music, Beaker } from "lucide-react"

export default function Passions({ t }: { t: (key: string) => string }) {
  const cards = [
    { icon: Palette, key: "item1" },
    { icon: Music, key: "item2" },
    { icon: Beaker, key: "item3" },
    { icon: Trophy, key: "item4" },
  ]

  return (
    <section className="py-24 px-4 bg-[#050505]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#d4b45a] mb-4"
        >
          {t("landing.passions.badge")}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4b45a] font-serif mb-4"
        >
          {t("landing.passions.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 max-w-2xl mx-auto mb-12 text-base leading-relaxed"
        >
          {t("landing.passions.text")}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-[#0f0f0f] border border-[#1c1c1c] hover:border-[#d4b45a]/30 cursor-default transition-colors"
              >
                <Icon className="w-7 h-7 text-[#d4b45a]" />
                <span className="text-sm font-medium text-white">
                  {t(`landing.passions.${card.key}`)}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
