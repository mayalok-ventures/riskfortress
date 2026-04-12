// Centralized animation variants for RiskFortress
// Import from here everywhere — keeps animation logic consistent

export const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
    }),
}

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: (delay = 0) => ({
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut', delay },
    }),
}

export const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export const slideInLeft = {
    hidden: { opacity: 0, x: -32 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
}

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
}

export const slideInRight = {
    hidden: { opacity: 0, x: 32 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
}
