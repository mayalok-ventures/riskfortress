// Client-side analytics tracking for RiskFortress
// Tracks page views, scroll depth, engagement time, and traffic sources

const ANALYTICS_API = '/api/analytics'
const VISITOR_ID_KEY = 'rf-visitor-id'
const SESSION_ID_KEY = 'rf-session-id'
const FIRST_VISIT_KEY = 'rf-first-visit'

// Generate unique ID
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get or create visitor ID (persists across sessions)
function getVisitorId(): string {
    if (typeof window === 'undefined') return ''
    let id = localStorage.getItem(VISITOR_ID_KEY)
    if (!id) {
        id = generateId()
        localStorage.setItem(VISITOR_ID_KEY, id)
    }
    return id
}

// Get or create session ID (new for each visit)
function getSessionId(): string {
    if (typeof window === 'undefined') return ''
    let id = sessionStorage.getItem(SESSION_ID_KEY)
    if (!id) {
        id = generateId()
        sessionStorage.setItem(SESSION_ID_KEY, id)
    }
    return id
}

// Check if new visitor
function isNewVisitor(): boolean {
    if (typeof window === 'undefined') return true
    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY)
    if (!firstVisit) {
        localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString())
        return true
    }
    return false
}

// Get traffic source from referrer
function getTrafficSource(): string {
    if (typeof window === 'undefined') return 'Direct'
    
    const referrer = document.referrer
    if (!referrer) return 'Direct'
    
    try {
        const url = new URL(referrer)
        const host = url.hostname.toLowerCase()
        
        // Search engines
        if (host.includes('google') || host.includes('bing') || host.includes('yahoo') || host.includes('duckduckgo')) {
            return 'Organic Search'
        }
        
        // Social media
        if (host.includes('linkedin')) return 'LinkedIn'
        if (host.includes('twitter') || host.includes('x.com')) return 'Twitter/X'
        if (host.includes('facebook')) return 'Facebook'
        if (host.includes('instagram')) return 'Instagram'
        
        // Self-referral
        if (host.includes('riskfortress')) return 'Internal'
        
        return 'Referral'
    } catch {
        return 'Direct'
    }
}

// Track page view
export async function trackPageView(path: string, title: string, contentType?: string): Promise<void> {
    try {
        const data = {
            type: 'pageview',
            visitorId: getVisitorId(),
            sessionId: getSessionId(),
            isNewVisitor: isNewVisitor(),
            path,
            title,
            contentType: contentType || 'page',
            source: getTrafficSource(),
            platform: getDetailedPlatform(),
            referrer: document.referrer || '',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenWidth: window.innerWidth,
        }
        
        await fetch(ANALYTICS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
    } catch (error) {
        console.error('Analytics tracking error:', error)
    }
}

// Track scroll depth
export function trackScrollDepth(path: string): () => void {
    if (typeof window === 'undefined') return () => {}
    
    let maxScroll = 0
    let reported = new Set<number>()
    
    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = scrollHeight > 0 ? Math.round((window.scrollY / scrollHeight) * 100) : 0
        maxScroll = Math.max(maxScroll, scrollPercent)
        
        // Report at 25%, 50%, 75%, 100% milestones
        const milestones = [25, 50, 75, 100]
        for (const milestone of milestones) {
            if (maxScroll >= milestone && !reported.has(milestone)) {
                reported.add(milestone)
                sendScrollEvent(path, milestone)
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
        window.removeEventListener('scroll', handleScroll)
    }
}

async function sendScrollEvent(path: string, depth: number): Promise<void> {
    try {
        await fetch(ANALYTICS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'scroll',
                visitorId: getVisitorId(),
                sessionId: getSessionId(),
                path,
                scrollDepth: depth,
                timestamp: new Date().toISOString(),
            }),
        })
    } catch (error) {
        console.error('Scroll tracking error:', error)
    }
}

// Track engagement time
export function trackEngagementTime(path: string): () => void {
    if (typeof window === 'undefined') return () => {}
    
    const startTime = Date.now()
    let isActive = true
    let activeTime = 0
    let lastActiveTime = Date.now()
    
    const handleVisibility = () => {
        if (document.hidden) {
            if (isActive) {
                activeTime += Date.now() - lastActiveTime
                isActive = false
            }
        } else {
            isActive = true
            lastActiveTime = Date.now()
        }
    }
    
    const handleBeforeUnload = () => {
        if (isActive) {
            activeTime += Date.now() - lastActiveTime
        }
        sendEngagementEvent(path, activeTime)
    }
    
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
        document.removeEventListener('visibilitychange', handleVisibility)
        window.removeEventListener('beforeunload', handleBeforeUnload)
        
        // Send final engagement time
        if (isActive) {
            activeTime += Date.now() - lastActiveTime
        }
        sendEngagementEvent(path, activeTime)
    }
}

