// Consolidated animation variants - Framer Motion compatible
// All animations are type-cast to 'any' to avoid TypeScript easing conflicts

export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8 }
  }
} as any;

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.7 }
  }
} as any;

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
} as any;

export const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8 }
  }
} as any;

export const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8 }
  }
} as any;

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { delay: 0.8, type: "spring", stiffness: 100 }
  }
} as any;

export const floatingAnimation = {
  animate: { y: [0, -15, 0], rotate: [0, 2, 0] },
  transition: { duration: 6, repeat: Infinity }
} as any;

export const rotatingAnimation = {
  animate: { rotate: 360 },
  transition: { duration: 40, repeat: Infinity }
} as any;

export const pulseAnimation = {
  animate: { scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] },
  transition: { duration: 3, repeat: Infinity }
} as any;
