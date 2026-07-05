"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Lightbulb, Heart, Shield, Star } from "lucide-react"

interface ValuesProps {
  t: (key: string) => string
}

const items = [
  { num: "01", icon: Lightbulb, key: "item1" },
  { num: "02", icon: Heart, key: "item2" },
  { num: "03", icon: Shield, key: "item3" },
  { num: "04", icon: Star, key: "item4" },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function Values({ t }: ValuesProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="bg-black py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#d4b45a] tracking-widest text-sm font-semibold uppercase block mb-4">
            {t("landing.values.badge")}
          </span>
          <h2 className="text-[#d4b45a] text-4xl font-serif mb-4">
            {t("landing.values.title")}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t("landing.values.subtitle")}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((item) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.num}
                variants={cardVariants}
                className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#006233]/50"
              >
                <div className="text-5xl font-bold text-gray-800 mb-4">
                  {item.num}
                </div>
                <Icon className="w-10 h-10 text-[#006233] mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">
                  {t(`landing.values.${item.key}.name`)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {t(`landing.values.${item.key}.desc`)}
                </p>
                <div className="bg-[#006233] h-0.5 w-12" />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
