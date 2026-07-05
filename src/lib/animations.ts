import { type Variants, type Transition } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const
const heroEase = [0.16, 1, 0.3, 1] as const
const bouncyEase = [0.34, 1.56, 0.64, 1] as const

const smooth: Transition = { ease, duration: 0.6 }
const spring: Transition = { type: 'spring', stiffness: 300, damping: 24 }

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: smooth },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: smooth },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: smooth },
}

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: smooth },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ease, duration: 0.5 } },
}

export const counterAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { ...smooth, duration: 0.8 } },
}

export const imageReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { ease, duration: 1 },
  },
}

export const slideUp: Variants = {
  hidden: { y: 60 },
  visible: { y: 0, transition: smooth },
}

export const heroText: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ease: heroEase, duration: 0.9 },
  },
}

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: spring },
}

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { ease: bouncyEase, duration: 0.3 } },
  tap: { scale: 0.97 },
}
