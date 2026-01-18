const sharp = require('sharp');
const path = require('path');

async function generateOgImage() {
    const width = 1200;
    const height = 630;

    // Create SVG with the OG image design
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0c0a09"/>
                <stop offset="100%" style="stop-color:#1c1917"/>
            </linearGradient>
            <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#c5a059"/>
                <stop offset="100%" style="stop-color:#d4b76a"/>
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" stroke-width="0.5"/>
            </pattern>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>
        
        <!-- Gold accent glow -->
        <ellipse cx="600" cy="200" rx="400" ry="200" fill="#c5a059" opacity="0.05"/>
        
        <!-- Shield Icon -->
        <g transform="translate(520, 120)">
            <path d="M80 0L160 40V100C160 140 128 170 80 180C32 170 0 140 0 100V40L80 0Z" 
                  stroke="#c5a059" stroke-width="3" fill="none"/>
            <path d="M80 20L140 50V100C140 130 115 155 80 165C45 155 20 130 20 100V50L80 20Z" 
                  fill="#c5a059" fill-opacity="0.1"/>
            <circle cx="80" cy="90" r="25" stroke="#c5a059" stroke-width="2" fill="none"/>
            <circle cx="80" cy="90" r="8" fill="#c5a059"/>
        </g>
        
        <!-- Title -->
        <text x="600" y="360" text-anchor="middle" 
              font-family="system-ui, -apple-system, sans-serif" 
              font-size="72" font-weight="600" fill="white">
            RiskFortress
        </text>
        
        <!-- Tagline -->
        <text x="600" y="420" text-anchor="middle" 
              font-family="system-ui, -apple-system, sans-serif" 
              font-size="32" fill="#c5a059">
            Intelligence &amp; Risk Advisory
        </text>
        
        <!-- Description -->
        <text x="600" y="480" text-anchor="middle" 
              font-family="system-ui, -apple-system, sans-serif" 
              font-size="24" fill="#a1a1aa">
            Enterprise Risk Management for Fortune 500 &amp; Family Offices
        </text>
        
        <!-- Footer line -->
        <line x1="100" y1="550" x2="1100" y2="550" stroke="#27272a" stroke-width="1"/>
        
        <!-- Footer text -->
        <text x="100" y="590" 
              font-family="system-ui, -apple-system, sans-serif" 
              font-size="20" fill="#71717a">
            riskfortress.com
        </text>
        <text x="1100" y="590" text-anchor="end"
              font-family="system-ui, -apple-system, sans-serif" 
              font-size="20" fill="#71717a">
            Predictive Intelligence Platform
        </text>
    </svg>`;

    await sharp(Buffer.from(svg))
        .png()
        .toFile(path.join(__dirname, '../public/og-image.png'));

    console.log('OG image generated successfully!');
}

generateOgImage().catch(console.error);
