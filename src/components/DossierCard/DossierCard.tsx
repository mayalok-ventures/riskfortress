'use client'

import { motion } from 'framer-motion'
import { Lock, Eye, FileText, AlertTriangle, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import RedactionEffect from './RedactionEffect'

interface DossierCardProps {
    dossier: {
        id: string
        title: string
        sector: string
        threatLevel: string
        confidence: number
        date: string
        location: string
        summary: string
        status: string
        icon: any
        keywords: string[]
    }
}

export default function DossierCard({ dossier }: DossierCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isRedacted, setIsRedacted] = useState(true)

    const threatColors: Record<string, string> = {
        Critical: 'bg-red-500',
        High: 'bg-orange-500',
        Medium: 'bg-yellow-500',
        Low: 'bg-green-500',
    }

    const statusColors: Record<string, string> = {
        Active: 'text-red-400',
        Neutralized: 'text-green-400',
        Monitoring: 'text-yellow-400',
        Resolved: 'text-blue-400',
        Ongoing: 'text-purple-400',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative overflow-hidden rounded-2xl glass-morphism border border-gray-800 hover:border-intelligence/30 transition-all"
        >
            {/* Redaction Overlay */}
            {isRedacted && <RedactionEffect />}

            {/* Header */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-intelligence/10">
                            <dossier.icon className="h-5 w-5 text-intelligence" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{dossier.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                                    {dossier.sector}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${threatColors[dossier.threatLevel]}`}>
                                    {dossier.threatLevel}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Confidence</div>
                            <div className="text-lg font-bold text-intelligence">{dossier.confidence}%</div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <p className="text-gray-400 text-sm mb-4">{dossier.summary}</p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2">
                    {dossier.keywords.map((keyword) => (
                        <span
                            key={keyword}
                            className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>

            {/* Details */}
            <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <div className="text-sm text-gray-400 mb-1">Location</div>
                        <div className="font-medium text-white">{dossier.location}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 mb-1">Date</div>
                        <div className="font-medium text-white">{dossier.date}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 mb-1">Status</div>
                        <div className={`font-medium ${statusColors[dossier.status]}`}>
                            {dossier.status}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 mb-1">Reference</div>
                        <div className="font-mono text-sm text-gray-300">{dossier.id}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <button
                        onClick={() => setIsRedacted(!isRedacted)}
                        className="flex items-center text-sm text-gray-400 hover:text-intelligence transition-colors"
                    >
                        {isRedacted ? (
                            <>
                                <Eye className="h-4 w-4 mr-2" />
                                Request Access
                            </>
                        ) : (
                            <>
                                <Lock className="h-4 w-4 mr-2" />
                                Redact Information
                            </>
                        )}
                    </button>
                    <button className="flex items-center text-sm text-intelligence hover:text-intelligence/80 transition-colors">
                        View Full Dossier
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                </div>
            </div>

            {/* Hover Effect */}
            {isHovered && (
                <div className="absolute inset-0 border-2 border-intelligence/20 rounded-2xl pointer-events-none" />
            )}
        </motion.div>
    )
}