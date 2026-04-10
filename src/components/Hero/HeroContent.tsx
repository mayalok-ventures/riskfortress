'use client'

import { ArrowRight, Eye } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Premium Obsidian Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />
                {/* Champagne Gold accent */}
                <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-[0.02]"
                    style={{ background: 'radial-gradient(ellipse, #D4AF37 0%, transparent 70%)' }}
                />
                {/* Abstract minimalist line */}
                <div className="absolute top-1/4 right-0 w-px h-64 bg-gradient-to-b from-transparent via-champagne/20 to-transparent" />
                <div className="absolute bottom-1/4 left-0 w-px h-64 bg-gradient-to-b from-transparent via-champagne/20 to-transparent" />
            </div>

            {/* Animated Smoke Waves - Using CSS animations */}
            <div className="absolute inset-0 z-10 opacity-20 pointer-events-none">
                <div 
                    className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTIwMCA4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTIwMCwwTDAsODAwSDEyMDBWMFoiIGZpbGw9IiNENEFGMzciIG9wYWNpdHk9Ii4wOCIvPjxwYXRoIGQ9Ik0wLDBMMTIwMCw4MDBIMFYwWiIgZmlsbD0iI0Q0QUYzNyIgb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] bg-repeat-x bg-[length:1200px_800px] animate-wave-slow"
                />
                <div 
                    className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTIwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTIwMCwwTDAuMTk0LDYwMC4xOTRIMTIwMFYwWiIgZmlsbD0iI0Q0QUYzNyIgb3BhY2l0eT0iLjEiLz48cGF0aCBkPSJNMCwwTDExOTkuOTU2LDYwMEgwVjBaIiBmaWxsPSIjRDRBRjM3IiBvcGFjaXR5PSIuMDMiLz48L2c+PC9zdmc+')] bg-repeat-x bg-[length:1200px_600px] animate-wave-medium"
                />
                <div 
                    className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTIwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTIwMCwwTDMxMy4xNjYsNDAwSDEyMDBWMFoiIGZpbGw9IiNENEFGMzciIG9wYWNpdHk9Ii4xMiIvPjxwYXRoIGQ9Ik0wLDBMMTIwMCwzOTkuOTg1SDBWMFoiIGZpbGw9IiNENEFGMzciIG9wYWNpdHk9Ii4wNiIvPjwvZz48L3N2Zz4=')] bg-repeat-x bg-[length:1200px_400px] animate-wave-fast"
                />
            </div>

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 z-15 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-0 z-15 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="container relative z-20 mx-auto px-6 py-32">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Strategic Foresight Badge - CSS animation */}
                    <div
                        className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-12 animate-fade-in-up"
                    >
                        <div className="w-2 h-2 bg-champagne rounded-full animate-pulse" />
                        <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                            A Mayalok Ventures Strategic Foresight Entity
                        </span>
                    </div>

                    {/* Premium Headline - CSS animation with delay */}
                    <h1
                        className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1] animate-fade-in-up animation-delay-100"
                    >
                        <span className="block text-white font-display">We Predict The Crisis</span>
                        <span className="block text-champagne mt-3 font-display">You Don&apos;t See Coming.</span>
                    </h1>

                    {/* Strategic Sub-headline - CSS animation */}
                    <p
                        className="text-lg md:text-xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up animation-delay-200"
                    >
                        Strategic Risk Intelligence for assets worth ₹100Cr+. 
                        Moving beyond compliance into the realm of absolute foresight.
                    </p>

                    {/* Premium CTA - CSS animation */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-fade-in-up animation-delay-300"
                    >
                        <Link
                            href="/secure-intake"
                            className="group px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light"
                        >
                            <span className="flex items-center justify-center space-x-4">
                                <Eye className="h-4 w-4" />
                                <span>Request a Discrete Consultation</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <Link
                            href="/mandate"
                            className="px-10 py-5 border border-gray-800 text-gray-300 font-medium tracking-widest uppercase text-sm hover:border-champagne hover:text-champagne transition-all"
                        >
                            The 1% Mandate
                        </Link>
                    </div>

                    {/* Ultra-Premium Indicators - CSS animation */}
                    <div
                        className="flex flex-wrap items-center justify-center gap-12 md:gap-16 pt-10 border-t border-gray-800/50 animate-fade-in animation-delay-400"
                    >
                        {[
                            { label: '₹100Cr+', sublabel: 'Minimum Asset Threshold' },
                            { label: '1%', sublabel: 'Of Protected Value' },
                            { label: 'Forensic', sublabel: 'Predictive Intelligence' },
                            { label: 'Discrete', sublabel: 'Absolute Confidentiality' },
                        ].map((item) => (
                            <div key={item.label} className="text-center">
                                <p className="text-2xl font-light text-champagne">{item.label}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">{item.sublabel}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Minimal scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-px h-16 bg-gradient-to-b from-champagne/30 to-transparent" />
            </div>
        </section>
    )
}
