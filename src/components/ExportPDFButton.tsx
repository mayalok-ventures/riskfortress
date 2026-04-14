'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface ExportPDFButtonProps {
    contentId: string
    title: string
}

async function loadLogoBase64(): Promise<string | null> {
    try {
        const res = await fetch('/logos/logo.png')
        if (!res.ok) return null
        const blob = await res.blob()
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = () => resolve(null)
            reader.readAsDataURL(blob)
        })
    } catch {
        return null
    }
}

export default function ExportPDFButton({ contentId, title }: ExportPDFButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleExport = async () => {
        setLoading(true)
        try {
            const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                import('jspdf'),
                import('html2canvas'),
            ])

            const element = document.getElementById(contentId)
            if (!element) return

            const logoBase64 = await loadLogoBase64()

            // Temporarily override styles for PDF capture (dark text on white bg)
            const originalColor = element.style.color
            const originalBg = element.style.backgroundColor
            element.style.color = '#1a1a1a'
            element.style.backgroundColor = '#ffffff'

            const children = element.querySelectorAll('*')
            const originalStyles: { el: HTMLElement; color: string; bg: string }[] = []
            children.forEach((child) => {
                const el = child as HTMLElement
                const computed = window.getComputedStyle(el)
                const color = computed.color
                const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
                if (match) {
                    const r = parseInt(match[1])
                    const g = parseInt(match[2])
                    const b = parseInt(match[3])
                    if (r + g + b > 400) {
                        originalStyles.push({ el, color: el.style.color, bg: el.style.backgroundColor })
                        el.style.color = '#1a1a1a'
                    }
                }
            })

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: 800,
            })

            // Restore original styles
            element.style.color = originalColor
            element.style.backgroundColor = originalBg
            originalStyles.forEach(({ el, color, bg }) => {
                el.style.color = color
                el.style.backgroundColor = bg
            })

            const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
            const pageW = pdf.internal.pageSize.getWidth() // 210
            const pageH = pdf.internal.pageSize.getHeight() // 297

            // Margins
            const marginL = 15
            const marginR = 15
            const marginTop = 22
            const marginBot = 18
            const contentW = pageW - marginL - marginR // 180mm
            const contentH = pageH - marginTop - marginBot // ~257mm

            const imgWidth = contentW
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pdfAny = pdf as any

            const addHeader = (pageNum: number, totalPages: number) => {
                pdf.setFontSize(7)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(130, 130, 130)
                pdf.text('RISKFORTRESS — CONFIDENTIAL INTELLIGENCE BRIEF', marginL, 12)
                pdf.text(`Page ${pageNum} of ${totalPages}`, pageW - marginR, 12, { align: 'right' })
                pdf.setDrawColor(200, 200, 200)
                pdf.setLineWidth(0.2)
                pdf.line(marginL, 14, pageW - marginR, 14)
            }

            const addFooter = () => {
                const footerY = pageH - 8
                pdf.setFontSize(6.5)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(140, 140, 140)
                pdf.setDrawColor(200, 200, 200)
                pdf.setLineWidth(0.2)
                pdf.line(marginL, footerY - 4, pageW - marginR, footerY - 4)
                pdf.text('© RiskFortress India  ·  A Mayalok Ventures Entity  ·  riskfortress.in', pageW / 2, footerY, { align: 'center' })
                pdf.text('CONFIDENTIAL', pageW - marginR, footerY, { align: 'right' })
            }

            const addLogoWatermark = () => {
                if (!logoBase64) return
                try {
                    pdfAny.saveGraphicsState()
                    pdfAny.setGState(new pdfAny.GState({ opacity: 0.04 }))
                    const wSize = 70
                    pdf.addImage(logoBase64, 'PNG', (pageW - wSize) / 2, (pageH - wSize) / 2, wSize, wSize)
                    pdfAny.restoreGraphicsState()
                } catch { /* ignore watermark errors */ }
            }

            // === COVER PAGE ===
            pdf.setFillColor(10, 10, 10)
            pdf.rect(0, 0, pageW, pageH, 'F')

            // Logo on cover
            if (logoBase64) {
                try {
                    pdf.addImage(logoBase64, 'PNG', (pageW - 36) / 2, 40, 36, 36)
                } catch { /* ignore */ }
            }

            // Title block
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(26)
            pdf.setTextColor(212, 175, 55) // champagne gold
            pdf.text('RISKFORTRESS', pageW / 2, 95, { align: 'center' })

            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(10)
            pdf.setTextColor(160, 160, 160)
            pdf.text('Intelligence Dossier', pageW / 2, 105, { align: 'center' })

            // Gold divider
            pdf.setDrawColor(212, 175, 55)
            pdf.setLineWidth(0.4)
            pdf.line(50, 115, pageW - 50, 115)

            // Document title
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(16)
            pdf.setTextColor(240, 240, 240)
            const splitTitle = pdf.splitTextToSize(title, 130)
            pdf.text(splitTitle, pageW / 2, 135, { align: 'center' })

            // Classification + date
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(9)
            pdf.setTextColor(120, 120, 120)
            pdf.text('CONFIDENTIAL CASE INTELLIGENCE', pageW / 2, 165, { align: 'center' })
            pdf.text(
                `Prepared: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
                pageW / 2, 175, { align: 'center' }
            )

            // Cover footer
            pdf.setFontSize(7)
            pdf.setTextColor(80, 80, 80)
            pdf.text('This document is confidential. Distributing or reproducing is strictly prohibited.', pageW / 2, pageH - 25, { align: 'center' })
            pdf.text('riskfortress.in', pageW / 2, pageH - 18, { align: 'center' })

            // === CONTENT PAGES ===
            const totalContentPages = Math.ceil(imgHeight / contentH)

            for (let i = 0; i < totalContentPages; i++) {
                pdf.addPage()

                addLogoWatermark()
                addHeader(i + 1, totalContentPages)
                addFooter()

                // Clip the content image for this page slice
                const sourceY = (i * contentH / imgHeight) * canvas.height
                const sliceH = Math.min((contentH / imgHeight) * canvas.height, canvas.height - sourceY)

                const sliceCanvas = document.createElement('canvas')
                sliceCanvas.width = canvas.width
                sliceCanvas.height = sliceH
                const ctx = sliceCanvas.getContext('2d')
                if (ctx) {
                    ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceH, 0, 0, canvas.width, sliceH)
                }

                const sliceImgHeight = (sliceH * imgWidth) / canvas.width
                pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', marginL, marginTop, imgWidth, sliceImgHeight)
            }

            const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)
            pdf.save(`RiskFortress_${filename}.pdf`)
        } catch (err) {
            console.error('PDF export failed:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm disabled:opacity-50"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            <span>{loading ? 'Generating PDF...' : 'Export PDF'}</span>
        </button>
    )
}
