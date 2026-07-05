"use client"

import { motion } from "framer-motion"
import { ArrowRight, GraduationCap, BookOpen, Users, Award } from "lucide-react"

interface DivisionsProps {
  t: (key: string) => string
}

const divisionCards = [
  { key: "preschool", icon: Users },
  { key: "primary", icon: BookOpen },
  { key: "middle", icon: GraduationCap },
  { key: "high", icon: Award },
]

const divisionDetails = [
  { key: "preschool", age: "3-5 ans", icon: Users },
  { key: "primary", age: "6-11 ans", icon: BookOpen },
  { key: "middle", age: "12-15 ans", icon: GraduationCap },
  { key: "high", age: "16-18 ans", icon: Award },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
}

const imageReveal = {
  hidden: { width: "0%" },
  visible: {
    width: "100%",
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export default function Divisions({ t }: DivisionsProps) {
  return (
    <>
      {/* Sub-section 1: Vision + Division Cards */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: Text */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6"
            >
              <span className="text-[#d4b45a] tracking-widest text-sm font-semibold uppercase block">
                {t("landing.vision.badge")}
              </span>
              <h2 className="text-[#d4b45a] text-4xl md:text-5xl font-serif leading-tight">
                {t("landing.vision.heading")}
              </h2>
              <p className="text-white text-lg font-semibold">
                {t("landing.vision.statement")}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {t("landing.vision.body")}
              </p>
            </motion.div>

            {/* Right: 2x2 Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-2 gap-4"
            >
              {divisionCards.map(({ key, icon: Icon }) => (
                <motion.div
                  key={key}
                  variants={cardVariants}
                  className="group bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4b45a]/50 cursor-pointer"
                >
                  <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#d4b45a]/20 to-[#006233]/10 mb-4 flex items-center justify-center relative overflow-hidden">
                    <Icon className="w-8 h-8 text-[#d4b45a]/60" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">
                    {t(`landing.divisions.${key}.name`)}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {t(`landing.divisions.${key}.desc`)}
                  </p>
                  <ArrowRight className="w-4 h-4 text-[#d4b45a] mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sub-section 2: Individual Division Details */}
      {divisionDetails.map(({ key, age, icon: Icon }, index) => {
        const isEven = index % 2 === 0

        return (
          <section
            key={key}
            className={`py-16 px-4 ${isEven ? "bg-[#0a0a0a]" : "bg-[#050505]"}`}
          >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <motion.div
                variants={isEven ? fadeInLeft : fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className={`relative ${isEven ? "order-1" : "order-2"}`}
              >
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#d4b45a]/20 to-[#006233]/10 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, #d4b45a 1px, transparent 1px),
                        linear-gradient(-45deg, #d4b45a 1px, transparent 1px),
                        repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(212, 180, 90, 0.08) 30px, rgba(212, 180, 90, 0.08) 31px),
                        repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(212, 180, 90, 0.08) 30px, rgba(212, 180, 90, 0.08) 31px)
                      `,
                      backgroundSize: "60px 60px, 60px 60px, 100% 100%, 100% 100%",
                    }}
                  />
                  <motion.div
                    variants={imageReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="absolute inset-0 bg-[#0a0a0a] origin-left"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-[#d4b45a]/40" />
                  </div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                variants={isEven ? fadeInRight : fadeInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className={`space-y-4 ${isEven ? "order-2" : "order-1"}`}
              >
                <span className="text-[#d4b45a] text-sm font-semibold tracking-widest uppercase">
                  {age}
                </span>
                <h2 className="text-[#d4b45a] text-3xl md:text-4xl font-serif leading-tight">
                  {t(`landing.divisions.${key}.name`)}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {t(`landing.divisions.${key}.description`)}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[#d4b45a] font-medium hover:gap-3 transition-all duration-300 group"
                >
                  {t("landing.divisions.cta")}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </motion.div>
            </div>
          </section>
        )
      })}
    </>
  )
}
