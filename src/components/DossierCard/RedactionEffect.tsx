'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function RedactionEffect() {
    const [lines, setLines] = useState<Array<{ top: number; width: number }>>([])

    useEffect(() => {
        // Generate random redaction lines
        const newLines = Array.from({ length: 15 }).map(() => ({
            top: Math.random() * 100,
            width: 30 + Math.random() * 70,
        }))
        setLines(newLines)
    }, [])

    return (
        <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm z-10 rounded-2xl overflow-hidden">
            {/* Animated scanning line */}
            <motion.div
                className="absolute left-0 right-0 h-0.5 bg-red-500/50"
                animate={{ top: ['0%', '100%'] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}
            />

            {/* Random redaction lines */}
            {lines.map((line, index) => (
                <motion.div
                    key={index}
                    className="absolute h-3 bg-gray-900 rounded-sm"
                    style={{
                        top: `${line.top}%`,
                        width: `${line.width}%`,
                        left: `${Math.random() * 20}%`,
                    }}
                    animate={{
                        opacity: [0.3, 0.7, 0.3],
                        width: [`${line.width}%`, `${line.width + 10}%`, `${line.width}%`],
                    }}
                    transition={{
                        duration: 1.5 + Math.random(),
                        repeat: Infinity,
                        delay: index * 0.1,
                    }}
                />
            ))}

            {/* Warning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8 rounded-xl bg-gray-900/80 border border-red-500/30 backdrop-blur-sm">
                    <div className="text-red-400 text-4xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold text-white mb-2">RESTRICTED ACCESS</h3>
                    <p className="text-gray-400 max-w-md">
                        This dossier requires Level 3 security clearance.
                        Request access through secure channels only.
                    </p>
                    <div className="mt-4 text-xs text-gray-500">
                        AES-256 Encrypted | Need-to-Know Basis | Client Confidential
                    </div>
                </div>
            </div>

            {/* Glitch effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent"
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    )
}