"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Trophy, Palette, BookOpen, ArrowRight } from "lucide-react"

interface ActivitiesProps {
  t: (key: string) => string
}

const sections = [
  {
    key: "sports",
    Icon: Trophy,
    animateLeft: true,
  },
  {
    key: "arts",
    Icon: Palette,
    animateLeft: false,
  },
  {
    key: "academics",
    Icon: BookOpen,
    animateLeft: true,
  },
]

export default function Activities({ t }: ActivitiesProps) {
  return (
    <div className="bg-[#050505]">
      {sections.map(({ key, Icon, animateLeft }) => {
        const isReversed = key === "arts"

        return (
          <SectionBlock
            key={key}
            prefix={key}
            Icon={Icon}
            isReversed={isReversed}
            animateLeft={animateLeft}
            t={t}
          />
        )
      })}
    </div>
  )
}

function SectionBlock({
  prefix,
  Icon,
  isReversed,
  animateLeft,
  t,
}: {
  prefix: string
  Icon: React.ComponentType<{ className?: string }>
  isReversed: boolean
  animateLeft: boolean
  t: (key: string) => string
}) {
  const ref = useRef(null)

  const image = (
    <motion.div
      initial={{ opacity: 0, x: animateLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative aspect-[4/5] rounded-2xl bg-gradient-to-br from-[#006233]/10 to-[#d4b45a]/5 border border-[#1c1c1c] overflow-hidden"
    >
      <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-br from-[#006233]/10 to-[#d4b45a]/5"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="w-24 h-24 text-white/10" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(212, 180, 90, 0.15) 20px,
              rgba(212, 180, 90, 0.15) 21px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 20px,
              rgba(0, 98, 51, 0.1) 20px,
              rgba(0, 98, 51, 0.1) 21px
            )
          `,
        }}
      />
    </motion.div>
  )

  const text = (
    <motion.div
      initial={{ opacity: 0, x: animateLeft ? 60 : -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
    >
      <Icon className="w-16 h-16 text-[#006233]/15 mb-6" />
      <span className="block text-[#d4b45a] text-sm tracking-[0.2em] font-semibold mb-4">
        {t(`landing.${prefix}.badge`)}
      </span>
      <h2 className="text-white font-serif text-4xl mb-6">
        {t(`landing.${prefix}.title`)}
      </h2>
      <p className="text-gray-400 text-lg font-semibold mb-4">
        {t(`landing.${prefix}.subtitle`)}
      </p>
      <p className="text-gray-500 leading-relaxed mb-8">
        {t(`landing.${prefix}.text`)}
      </p>
      <motion.a
        href="#"
        className="inline-flex items-center gap-2 text-[#d4b45a] hover:text-[#e8c96a] transition-colors group text-sm tracking-[0.1em] font-semibold uppercase"
        whileHover={{ x: 4 }}
      >
        {t(`landing.${prefix}.cta`)}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </motion.a>
    </motion.div>
  )

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-20 px-4 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {isReversed ? (
            <>
              {text}
              {image}
            </>
          ) : (
            <>
              {image}
              {text}
            </>
          )}
        </div>
      </div>
    </motion.section>
  )
}
