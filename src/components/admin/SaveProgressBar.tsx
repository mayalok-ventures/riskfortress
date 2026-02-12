'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'

interface Props {
    saving: boolean
    onComplete?: () => void
}

export default function SaveProgressBar({ saving, onComplete }: Props) {
    const [progress, setProgress] = useState(0)
    const [showComplete, setShowComplete] = useState(false)

    useEffect(() => {
        if (!saving) {
            if (progress > 0 && progress < 100) {
                setProgress(100)
                setShowComplete(true)
                const t = setTimeout(() => {
                    setShowComplete(false)
                    setProgress(0)
                    onComplete?.()
                }, 2000)
                return () => clearTimeout(t)
            }
            return
        }

        setProgress(0)
        setShowComplete(false)

        const intervals = [
            setTimeout(() => setProgress(15), 100),
            setTimeout(() => setProgress(35), 300),
            setTimeout(() => setProgress(55), 600),
            setTimeout(() => setProgress(72), 1000),
            setTimeout(() => setProgress(85), 1500),
            setTimeout(() => setProgress(92), 2500),
        ]

        return () => intervals.forEach(clearTimeout)
    }, [saving, onComplete, progress])

    if (!saving && !showComplete && progress === 0) return null

    return (
        <div className="fixed bottom-6 right-6 z-50 w-80">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                    {showComplete ? (
                        <>
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="text-sm font-medium text-green-400">Saved successfully</span>
                        </>
                    ) : (
                        <>
                            <Loader2 className="h-5 w-5 text-intelligence animate-spin" />
                            <span className="text-sm font-medium text-gray-300">Saving content...</span>
                            <span className="ml-auto text-xs text-gray-500">{progress}%</span>
                        </>
                    )}
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                            showComplete ? 'bg-green-500' : 'bg-gradient-to-r from-intelligence to-industrial'
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
