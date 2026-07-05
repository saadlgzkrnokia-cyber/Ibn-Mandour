"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Check } from "lucide-react"

interface HonorCodeProps {
  t: (key: string) => string
}

const principles = [
  { key: "1", text: "L'Excellence dans l'effort" },
  { key: "2", text: "L'Intégrité dans l'action" },
  { key: "3", text: "Le Respect de l'autre" },
  { key: "4", text: "La Responsabilité citoyenne" },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function HonorCode({ t }: HonorCodeProps) {
  return (
    <section className="py-24 px-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <ShieldCheck className="w-24 h-24 text-[#006233]/20 mb-6" strokeWidth={1.5} />
            <span className="text-[#d4b45a] tracking-widest text-sm font-semibold uppercase block mb-4">
              {t("landing.honor.badge")}
            </span>
            <h2 className="text-[#d4b45a] text-4xl font-serif mb-4">
              {t("landing.honor.title")}
            </h2>
            <p className="text-gray-400 max-w-xl mb-8">
              {t("landing.honor.text")}
            </p>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {principles.map((p) => (
                <motion.li
                  key={p.key}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <Check className="w-5 h-5 text-[#006233] mt-0.5 flex-shrink-0" />
                  <span className="text-white">
                    {t(`landing.honor.principles.${p.key}`)}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#d4b45a]/20">
              <div className="absolute inset-0 bg-[#0f0f0f]" />
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #006233 25%, transparent 25%),
                    linear-gradient(-45deg, #006233 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #006233 75%),
                    linear-gradient(-45deg, transparent 75%, #006233 75%)
                  `,
                  backgroundSize: "40px 40px",
                  backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
                }}
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(135deg, #d4b45a 2px, transparent 2px),
                    linear-gradient(225deg, #d4b45a 2px, transparent 2px)
                  `,
                  backgroundSize: "60px 60px",
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-10"
                style={{
                  background: `
                    conic-gradient(from 0deg, #d4b45a 0deg 30deg, transparent 30deg 60deg, #d4b45a 60deg 90deg, transparent 90deg 120deg, #d4b45a 120deg 150deg, transparent 150deg 180deg, #d4b45a 180deg 210deg, transparent 210deg 240deg, #d4b45a 240deg 270deg, transparent 270deg 300deg, #d4b45a 300deg 330deg, transparent 330deg 360deg)
                  `,
                  borderRadius: "50%",
                }}
              />
              <div className="absolute top-6 left-6 right-6 h-px bg-gradient-to-r from-[#d4b45a]/60 via-[#d4b45a]/20 to-transparent" />
              <div className="absolute top-6 left-6 bottom-6 w-px bg-gradient-to-b from-[#d4b45a]/60 via-[#d4b45a]/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <p className="text-[#d4b45a] italic text-center text-lg leading-relaxed font-light">
                  &ldquo;L&apos;honneur est une façon de vivre&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
