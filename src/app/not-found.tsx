import { Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="p-4 rounded-2xl glass-morphism mb-8 inline-block">
                        <Shield className="h-12 w-12 text-champagne" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-light mb-6">
                        <span className="text-white">Intelligence</span>{' '}
                        <span className="text-champagne">Not Found</span>
                    </h1>

                    <p className="text-xl text-gray-400 font-light mb-12">
                        The dossier you&apos;re looking for does not exist or has been classified.
                        Return to the secure perimeter.
                    </p>

                    <Link
                        href="/"
                        className="group inline-flex items-center px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light"
                    >
                        <span>Return to RiskFortress</span>
                        <ArrowRight className="h-4 w-4 ml-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
