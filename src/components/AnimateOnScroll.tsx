'use client'

import { motion, useInView, type Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface Props {
    children: ReactNode
    variants?: Variants
    delay?: number
    className?: string
}

export default function AnimateOnScroll({
    children,
    variants,
    delay = 0,
    className,
}: Props) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            custom={delay}
            className={className}
        >
            {children}
        </motion.div>
    )
}
