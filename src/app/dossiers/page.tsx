import { Metadata } from 'next'

import DossiersClient from './DossiersClient'

export const metadata: Metadata = {
    title: 'Risk Intelligence Dossiers | Case Scenarios & Articles | RiskFortress India',
    description:
        'Confidential risk intelligence briefs, case scenarios, forensic analyses, and investigative articles published by RiskFortress India.',
    alternates: { canonical: 'https://riskfortress.in/dossiers/' },
    openGraph: {
        title: 'Risk Intelligence Dossiers | RiskFortress India',
        description: 'Forensic case scenarios, intelligence articles, and expert analysis on India\'s highest-stakes risk domains.',
        url: 'https://riskfortress.in/dossiers/',
        type: 'website',
    },
}



export default function DossiersPage() {
    return (
        <>
            <DossiersClient />

            {/* SEO: noscript fallback so crawlers see content even without JS */}
            <noscript>
                <div className="min-h-screen py-32">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                                Risk Intelligence Dossiers
                            </h1>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                Confidential risk intelligence briefs, case scenarios, forensic analyses, and investigative articles published by RiskFortress India.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-12">
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6">Case Scenarios</h2>
                                <p className="text-gray-400 mb-4">
                                    Confidential threat analysis and case studies. All information is sanitized and encrypted to protect client identities and operational security.
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Case dossiers require professional email verification for access. Enable JavaScript to browse and access case scenarios.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6">Intelligence Articles</h2>
                                <p className="text-gray-400 mb-4">
                                    Free, in-depth articles on risk management, cybersecurity, and strategic intelligence for professionals.
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Enable JavaScript to browse published articles.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6">Expert Insights &amp; Blogs</h2>
                                <p className="text-gray-400 mb-4">
                                    Expert insights, analysis, and thought leadership on emerging risks and security trends.
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Enable JavaScript to browse published blogs and expert insights.
                                </p>
                            </section>

                            <section className="p-8 rounded-2xl border border-gray-800">
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    Request Full Dossier Access
                                </h2>
                                <p className="text-gray-400 mb-4">
                                    Complete, unsanitized dossiers are available to verified enterprise clients with appropriate security clearance.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-xl border border-gray-800">
                                        <h3 className="font-semibold text-white mb-2">Enterprise Clients</h3>
                                        <p className="text-sm text-gray-400">Fortune 500 &amp; Major Corporates</p>
                                    </div>
                                    <div className="p-6 rounded-xl border border-gray-800">
                                        <h3 className="font-semibold text-white mb-2">Family Offices</h3>
                                        <p className="text-sm text-gray-400">HNWI with ₹500Cr+ assets</p>
                                    </div>
                                    <div className="p-6 rounded-xl border border-gray-800">
                                        <h3 className="font-semibold text-white mb-2">Government Entities</h3>
                                        <p className="text-sm text-gray-400">Authorized agencies only</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </noscript>
        </>
    )
}
