"use client";

import { motion } from "framer-motion";
import { Target, BookOpen } from "lucide-react";

interface MissionProps {
  t: (key: string) => string;
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const imageReveal = {
  hidden: { width: "0%" },
  visible: {
    width: "100%",
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Mission({ t }: MissionProps) {
  return (
    <section className="py-24 px-4 bg-[#050505]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-6"
        >
          <span className="text-[#d4b45a] text-sm font-semibold tracking-[0.2em] uppercase">
            {t("landing.mission.badge")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#d4b45a] leading-tight">
            {t("landing.mission.heading")}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {t("landing.mission.body")}
          </p>
          <p className="text-gray-400 text-lg leading-relaxed">
            {t("landing.mission.body2")}
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[#d4b45a] font-medium hover:gap-3 transition-all duration-300"
          >
            Lire la suite
            <span className="text-lg leading-none" aria-hidden="true">
              →
            </span>
          </a>
        </motion.div>

        {/* Right Column */}
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative"
        >
          {/* First Image */}
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#006233]/20 to-[#d4b45a]/10 relative overflow-hidden">
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
              className="absolute inset-0 bg-[#050505] origin-left"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-[#d4b45a]/40" />
            </div>
          </div>

          {/* Second Image */}
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#d4b45a]/10 to-[#006233]/20 relative overflow-hidden mt-[-2rem] ml-[2rem]">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #006233 1px, transparent 1px),
                  linear-gradient(-45deg, #006233 1px, transparent 1px),
                  repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(0, 98, 51, 0.08) 30px, rgba(0, 98, 51, 0.08) 31px),
                  repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(0, 98, 51, 0.08) 30px, rgba(0, 98, 51, 0.08) 31px)
                `,
                backgroundSize: "60px 60px, 60px 60px, 100% 100%, 100% 100%",
              }}
            />
            <motion.div
              variants={imageReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute inset-0 bg-[#050505] origin-left"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="w-12 h-12 text-[#006233]/40" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
