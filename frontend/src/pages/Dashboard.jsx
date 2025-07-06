import { motion } from 'framer-motion'
import BusinessForm from '../components/Dashboard/BusinessForm'
import BusinessCard from '../components/Dashboard/BusinessCard'
import SEOHeadlineGenerator from '../components/Dashboard/SEOHeadlineGenerator'
import { useBusiness } from '../context/BusinessContext'
import { Loader2 } from 'lucide-react'

const Dashboard = () => {
  const { currentBusiness, isLoading } = useBusiness()

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            Business SEO Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate SEO headlines and get business suggestions to improve your online presence.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BusinessForm />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary-500 animate-spin" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Generating Insights...
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Analyzing your business and creating SEO headlines
                  </p>
                </div>
              </div>
            ) : currentBusiness ? (
              <BusinessCard business={currentBusiness} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ready to Get Started?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Enter your business information above to generate SEO headlines.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Dashboard 