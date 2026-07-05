"use client"

import {
  GraduationCap, BookOpen, Heart, Star, Music, Palette,
  Trophy, Users, Globe, Sun, Moon, Leaf, Feather, Sparkles,
  Camera, Compass, Mountain, Wind,
  type LucideIcon,
} from "lucide-react"
import { motion } from "framer-motion"

const cells: {
  icon: LucideIcon
  label: string
  accent?: boolean
}[] = [
  { icon: GraduationCap, label: "Graduation" },
  { icon: BookOpen, label: "Library" },
  { icon: Heart, label: "Community", accent: true },
  { icon: Star, label: "Excellence" },
  { icon: Music, label: "Music" },
  { icon: Palette, label: "Art", accent: true },
  { icon: Trophy, label: "Sports" },
  { icon: Users, label: "Diversity" },
  { icon: Globe, label: "Global" },
  { icon: Sun, label: "Outdoor" },
  { icon: Moon, label: "Evening" },
  { icon: Leaf, label: "Nature", accent: true },
  { icon: Feather, label: "Freedom" },
  { icon: Sparkles, label: "Discovery" },
  { icon: Camera, label: "Media", accent: true },
  { icon: Compass, label: "Guidance" },
  { icon: Mountain, label: "Adventure" },
  { icon: Wind, label: "Innovation", accent: true },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
}

const cellVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function ExperienceGrid() {
  return (
    <section className="w-full bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b45a]">
            Our World
          </span>
        </div>
        <h2 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          A place to grow,
          <br />
          discover & thrive.
        </h2>
      </div>

      <div className="px-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-0"
        >
          {cells.map(({ icon: Icon, label, accent }, i) => (
            <motion.div
              key={label}
              variants={cellVariants}
              className="group relative aspect-square overflow-hidden"
            >
              <div
                className={`flex h-full w-full items-center justify-center transition-all duration-500 group-hover:brightness-[1.15] ${
                  accent
                    ? "bg-[#006233]/10"
                    : "bg-[#0a0a0a] bg-gradient-to-br from-[#006233]/5 to-[#d4b45a]/5"
                }`}
              >
                <Icon className="h-8 w-8 text-gray-800 transition-all duration-500 group-hover:text-gray-600 sm:h-10 sm:w-10" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-400 group-hover:opacity-100">
                <span className="text-sm font-medium tracking-wide text-white/90 sm:text-base">
                  {label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
