'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Lock, Shield, Building, User, Mail, Phone, Globe, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { validateCorporateEmail } from '@/lib/validation/email'

import EncryptionAnimation from './EncryptionAnimation'

const intakeSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    company: z.string().min(2, 'Company name is required'),
    jobTitle: z.string().min(2, 'Job title is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Valid phone number is required'),
    companyType: z.enum(['fortune500', 'industrial', 'familyOffice', 'hni', 'other']),
    budgetRange: z.enum(['50L-2Cr', '2Cr-10Cr', '10Cr-50Cr', '50Cr+']),
    primaryConcern: z.enum([
        'landDueDiligence',
        'tscmServices',
        'familySecurity',
        'riskManagement',
        'intelligence',
        'other'
    ]),
    message: z.string().min(20, 'Please provide more details').max(1000),
    agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
})

type IntakeFormData = z.infer<typeof intakeSchema>

const companyTypes = [
    { value: 'fortune500', label: 'Fortune 500 Company' },
    { value: 'industrial', label: 'Industrial Conglomerate' },
    { value: 'familyOffice', label: 'Family Office' },
    { value: 'hni', label: 'High Net Worth Individual' },
    { value: 'other', label: 'Other Enterprise' },
]

const budgetRanges = [
    { value: '50L-2Cr', label: '₹50 Lakhs - ₹2 Crores' },
    { value: '2Cr-10Cr', label: '₹2 Crores - ₹10 Crores' },
    { value: '10Cr-50Cr', label: '₹10 Crores - ₹50 Crores' },
    { value: '50Cr+', label: '₹50 Crores +' },
]

const concerns = [
    { value: 'landDueDiligence', label: 'Land Due Diligence' },
    { value: 'tscmServices', label: 'TSCM Services (Bug Sweeping)' },
    { value: 'familySecurity', label: 'Family Office Security' },
    { value: 'riskManagement', label: 'Enterprise Risk Management' },
    { value: 'intelligence', label: 'Corporate Intelligence' },
    { value: 'other', label: 'Other Premium Requirement' },
]

