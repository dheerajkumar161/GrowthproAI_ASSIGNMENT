import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, Check, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

const SEOHeadlineGenerator = ({ business }) => {
  const [headline, setHeadline] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [total, setTotal] = useState(30)

  // Fetch headline when business info or index changes
  useEffect(() => {
    if (!business) return;
    // Check for required fields
    const requiredFields = [business.name, business.mainType, business.subType, business.location];
    if (requiredFields.some(f => !f || f.trim() === '')) {
      setHeadline('Please fill in all required business details to generate a headline.');
      setIsGenerating(false);
      return;
    }
    setIsGenerating(true);
    fetch('/api/business/local-headlines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: business.name,
        mainType: business.mainType,
        subType: business.subType,
        location: business.location,
        description: business.description,
        index: headlineIndex
      })
    })
      .then(async res => {
        if (res.status === 400) {
          const data = await res.json();
          setHeadline(data.error || 'Missing required business details.');
          toast.error(data.error || 'Missing required business details.');
          return;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setHeadline(data.headline || '');
        setTotal(data.total || 30);
      })
      .catch(err => {
        setHeadline('Failed to generate headline.');
        toast.error('Failed to generate headline');
      })
      .finally(() => setIsGenerating(false));
  }, [business, headlineIndex]);

  // Reset index when business info changes
  useEffect(() => {
    setHeadlineIndex(0)
  }, [business])

  const handleRegenerate = () => {
    setHeadlineIndex((prev) => (prev + 1) % total)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  return (
    <>
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-primary-500 animate-spin mb-4" />
            <span className="text-lg text-white font-semibold animate-pulse">Generating SEO Headline...</span>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-dark-500 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            SEO Headline Generator
          </h3>
          <button
            onClick={handleRegenerate}
            disabled={isGenerating || !business}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Regenerate Headline'}</span>
          </button>
        </div>

        {!business && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Enter business information above to generate SEO headlines
            </p>
          </div>
        )}

        {business && headline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-400 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <p className="text-gray-800 dark:text-gray-200 flex-1 mr-4">
              {headline}
            </p>
            <button
              onClick={() => copyToClipboard(headline)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-white dark:bg-dark-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-gray-600 dark:text-gray-400">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </motion.div>
        )}

        {business && !headline && !isGenerating && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Click "Regenerate Headline" to create SEO-optimized headlines for {business.name}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default SEOHeadlineGenerator 