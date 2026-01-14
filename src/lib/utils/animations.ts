import { Variants } from 'framer-motion'

// Page transition variants
export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
        },
    },
}

// Stagger children animation
export const staggerContainer: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

export const staggerItem: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
}

// Fade in animations
export const fadeInUp: Variants = {
    initial: {
        opacity: 0,
        y: 30,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
}

export const fadeInLeft: Variants = {
    initial: {
        opacity: 0,
        x: -30,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
}

export const fadeInRight: Variants = {
    initial: {
        opacity: 0,
        x: 30,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
}

// Scale animations
export const scaleIn: Variants = {
    initial: {
        opacity: 0,
        scale: 0.9,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
}

// Hover animations
export const hoverScale: Variants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
}

export const hoverLift: Variants = {
    initial: {
        y: 0,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    hover: {
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
}

// Button animations
export const buttonTap: Variants = {
    tap: {
        scale: 0.95,
        transition: {
            duration: 0.1,
        },
    },
}

// Loading animations
export const pulseAnimation: Variants = {
    initial: {
        opacity: 0.5,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
        },
    },
}

// Glitch effect for redaction
export const glitchEffect: Variants = {
    initial: {
        x: 0,
    },
    animate: {
        x: [0, -2, 2, -2, 2, 0],
        transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 5,
        },
    },
}

// Radar scan animation
export const radarScan: Variants = {
    initial: {
        rotate: 0,
    },
    animate: {
        rotate: 360,
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
        },
    },
}

// Encryption animation
export const encryptionPulse: Variants = {
    initial: {
        scale: 1,
        opacity: 0.8,
    },
    animate: {
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
}

// Text reveal animation
export const textReveal: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: i * 0.1,
            ease: 'easeOut',
        },
    }),
}

// Parallax scroll
export const parallaxScroll = (y: number = 50) => ({
    initial: {
        y,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
})

// Utility function for staggered animation
export function createStaggerAnimation(delay: number = 0.1) {
    return {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: i * delay,
                ease: 'easeOut',
            },
        }),
    }
}