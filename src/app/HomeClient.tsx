'use client'

import dynamic from 'next/dynamic'

const LoadingSkeleton = () => (
    <div className="w-full py-20 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-8 w-64 bg-gray-800 rounded" />
            <div className="h-4 w-48 bg-gray-800 rounded" />
        </div>
    </div>
)

const RadarScroll = dynamic(() => import('@/components/Radar/RadarScroll'), {
    ssr: false,
    loading: () => <LoadingSkeleton />,
})

const Testimonials = dynamic(() => import('@/components/Testimonials/Testimonials'), {
    ssr: false,
    loading: () => <LoadingSkeleton />,
})

const CTASection = dynamic(() => import('@/components/CTA/CTASection'), {
    ssr: false,
    loading: () => <LoadingSkeleton />,
})

const RiskFortressEdge = dynamic(() => import('@/components/Edge/RiskFortressEdge'), {
    ssr: false,
    loading: () => <LoadingSkeleton />,
})

export default function HomeClient() {
    return (
        <>
            <RadarScroll />
            <RiskFortressEdge />
            <Testimonials />
            <CTASection />
        </>
    )
}
