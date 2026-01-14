'use client'

import { Mail, AlertCircle, Check, Building, Globe, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

import { validateCorporateEmail, suggestCorporateEmail } from '@/lib/validation/email'

interface EmailValidatorProps {
    value: string
    onChange: (email: string, isValid: boolean) => void
    required?: boolean
    disabled?: boolean
}

export default function EmailValidator({
    value,
    onChange,
    required = true,
    disabled = false,
}: EmailValidatorProps) {
    const [isValid, setIsValid] = useState<boolean | null>(null)
    const [isTouched, setIsTouched] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [emailType, setEmailType] = useState<'corporate' | 'personal' | 'unknown'>('unknown')

    useEffect(() => {
        if (!value) {
            setIsValid(null)
            setSuggestions([])
            setEmailType('unknown')
            onChange(value, false)
            return
        }

        const valid = validateCorporateEmail(value)
        setIsValid(valid)

        if (!valid && value.includes('@')) {
            const suggested = suggestCorporateEmail(value)
            setSuggestions(suggested.slice(0, 2))
        } else {
            setSuggestions([])
        }

        // Determine email type for UI
        if (valid) {
            setEmailType('corporate')
        } else if (value.includes('@')) {
            setEmailType('personal')
        } else {
            setEmailType('unknown')
        }

        onChange(value, valid)
    }, [value, onChange])

    const handleBlur = () => {
        setIsTouched(true)
    }

    const getEmailTypeIcon = () => {
        switch (emailType) {
            case 'corporate':
                return <Building className="h-4 w-4 text-green-400" />
      case 'personal':
                return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
                return <Mail className="h-4 w-4 text-gray-400" />
    }
    }

    const getEmailTypeText = () => {
        switch (emailType) {
            case 'corporate':
                return 'Corporate Email'
            case 'personal':
                return 'Personal Email'
            default:
                return 'Enter Email'
        }
    }

    const getStatusColor = () => {
        if (!value) return 'border-gray-700'
        if (isValid === true) return 'border-green-500'
        if (isValid === false) return 'border-red-500'
        return 'border-gray-700'
    }

    return (
        <div className= "space-y-3" >
        <div className="relative" >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2" >
                { getEmailTypeIcon() }
                </div>

                < input
    type = "email"
    value = { value }
    onChange = {(e) => onChange(e.target.value, false)
}
onBlur = { handleBlur }
disabled = { disabled }
placeholder = "john@yourcompany.com"
className = {`
            w-full pl-12 pr-12 py-3 rounded-lg bg-gray-900 border-2
            ${getStatusColor()}
            text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-intelligence/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          `}
required = { required }
    />

    <div className="absolute right-4 top-1/2 transform -translate-y-1/2" >
        { isValid === true && <Check className="h-5 w-5 text-green-400" />}
{ isValid === false && <AlertCircle className="h-5 w-5 text-red-400" />}
</div>

    < div className = "absolute -top-2 left-3 px-2 bg-gray-900 text-xs text-gray-400" >
        { getEmailTypeText() }
        </div>
        </div>

{/* Validation Messages */ }
{
    isTouched && value && (
        <div className="space-y-2" >
            {/* Valid Email */ }
    {
        isValid === true && (
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20" >
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <div>
                    <p className="text-sm font-medium text-green-300" > Valid corporate email </p>
                        < p className = "text-xs text-green-400" > This email meets our security requirements.</p>
                            </div>
                            </div>
          )
    }

    {/* Invalid Email */ }
    {
        isValid === false && (
            <div className="space-y-3" >
                <div className="flex items-start space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20" >
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1" >
                            <p className="text-sm font-medium text-red-300" > Corporate email required </p>
                                < p className = "text-xs text-red-400 mt-1" >
                                    We only accept corporate email addresses(@company.com, @org.in, etc.)
                                        </p>
                                        < div className = "mt-2 grid grid-cols-2 gap-2" >
                                            <div className="text-xs" >
                                                <p className="font-medium text-red-300 mb-1" > Accepted: </p>
                                                    < ul className = "text-red-400 space-y-0.5" >
                                                        <li>@company.com </li>
                                                        < li > @organization.co.in </li>
                                                        < li > @enterprise.in </li>
                                                        </ul>
                                                        </div>
                                                        < div className = "text-xs" >
                                                            <p className="font-medium text-red-300 mb-1" > Rejected: </p>
                                                                < ul className = "text-red-400 space-y-0.5" >
                                                                    <li>@gmail.com </li>
                                                                    < li > @yahoo.com </li>
                                                                    < li > @outlook.com </li>
                                                                    </ul>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    </div>

        {/* Suggestions */ }
        {
            suggestions.length > 0 && (
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700" >
                    <p className="text-sm font-medium text-gray-300 mb-2" > Suggestions: </p>
                        < div className = "space-y-2" >
                        {
                            suggestions.map((suggestion, index) => (
                                <div
                        key= { index }
                        className = "flex items-center justify-between p-2 rounded bg-gray-900/50"
                                >
                                <span className="text-sm text-gray-400 font-mono" > { suggestion } </span>
                            < button
                          type = "button"
                          onClick = {() => onChange(suggestion, false)}
            className = "text-xs text-intelligence hover:text-intelligence/80"
                >
                Use
                </button>
                </div>
                    ))
        }
        </div>
            </div>
              )
    }
    </div>
          )
}
</div>
      )}

{/* Help Text */ }
<div className="flex items-start space-x-2 text-xs text-gray-500" >
    <Shield className="h-3 w-3 text-intelligence mt-0.5 flex-shrink-0" />
        <p>
        Corporate email verification is required for security and compliance.
          We do not accept personal email addresses.
        </p>
    </div>
    </div>
  )
}