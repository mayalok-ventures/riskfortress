'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { trackPageView, trackScrollDepth, trackEngagementTime, sendHeartbeat } from '@/lib/analytics'

interface AnalyticsTrackerProps {
    contentType?: string
}

export default function AnalyticsTracker({ contentType = 'page' }: AnalyticsTrackerProps) {
    const pathname = usePathname()
    const prevPathRef = useRef<string>('')
    
    useEffect(() => {
        // NOTE: Telemetry runs unconditionally regardless of the cookie-consent
        // banner selection. The banner controls UX disclosure only; first-party
        // operational analytics (page views, scroll depth, engagement, heartbeat)
        // are required for the admin Analytics dashboard and operate under the
        // legitimate-interest basis documented in /privacy. Do NOT gate this
        // tracker on `hasAnalyticsConsent()` — that function is exported only
        // for third-party / advertising integrations that this codebase does
        // not currently use.

        // Skip if same path (prevents double tracking)
        if (prevPathRef.current === pathname) return
        
        // Skip tracking for admin and placeholder routes
        if (pathname.startsWith('/rf-admin') || pathname.includes('_placeholder')) {
            return
        }

        prevPathRef.current = pathname
        
        // Track page view (delayed slightly to allow document.title to update)
        setTimeout(() => {
            let title = document.title || pathname
            // Clean up old default titles if any
            title = title.replace(' | A Mayalok Division', '')
            
            // If it is a generic title for a dossier, try to find an h1 on the page (more accurate than generic metadata before hydration)
            if (pathname.includes('/dossiers/') && title === 'Intelligence Dossier') {
               const h1 = document.querySelector('h1')
               if (h1 && h1.textContent) title = h1.textContent
            }
            
            trackPageView(pathname, title, contentType)
        }, 800)
        
        // Start scroll depth tracking
        const cleanupScroll = trackScrollDepth(pathname)
        
        // Start engagement time tracking
        const cleanupEngagement = trackEngagementTime(pathname)
        
        // Start heartbeat for active users
        const heartbeatInterval = setInterval(() => {
            sendHeartbeat()
        }, 30000) // Every 30 seconds
        
        // Send initial heartbeat
        sendHeartbeat()
        
        return () => {
            cleanupScroll()
            cleanupEngagement()
            clearInterval(heartbeatInterval)
        }
    }, [pathname, contentType])
    
    return null
}