async function sendEngagementEvent(path: string, timeMs: number): Promise<void> {
    if (timeMs < 1000) return // Ignore very short visits
    
    try {
        await fetch(ANALYTICS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'engagement',
                visitorId: getVisitorId(),
                sessionId: getSessionId(),
                path,
                engagementTimeMs: timeMs,
                timestamp: new Date().toISOString(),
            }),
        })
    } catch (error) {
        console.error('Engagement tracking error:', error)
    }
}

// Track page exit
export async function trackPageExit(path: string, contentType: string): Promise<void> {
    try {
        await fetch(ANALYTICS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'exit',
                visitorId: getVisitorId(),
                sessionId: getSessionId(),
                path,
                contentType,
                timestamp: new Date().toISOString(),
            }),
        })
    } catch (error) {
        console.error('Exit tracking error:', error)
    }
}

// Detect traffic source from referrer - enhanced with more platforms
function getDetailedPlatform(): string {
    if (typeof window === 'undefined') return 'Direct'
    
    const referrer = document.referrer
    const urlParams = new URLSearchParams(window.location.search)
    
    // Check UTM source first
    const utmSource = urlParams.get('utm_source')
    if (utmSource) {
        const s = utmSource.toLowerCase()
        if (s.includes('linkedin')) return 'LinkedIn'
        if (s.includes('twitter') || s.includes('x.com')) return 'Twitter/X'
        if (s.includes('facebook') || s.includes('fb')) return 'Facebook'
        if (s.includes('instagram')) return 'Instagram'
        if (s.includes('whatsapp')) return 'WhatsApp'
        if (s.includes('telegram')) return 'Telegram'
        if (s.includes('youtube')) return 'YouTube'
        if (s.includes('reddit')) return 'Reddit'
        if (s.includes('email') || s.includes('newsletter')) return 'Email'
        return utmSource
    }
    
    if (!referrer) return 'Direct'
    
    try {
        const url = new URL(referrer)
        const host = url.hostname.toLowerCase()
        
        if (host.includes('google')) return 'Google'
        if (host.includes('bing')) return 'Bing'
        if (host.includes('yahoo')) return 'Yahoo'
        if (host.includes('duckduckgo')) return 'DuckDuckGo'
        if (host.includes('linkedin')) return 'LinkedIn'
        if (host.includes('twitter') || host.includes('x.com') || host.includes('t.co')) return 'Twitter/X'
        if (host.includes('facebook') || host.includes('fb.com') || host.includes('fbcdn')) return 'Facebook'
        if (host.includes('instagram')) return 'Instagram'
        if (host.includes('whatsapp') || host.includes('wa.me')) return 'WhatsApp'
        if (host.includes('telegram') || host.includes('t.me')) return 'Telegram'
        if (host.includes('youtube')) return 'YouTube'
        if (host.includes('reddit')) return 'Reddit'
        if (host.includes('riskfortress')) return 'Internal'
        
        return host // Return the actual domain for unknown referrers
    } catch {
        return 'Direct'
    }
}

// Track share events
export async function trackShare(path: string, title: string, platform: string, contentType?: string, contentId?: string): Promise<void> {
    try {
        await fetch(ANALYTICS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'share',
                visitorId: getVisitorId(),
                sessionId: getSessionId(),
                path,
                title,
                platform,
                contentType: contentType || 'page',
                contentId: contentId || '',
                timestamp: new Date().toISOString(),
            }),
        })
    } catch (error) {
        console.error('Share tracking error:', error)
    }
}

// Heartbeat for active users tracking (call every 30 seconds)
export async function sendHeartbeat(): Promise<void> {
    try {
        await fetch(ANALYTICS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'heartbeat',
                visitorId: getVisitorId(),
                sessionId: getSessionId(),
                path: window.location.pathname,
                timestamp: new Date().toISOString(),
            }),
        })
    } catch (error) {
        // Silently fail heartbeats
    }
}
