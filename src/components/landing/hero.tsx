"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronDown, Play } from "lucide-react"

interface HeroProps {
  t: (key: string) => string
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const noAnimation = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
}

export default function Hero({ t }: HeroProps) {
  const prefersReducedMotion = useReducedMotion()
  const geometricLayers = useMemo(() => {
    const dots: { cx: number; cy: number; size: number; color: string; delay: number }[] = []
    const cols = 16
    const rows = 12
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c / (cols - 1)) * 100
        const y = (r / (rows - 1)) * 100
        const isGold = (r + c) % 3 === 0
        const isGreen = (r + c) % 3 === 1
        if (isGold || isGreen) {
          dots.push({
            cx: x,
            cy: y,
            size: isGold ? 2 : 1.5,
            color: isGold ? "#d4b45a" : "#006233",
            delay: (r * cols + c) * 0.008,
          })
        }
      }
    }
    return dots
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Moroccan geometric pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="geom-grid" x="0" y="0" width="6.25" height="8.333" patternUnits="userSpaceOnUse">
            <path d="M3.125 0 L6.25 4.1665 L3.125 8.333 L0 4.1665 Z" fill="none" stroke="#d4b45a" strokeWidth="0.08" opacity="0.3" />
            <circle cx="3.125" cy="4.1665" r="0.5" fill="#006233" opacity="0.25" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#geom-grid)" />
        {!prefersReducedMotion && geometricLayers.map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.size}
            fill={dot.color}
            opacity={0}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: [null, 0.5, 0.15] }}
            animate={{ opacity: [0, 0.4, 0.12], scale: [0, 1.2, 1] }}
            transition={{ duration: 2, delay: dot.delay, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 4 }}
          />
        ))}
      </svg>

      {/* Additional star-like accents */}
      {!prefersReducedMotion && (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(24)].map((_, i) => {
          const x = ((i * 7 + 3) % 100)
          const y = ((i * 13 + 5) % 100)
          const size = 1 + (i % 3) * 0.5
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                backgroundColor: i % 2 === 0 ? "#d4b45a" : "#006233",
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i % 4),
                delay: (i * 0.25) % 5,
                repeat: Infinity,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          )
        })}
      </div>
      )}

      {/* Gradient overlay from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto"
        variants={prefersReducedMotion ? noAnimation : staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Label */}
        <motion.span
          variants={prefersReducedMotion ? noAnimation : fadeIn}
          className="text-[#d4b45a] text-sm tracking-[0.2em] uppercase mb-6"
        >
          ÉTABLISSEMENT D&apos;EXCELLENCE · MEKNÈS
        </motion.span>

        {/* Main Heading */}
        <motion.h1
          variants={prefersReducedMotion ? noAnimation : slideUp}
          className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#d4b45a] leading-tight mb-6"
        >
          Lycée Ibn Mandour
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={prefersReducedMotion ? noAnimation : fadeIn}
          className="text-gray-400 text-lg max-w-2xl mx-auto mb-10"
        >
          Depuis 1954, l&apos;excellence éducative à Meknès
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={prefersReducedMotion ? noAnimation : slideUp}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#8b1c20] text-white font-medium rounded-lg transition-all duration-300 hover:bg-[#d4b45a] hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4b45a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            Espace Élèves
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gray-700 text-gray-300 font-medium rounded-lg transition-all duration-300 hover:border-[#d4b45a] hover:text-[#d4b45a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4b45a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            Découvrir
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.a
          href="#about"
          variants={prefersReducedMotion ? noAnimation : fadeIn}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500 hover:text-[#d4b45a] transition-colors duration-300"
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-[0.15em] uppercase">Scroll</span>
          <motion.span
            animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  )
}
