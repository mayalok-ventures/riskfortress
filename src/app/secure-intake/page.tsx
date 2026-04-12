// Metadata has been moved to layout.tsx

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function SecureIntakePage() {
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const { register, handleSubmit } = useForm()

    const onSubmit = async (data: Record<string, string>) => {
        setIsSubmitting(true)
        setErrorMsg('')
        try {
            const res = await fetch('https://formspree.io/f/mlggebdr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error('Submission failed')
            setIsSuccess(true)
        } catch (err: unknown) {
            setErrorMsg('Secure transmission failed. Please contact contact@riskfortress.in directly.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen py-32 relative overflow-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08]"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80)', backgroundAttachment: 'fixed' }}
                />
            </div>

            <div className="container relative mx-auto px-4">
                {isSuccess ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center border border-white/10 p-12 bg-black/50">
                        <h2 className="text-3xl font-light mb-6">Request Received.</h2>
                        <p className="text-gray-400 font-light leading-relaxed">
                            You will hear from us within 48 hours at the email you provided.
                            No acknowledgement email will be sent — discretion is absolute.
                        </p>
                    </motion.div>
                ) : (
                    <div className="max-w-xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-light mb-6">Request a Discrete Consultation</h1>
                            <p className="text-gray-400 font-light leading-relaxed">
                                All submissions are reviewed within 48 hours. We engage only where asset exposure exceeds ₹1 Crore. No information is stored beyond what is operationally necessary.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-black/40 border border-white/10 p-8 rounded-sm">
                            <div>
                                <label htmlFor="fullName" className="block text-sm text-gray-400 mb-2">Full Name <span className="text-champagne">*</span></label>
                                <input
                                    id="fullName"
                                    {...register('fullName', { required: true })}
                                    className="w-full bg-gray-900 border border-gray-800 p-3 text-white focus:border-champagne focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="organisation" className="block text-sm text-gray-400 mb-2">Organisation / Family Office <span className="text-champagne">*</span></label>
                                <input
                                    id="organisation"
                                    {...register('organisation', { required: true })}
                                    className="w-full bg-gray-900 border border-gray-800 p-3 text-white focus:border-champagne focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm text-gray-400 mb-2">Email Address <span className="text-champagne">*</span></label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                                    className="w-full bg-gray-900 border border-gray-800 p-3 text-white focus:border-champagne focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm text-gray-400 mb-2">Phone / WhatsApp</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    {...register('phone')}
                                    className="w-full bg-gray-900 border border-gray-800 p-3 text-white focus:border-champagne focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="riskCategory" className="block text-sm text-gray-400 mb-2">Nature of Risk <span className="text-champagne">*</span></label>
                                <select
                                    id="riskCategory"
                                    {...register('riskCategory', { required: true })}
                                    className="w-full bg-gray-900 border border-gray-800 p-3 text-white focus:border-champagne focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="" disabled selected>Select risk category...</option>
                                    <option value="financial">Financial / Investment Risk</option>
                                    <option value="statutory">Statutory / Regulatory Risk</option>
                                    <option value="geo">Geo-Environmental Risk</option>
                                    <option value="reputational">Reputational / Governance Risk</option>
                                    <option value="multi">Multi-domain Assessment</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="assetValue" className="block text-sm text-gray-400 mb-2">Approximate Asset Value at Risk <span className="text-champagne">*</span></label>
                                <select
                                    id="assetValue"
                                    {...register('assetValue', { required: true })}
                                    className="w-full bg-gray-900 border border-gray-800 p-3 text-white focus:border-champagne focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="" disabled selected>Select approximate range...</option>
                                    <option value="1-10">₹1Cr – ₹10Cr</option>
                                    <option value="10-50">₹10Cr – ₹50Cr</option>
                                    <option value="50-100">₹50Cr – ₹100Cr</option>
                                    <option value="100+">₹100Cr and above</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="briefContext" className="block text-sm text-gray-400 mb-2">Brief Context</label>
                                <textarea
                                    id="briefContext"
                                    {...register('briefContext', { maxLength: 500 })}
                                    className="w-full bg-gray-900 border border-gray-800 p-3 text-white focus:border-champagne focus:outline-none transition-colors h-24 resize-none"
                                    placeholder="2–3 sentences about the risk scenario. No sensitive or confidential details needed at this stage."
                                />
                            </div>

                            <div>
                                <label htmlFor="referralSource" className="block text-sm text-gray-400 mb-2">How did you find us?</label>
                                <input
                                    id="referralSource"
                                    {...register('referralSource')}
                                    className="w-full bg-gray-900 border border-gray-800 p-3 text-white focus:border-champagne focus:outline-none transition-colors"
                                />
                            </div>

                            {errorMsg && <p className="text-red-400 text-sm mt-2">{errorMsg}</p>}

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.025, y: -1 }}
                                whileTap={{ scale: 0.975 }}
                                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                                className="w-full bg-champagne text-black py-4 uppercase tracking-widest text-sm font-medium mt-6 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Securing Transmission...' : 'Submit Consultation Request'}
                            </motion.button>

                            <div className="pt-6 mt-6 border-t border-white/5 space-y-3">
                                <div className="flex items-center text-xs text-gray-500">
                                    <span className="mr-3">🔒</span> All information treated with absolute confidentiality
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <span className="mr-3">✉</span> We respond only within 48 business hours
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <span className="mr-3">⚠</span> Minimum engagement threshold: ₹1 Crore asset exposure
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
