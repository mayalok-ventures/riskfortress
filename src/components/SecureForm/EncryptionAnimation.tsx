
import { motion } from 'framer-motion'
import { Lock, Shield, Key } from 'lucide-react'

export default function EncryptionAnimation() {
  return (
    <div className="fixed inset-0 bg-gray-950/95 backdrop-blur-lg z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Icons */}
        <div className="relative mb-8">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            className="mx-auto mb-6"
          >
            <Lock className="h-20 w-20 text-intelligence" />
          </motion.div>

          {/* Orbiting Keys */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{ width: '200px', height: '200px' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <Key className="h-6 w-6 text-green-400" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Encryption Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Securing Transmission
          </h3>
          <p className="text-gray-400 mb-6 max-w-md">
            Your information is being encrypted with AES-256-GCM military-grade encryption.
            This process ensures complete data confidentiality.
          </p>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-intelligence rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Encryption Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 rounded-lg bg-intelligence/10 border border-intelligence/20 inline-block"
        >
          <div className="text-sm text-intelligence">
            <div className="font-mono">AES-256-GCM • 256-bit Key • Zero-Knowledge</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}