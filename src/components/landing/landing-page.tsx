"use client"

import { useTranslations } from "next-intl"
import ScrollProvider from "@/components/landing/scroll-provider"
import Header from "@/components/landing/header"
import Hero from "@/components/landing/hero"
import Values from "@/components/landing/values"
import Awards from "@/components/landing/awards"
import ExperienceGrid from "@/components/landing/experience-grid"
import Mission from "@/components/landing/mission"
import HonorCode from "@/components/landing/honor-code"
import Passions from "@/components/landing/passions"
import Activities from "@/components/landing/activities"
import Divisions from "@/components/landing/divisions"
import Admission from "@/components/landing/admission"
import Footer from "@/components/landing/footer"

export default function LandingPage() {
  const t = useTranslations()

  return (
    <ScrollProvider>
      <Header t={t} />
      <main>
        <section id="accueil">
          <Hero t={t} />
        </section>
        <section id="valeurs">
          <Values t={t} />
        </section>
        <section id="awards">
          <Awards t={t} />
        </section>
        <ExperienceGrid />
        <section id="a-propos">
          <Mission t={t} />
        </section>
        <HonorCode t={t} />
        <Passions t={t} />
        <section id="actualites">
          <Activities t={t} />
        </section>
        <section id="parcours">
          <Divisions t={t} />
        </section>
        <section id="contact">
          <Admission t={t} />
        </section>
      </main>
      <Footer t={t} />
    </ScrollProvider>
  )
}
