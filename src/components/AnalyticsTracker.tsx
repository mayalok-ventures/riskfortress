'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView, trackScrollDepth, trackEngagementTime, trackPageExit, sendHeartbeat } from '@/lib/analytics'

interface AnalyticsTrackerProps {
    contentType?: string
}

export default function AnalyticsTracker({ contentType = 'page' }: AnalyticsTrackerProps) {
    const pathname = usePathname()
    const prevPathRef = useRef<string>('')
    
    useEffect(() => {
        // Skip if same path (prevents double tracking)
        if (prevPathRef.current === pathname) return
        
        // Track exit from previous page
        if (prevPathRef.current) {
            trackPageExit(prevPathRef.current, contentType)
        }
        
        prevPathRef.current = pathname
        
        // Track page view
        const title = document.title || pathname
        trackPageView(pathname, title, contentType)
        
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
