import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const title = searchParams.get('title') || 'RiskFortress Intelligence'
        const description = searchParams.get('description') || 'Enterprise Risk Management & Corporate Intelligence'

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0f172a',
                        backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
                        padding: '60px 80px',
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '40px',
                        }}
                    >
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '20px',
                                fontSize: '40px',
                                color: 'white',
                            }}
                        >
                            🔒
                        </div>
                        <div
                            style={{
                                fontSize: '48px',
                                fontWeight: 'bold',
                                background: 'linear-gradient(to right, #0ea5e9, #10b981)',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            RiskFortress
                        </div>
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: '30px',
                            maxWidth: '1000px',
                            lineHeight: '1.2',
                        }}
                    >
                        {title}
                    </div>

                    {/* Description */}
                    <div
                        style={{
                            fontSize: '32px',
                            color: '#94a3b8',
                            textAlign: 'center',
                            maxWidth: '900px',
                            marginBottom: '60px',
                            lineHeight: '1.4',
                        }}
                    >
                        {description}
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '60px',
                            left: '80px',
                            right: '80px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#64748b',
                            fontSize: '24px',
                        }}
                    >
                        <div>riskfortress.com</div>
                        <div>Enterprise Intelligence Platform</div>
                    </div>

                    {/* Grid Pattern */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                            opacity: 0.1,
                        }}
                    />
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (e: any) {
        console.log(`${e.message}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}