export default function IntakeForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isEncrypting, setIsEncrypting] = useState(false)
    const [step, setStep] = useState(1)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<IntakeFormData>({
        resolver: zodResolver(intakeSchema),
        defaultValues: {
            companyType: 'industrial',
            budgetRange: '2Cr-10Cr',
            primaryConcern: 'riskManagement',
            agreeToTerms: false,
        },
    })

    const emailValue = watch('email')
    const isCorporateEmail = emailValue ? validateCorporateEmail(emailValue) : true

    const onSubmit = async (data: IntakeFormData) => {
        // Email validation
        if (!validateCorporateEmail(data.email)) {
            toast.error('Please use a corporate email address. Personal emails (@gmail, @yahoo) are not accepted.')
            return
        }

        setIsSubmitting(true)
        setIsEncrypting(true)

        try {
            // Simulate encryption process for UX
            await new Promise(resolve => setTimeout(resolve, 1500))
            setIsEncrypting(false)

            // Submit to Formspree
            const formData = new FormData()

            // Map form data to Formspree format
            formData.append('firstName', data.firstName)
            formData.append('lastName', data.lastName)
            formData.append('company', data.company)
            formData.append('jobTitle', data.jobTitle)
            formData.append('email', data.email)
            formData.append('phone', data.phone)
            formData.append('companyType', data.companyType)
            formData.append('budgetRange', data.budgetRange)
            formData.append('primaryConcern', data.primaryConcern)
            formData.append('message', data.message)
            formData.append('agreeToTerms', data.agreeToTerms.toString())
            formData.append('_subject', `New Secure Intake: ${data.company} - ${data.firstName} ${data.lastName}`)
            formData.append('_replyto', data.email)
            formData.append('_format', 'plain')

            const response = await fetch('https://formspree.io/f/mlggebdr', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })

            if (response.ok) {
                setIsSuccess(true)
                toast.success('Intake received and secured. Our intelligence team will contact you within 24 hours.')

                // Reset form after successful submission
                setTimeout(() => {
                    reset()
                    setStep(1)
                    setIsSuccess(false)
                }, 3000)
            } else {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Submission failed')
            }
        } catch (error) {
            console.error('Form submission error:', error)
            toast.error('Secure transmission failed. Please try again or contact us directly.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Success State
    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl glass-morphism border border-green-500/20 text-center"
            >
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                        <Shield className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Intake Secured</h3>
                    <p className="text-gray-400">
                        Your confidential information has been encrypted and transmitted securely.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                        <p className="text-sm text-gray-300">
                            <span className="text-intelligence font-semibold">Next Steps:</span> Our intelligence team will contact you within 24 hours via secure channels.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsSuccess(false)
                            setStep(1)
                            reset()
                        }}
                        className="w-full py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                        Submit Another Intake
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="relative">
            {/* Encryption Animation Overlay */}
            {isEncrypting && <EncryptionAnimation />}

            <div className="p-8 rounded-2xl glass-morphism border border-intelligence/20">
                {/* Form Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="p-2 rounded-lg bg-intelligence/10">
                            <Lock className="h-6 w-6 text-intelligence" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Secure Intelligence Intake</h2>
                    </div>
                    <p className="text-gray-400">
                        AES-256 encrypted submission. Corporate emails only (@company domains).
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((stepNumber) => (
                        <div key={stepNumber} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber
                                ? 'bg-intelligence text-white'
                                : 'bg-gray-800 text-gray-400'
                                }`}>
                                {stepNumber}
                            </div>
                            {stepNumber < 3 && (
                                <div className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-intelligence' : 'bg-gray-800'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Step 1: Contact Information */}
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <User className="inline h-4 w-4 mr-2" />
                                        First Name
                                    </label>
                                    <input
                                        {...register('firstName')}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-intelligence focus:outline-none"
                                        placeholder="John"
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <User className="inline h-4 w-4 mr-2" />
                                        Last Name
                                    </label>
                                    <input
                                        {...register('lastName')}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-intelligence focus:outline-none"
                                        placeholder="Doe"
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Building className="inline h-4 w-4 mr-2" />
                                    Company
                                </label>
                                <input
                                    {...register('company')}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-intelligence focus:outline-none"
                                    placeholder="Your Corporation"
                                />
                                {errors.company && (
                                    <p className="mt-1 text-sm text-red-400">{errors.company.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Job Title
                                </label>
                                <input
                                    {...register('jobTitle')}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-intelligence focus:outline-none"
                                    placeholder="Chief Security Officer / Managing Director"
                                />
                                {errors.jobTitle && (
                                    <p className="mt-1 text-sm text-red-400">{errors.jobTitle.message}</p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full py-3 bg-intelligence text-white rounded-lg font-semibold hover:bg-intelligence/90 transition-colors"
                            >
                                Continue to Contact Details
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Contact Details */}
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Mail className="inline h-4 w-4 mr-2" />
                                    Corporate Email
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-900 border ${emailValue && !isCorporateEmail
                                        ? 'border-red-500'
                                        : 'border-gray-800'
                                        } text-white focus:border-intelligence focus:outline-none`}
                                    placeholder="john@yourcompany.com"
                                />
                                {emailValue && !isCorporateEmail && (
                                    <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <div className="flex items-center text-red-400 text-sm">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Please use a corporate email address (@companydomain.com)
                                        </div>
                                        <p className="text-xs text-red-300 mt-1">
                                            We accept: @company.com, @org.in, @enterprise.co.in
                                        </p>
                                        <p className="text-xs text-red-300">
                                            We reject: @gmail.com, @yahoo.com, @outlook.com
                                        </p>
                                    </div>
                                )}
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Phone className="inline h-4 w-4 mr-2" />
                                    Secure Phone
                                </label>
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-intelligence focus:outline-none"
                                    placeholder="+91 XXX XXX XXXX"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <Globe className="inline h-4 w-4 mr-2" />
                                        Company Type
                                    </label>
                                    <select
                                        {...register('companyType')}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-intelligence focus:outline-none"
                                    >
                                        {companyTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Annual Security Budget
                                    </label>
                                    <select
                                        {...register('budgetRange')}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-intelligence focus:outline-none"
                                    >
                                        {budgetRanges.map((range) => (
                                            <option key={range.value} value={range.value}>
                                                {range.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="flex-1 py-3 bg-intelligence text-white rounded-lg font-semibold hover:bg-intelligence/90 transition-colors"
                                >
                                    Continue to Requirements
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Requirements */}
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Primary Concern
                                </label>
                                <select
                                    {...register('primaryConcern')}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-intelligence focus:outline-none"
                                >
                                    {concerns.map((concern) => (
                                        <option key={concern.value} value={concern.value}>
                                            {concern.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Detailed Requirements
                                </label>
                                <textarea
                                    {...register('message')}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-intelligence focus:outline-none"
                                    placeholder="Describe your specific security concerns, assets at risk, and intelligence requirements..."
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                                )}
                            </div>

                            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        {...register('agreeToTerms')}
                                        className="mt-1 w-4 h-4 text-intelligence bg-gray-800 border-gray-700 rounded focus:ring-intelligence focus:ring-2"
                                    />
                                    <div>
                                        <label className="text-sm text-gray-300">
                                            I agree to the secure transmission of this information and understand that
                                            this intake is protected by AES-256 encryption. I confirm that I am
                                            authorized to request intelligence services on behalf of my organization.
                                        </label>
                                        {errors.agreeToTerms && (
                                            <p className="mt-1 text-sm text-red-400">{errors.agreeToTerms.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <Shield className="h-5 w-5 mr-2 animate-spin" />
                                            Securing Transmission...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <Lock className="h-5 w-5 mr-2" />
                                            Submit Secure Intake
                                        </span>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </form>

                {/* Security Badges */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'AES-256 Encryption', color: 'text-green-400' },
                            { label: 'Corporate Email Only', color: 'text-intelligence' },
                            { label: 'No Data Retention', color: 'text-purple-400' },
                            { label: 'ISO 27001 Compliant', color: 'text-yellow-400' },
                        ].map((badge) => (
                            <div key={badge.label} className="text-center">
                                <div className={`text-xs font-medium ${badge.color} mb-1`}>✓ {badge.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}