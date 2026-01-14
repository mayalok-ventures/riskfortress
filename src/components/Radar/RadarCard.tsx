'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Users, Building, Cpu, Globe, Target } from 'lucide-react'
import { cn } from '@/lib/utils/formatters'

interface RadarCardProps {
    id: number
    title: string
    sector: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low'
    probability: string
    icon: React.ComponentType<any>
    description: string
    keywords: string[]
    isActive: boolean
}

const severityColors = {
    Critical: 'bg-red-500 border-red-500/30',
    High: 'bg-orange-500 border-orange-500/30',
    Medium: 'bg-yellow-500 border-yellow-500/30',
    Low: 'bg-green-500 border-green-500/30',
}

const sectorColors = {
    Industrial: 'text-industrial',
    Technical: 'text-intelligence',
    HNI: 'text-legacy',
    Strategic: 'text-purple-500',
    Corporate: 'text-gray-400',
}

const sectorIcons = {
    Industrial: Building,
    Technical: Cpu,
    HNI: Users,
    Strategic: Globe,
    Corporate: Shield,
}

export default function RadarCard({
    title,
    sector,
    severity,
    probability,
    icon: Icon,
    description,
    keywords,
    isActive,
}: RadarCardProps) {
    const SectorIcon = sectorIcons[sector as keyof typeof sectorIcons] || AlertTriangle

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative p-6 rounded-2xl border-2 transition-all cursor-pointer",
                isActive
                    ? "border-intelligence bg-intelligence/5 shadow-intelligence"
                    : "border-gray-800 bg-gray-900/50 hover:border-intelligence/30"
            )}
        >
            {/* Severity Badge */}
            <div className="absolute -top-2 -right-2 z-10">
                <div className={cn(
                    "px-3 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1",
                    severityColors[severity]
                )}>
                    <Target className="h-3 w-3" />
                    <span>{severity}</span>
                </div>
            </div>

            {/* Header */}
            <div className="flex items-start space-x-4 mb-4">
                <div className={cn(
                    "p-3 rounded-xl",
                    isActive ? "bg-intelligence/20" : "bg-gray-800"
                )}>
                    <Icon className={cn(
                        "h-6 w-6",
                        isActive ? "text-intelligence" : "text-gray-400"
                    )} />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                            <div className="flex items-center space-x-2">
                                <span className={cn(
                                    "text-sm font-medium px-2 py-1 rounded-full bg-gray-800/50",
                                    sectorColors[sector as keyof typeof sectorColors]
                                )}>
                                    {sector}
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-sm text-gray-400">{probability} Probability</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 mb-4">
                {keywords.slice(0, 3).map((keyword) => (
                    <span
                        key={keyword}
                        className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300"
                    >
                        {keyword}
                    </span>
                ))}
                {keywords.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-500">
                        +{keywords.length - 3} more
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                    <SectorIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-500">{sector} Sector</span>
                </div>
                <button className="text-xs text-intelligence hover:text-intelligence/80 transition-colors">
                    View Analysis →
                </button>
            </div>

            {/* Active Indicator */}
            {isActive && (
                <div className="absolute inset-0 border-2 border-intelligence/20 rounded-2xl pointer-events-none" />
            )}
        </motion.div>
    )
}