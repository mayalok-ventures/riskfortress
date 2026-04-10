'use client'

export default function GlobeSVG() {
    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-20">
            <div className="relative w-[500px] h-[500px] md:w-[600px] md:h-[600px]">
                {/* Subtle gradient background */}
                <div 
                    className="absolute inset-0 rounded-full" 
                    style={{ 
                        background: 'radial-gradient(circle, rgba(197,160,89,0.08) 0%, transparent 60%)' 
                    }}
                />
                
                {/* Simple elegant circle */}
                <div className="absolute inset-[20%] rounded-full border border-intelligence/20" />
                <div className="absolute inset-[30%] rounded-full border border-intelligence/10" />
                <div className="absolute inset-[40%] rounded-full border border-intelligence/5" />
            </div>
        </div>
    )
}
