import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin | RiskFortress',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-950">
            {children}
        </div>
    )
}
