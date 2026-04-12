import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
    title: 'The Mayalok Ecosystem | About RiskFortress India',
    description:
        'RiskFortress is the forensic risk intelligence arm of Mayalok Ventures, Delhi NCR. Predictive forensics for Ultra-HNWIs. Learn about our methodology and confidential engagement model.',
    alternates: { canonical: 'https://riskfortress.in/council/' },
    openGraph: {
        title: 'The Mayalok Ecosystem | RiskFortress India',
        description: 'Forensic risk intelligence arm of Mayalok Ventures, Delhi NCR.',
        url: 'https://riskfortress.in/council/',
        images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200' }],
        type: 'website',
    },
}

const portfolioEntities = [
    {
        name: 'CoreSetu',
        role: 'AI-powered hiring verification and Trust Intelligence Platform',
        focus: 'Background verification, credential authenticity, institutional trust scoring for India\'s hiring ecosystem',
        badge: null,
    },
    {
        name: 'RiskFortress',
        role: 'Forensic risk intelligence for Ultra-HNWIs and enterprise asset holders',
        focus: 'Predictive forensics across financial, statutory, and geo-environmental risk domains',
        badge: 'You are here',
    },
    {
        name: 'Deeplink Creators',
        role: 'Digital marketing and technology services',
        focus: 'Brand presence, SEO, and digital performance for growth-stage businesses',
        badge: null,
    },
]

export default function CouncilPage() {
    return (
        <div className="min-h-screen">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

            {/* Hero Banner with image */}
            <section className="relative h-[360px] flex items-end overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
                    alt="Mayalok Ventures portfolio overview"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
                <div className="container relative z-10 mx-auto px-6 pb-16">
                    <div className="inline-flex items-center space-x-3 px-5 py-2.5 border border-champagne/20 mb-6">
                        <div className="w-1.5 h-1.5 bg-champagne rounded-full animate-pulse" />
                        <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                            A Mayalok Ventures Entity
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light text-white">
                        The Mayalok <span className="text-champagne">Ecosystem</span>
                    </h1>
                </div>
            </section>

            <div className="container relative z-10 mx-auto px-6 py-20">

                {/* Section 2 — Who We Are */}
                <section className="max-w-4xl mx-auto mb-20">
                    <h2 className="text-3xl font-light text-white mb-8">
                        Who <span className="text-champagne">We Are</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-5 text-gray-400 leading-relaxed">
                            <p>
                                RiskFortress is the forensic risk intelligence arm of Mayalok Ventures — a
                                multi-entity portfolio headquartered in Greater Noida, Delhi NCR, built around
                                the conviction that intelligence, not reaction, is the only moat that survives.
                            </p>
                            <p>
                                We are not consultants. We are pattern recognition specialists embedded in the
                                space between compliance and catastrophe. Our work surfaces the fractures that
                                public disclosures don&apos;t — before they widen.
                            </p>
                            <p>
                                Our research on institutional risk failure patterns has been published in{' '}
                                <strong className="text-gray-200">Cyber Defense Magazine (March 2026)</strong>{' '}
                                — one of the oldest cybersecurity publications in the United States.
                            </p>
                        </div>

                        {/* CDM Publication Callout */}
                        <div className="p-6 border border-gray-800 border-l-4 border-l-champagne/60 bg-gray-900/40">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Published Research</p>
                            <p className="text-white font-light text-base mb-1">Cyber Defense Magazine</p>
                            <p className="text-gray-400 text-sm mb-4">March 2026 Edition</p>
                            <p className="text-gray-500 text-xs mb-4">
                                Institutional risk failure patterns — one of the oldest cybersecurity publications in the United States.
                            </p>
                            <a
                                href="https://www.cyberdefensemagazine.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-champagne text-sm hover:opacity-80 transition-opacity"
                            >
                                <span>View Publication</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                </section>

                <hr className="border-white/10 max-w-4xl mx-auto mb-20" />

                {/* Section 3 — Mayalok Ventures Portfolio */}
                <section className="max-w-5xl mx-auto mb-20">
                    <h2 className="text-3xl font-light text-white mb-12 text-center">
                        The Mayalok Ventures <span className="text-champagne">Portfolio</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {portfolioEntities.map((entity) => (
                            <div
                                key={entity.name}
                                className={`p-8 border transition-all relative ${
                                    entity.badge
                                        ? 'border-champagne/30 bg-champagne/5'
                                        : 'border-gray-800 hover:border-gray-700'
                                }`}
                            >
                                {entity.badge && (
                                    <span className="absolute top-4 right-4 text-xs bg-champagne/20 text-champagne px-2 py-0.5 tracking-wider uppercase">
                                        {entity.badge}
                                    </span>
                                )}
                                <h3 className="text-xl font-light text-white mb-2">{entity.name}</h3>
                                <p className="text-champagne text-sm mb-4 font-light">{entity.role}</p>
                                <p className="text-gray-400 text-xs leading-relaxed">{entity.focus}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <hr className="border-white/10 max-w-4xl mx-auto mb-20" />

                {/* Section 4 — On Confidentiality */}
                <section className="max-w-4xl mx-auto mb-20">
                    <div className="p-12 border border-gray-800 bg-gray-900/30">
                        <h2 className="text-3xl font-light text-white mb-8">
                            On <span className="text-champagne">Confidentiality</span>
                        </h2>
                        <div className="space-y-5 text-gray-400 leading-relaxed max-w-2xl">
                            <p>
                                RiskFortress does not publish client rosters. We do not name advisors
                                publicly. We do not disclose engagement terms.
                            </p>
                            <p>
                                This is not opacity — it is the foundation of every relationship we build.
                                Our clients trust us precisely because we are structurally incapable of the
                                disclosure that would destroy that trust.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-12 border border-champagne/20">
                        <h2 className="text-3xl font-light text-white mb-6">
                            Begin a <span className="text-champagne">Confidential Engagement</span>
                        </h2>
                        <p className="text-gray-400 mb-10 font-light">
                            If your situation demands forensic intelligence and absolute confidentiality,
                            initiate a discrete consultation with our senior intelligence team.
                        </p>
                        <Link
                            href="/secure-intake"
                            className="group inline-flex items-center px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light"
                        >
                            <span>Begin a Confidential Engagement</span>
                            <ArrowRight className="h-4 w-4 ml-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
