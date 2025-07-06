import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  RefreshCw,
  Share2,
  Copy,
  Check
} from 'lucide-react'
import CountUp from 'react-countup'
import { useBusiness } from '../../context/BusinessContext'
import { toast } from 'react-hot-toast'
import SEOHeadlineGenerator from './SEOHeadlineGenerator'

const BusinessCard = ({ business }) => {
  const { regenerateHeadline } = useBusiness()
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRegenerateHeadline = async () => {
    setIsRegenerating(true)
    try {
      await regenerateHeadline()
    } catch (error) {
      console.error('Error regenerating headline:', error)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleCopyHeadline = async () => {
    try {
      await navigator.clipboard.writeText(business.headline)
      setCopied(true)
      toast.success('Headline copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy headline')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: business.headline,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      handleCopyHeadline()
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      )
    }

    return stars
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card dark:glass-card-dark p-6 rounded-xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {business.name}
          </h2>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{business.location}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200"
            title="Share"
          >
            <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* SEO Headline Generator (moved here) */}
      <div className="mb-6">
        <SEOHeadlineGenerator business={business} />
      </div>
    </motion.div>
  )
}

export default BusinessCard 