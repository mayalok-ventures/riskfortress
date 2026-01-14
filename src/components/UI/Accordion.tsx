'use client'

import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/formatters'

interface AccordionItem {
    id: string
    title: string
    content: ReactNode
    icon?: ReactNode
}

interface AccordionProps {
    items: AccordionItem[]
    multiple?: boolean
    defaultOpen?: string[]
}

export default function Accordion({
    items,
    multiple = false,
    defaultOpen = [],
}: AccordionProps) {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

    const toggleItem = (id: string) => {
        if (openItems.includes(id)) {
            setOpenItems(openItems.filter(itemId => itemId !== id))
        } else {
            if (multiple) {
                setOpenItems([...openItems, id])
            } else {
                setOpenItems([id])
            }
        }
    }

    return (
        <div className="space-y-4">
            {items.map((item) => {
                const isOpen = openItems.includes(item.id)

                return (
                    <div
                        key={item.id}
                        className={cn(
                            'rounded-xl border transition-all',
                            isOpen
                                ? 'border-intelligence/30 bg-intelligence/5'
                                : 'border-gray-800 bg-gray-900/50 hover:bg-gray-900'
                        )}
                    >
                        <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full p-6 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center space-x-3">
                                {item.icon && (
                                    <div className={cn(
                                        'p-2 rounded-lg',
                                        isOpen ? 'bg-intelligence/20' : 'bg-gray-800'
                                    )}>
                                        {item.icon}
                                    </div>
                                )}
                                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                            </div>
                            <ChevronDown className={cn(
                                'h-5 w-5 text-gray-400 transition-transform',
                                isOpen && 'rotate-180'
                            )} />
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 pt-2 border-t border-gray-800">
                                        <div className="text-gray-300">{item.content}</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}
        </div>
    )
}