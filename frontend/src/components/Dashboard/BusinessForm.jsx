import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  MapPin, 
  Search, 
  Sparkles, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useBusiness } from '../../context/BusinessContext'

const BusinessForm = () => {
  const { 
    generateBusinessData, 
    isGenerating, 
    categories, 
    categoriesLoading,
    categoriesError,
    getLocationSuggestions 
  } = useBusiness()
  
  // Define main types and subtypes mapping
  const MAIN_TYPES = [
    { id: 'service', name: 'Service Businesses' },
    { id: 'retail', name: 'Retail & Commerce' },
    { id: 'professional', name: 'Professional Services' },
    { id: 'healthwellness', name: 'Health & Wellness' },
    { id: 'foodbeverage', name: 'Food & Beverage' },
    { id: 'personal', name: 'Personal Services' },
    { id: 'other', name: 'Other' },
  ]
  const SUBTYPES = {
    service: [
      { id: 'restaurant', name: 'Restaurant' },
      { id: 'salon', name: 'Salon' },
      { id: 'cafe', name: 'Cafe' },
      { id: 'gym', name: 'Gym' },
      { id: 'hotel', name: 'Hotel' },
      { id: 'clinic', name: 'Clinic' },
      { id: 'lawfirm', name: 'Law Firm' },
      { id: 'consulting', name: 'Consulting' },
      { id: 'autoservice', name: 'Auto Service' },
      { id: 'childcare', name: 'Childcare' },
      { id: 'tutoring', name: 'Tutoring' },
      { id: 'eventplanning', name: 'Event Planning' },
      { id: 'cleaning', name: 'Cleaning Service' },
    ],
    retail: [
      { id: 'retailstore', name: 'Retail Store' },
      { id: 'grocerystore', name: 'Grocery Store' },
      { id: 'pharmacy', name: 'Pharmacy' },
      { id: 'electronics', name: 'Electronics Store' },
    ],
    professional: [
      { id: 'accounting', name: 'Accounting Firm' },
      { id: 'insurance', name: 'Insurance Agency' },
      { id: 'marketing', name: 'Marketing Agency' },
      { id: 'itservices', name: 'IT Services' },
      { id: 'realestate', name: 'Real Estate' },
      { id: 'propertymgmt', name: 'Property Management' },
      { id: 'construction', name: 'Construction' },
    ],
    healthwellness: [
      { id: 'dental', name: 'Dental Office' },
      { id: 'veterinary', name: 'Veterinary Clinic' },
      { id: 'physicaltherapy', name: 'Physical Therapy' },
      { id: 'clinic', name: 'Clinic' },
      { id: 'spa', name: 'Spa' },
    ],
    foodbeverage: [
      { id: 'bakery', name: 'Bakery' },
      { id: 'bar', name: 'Bar/Pub' },
      { id: 'catering', name: 'Catering' },
      { id: 'restaurant', name: 'Restaurant' },
      { id: 'cafe', name: 'Cafe' },
    ],
    personal: [
      { id: 'drycleaning', name: 'Dry Cleaning' },
      { id: 'photography', name: 'Photography' },
      { id: 'salon', name: 'Salon' },
      { id: 'spa', name: 'Spa' },
    ],
    other: [
      { id: 'other', name: 'Other' },
    ],
  }

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    mainType: '',
    subType: '',
    description: ''
  })
  
  const [errors, setErrors] = useState({})
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const locationRef = useRef(null)

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // If mainType changes, reset subType
    if (field === 'mainType') {
      setFormData(prev => ({ ...prev, subType: '' }))
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Business name must be at least 2 characters'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters'
    }
    
    if (!formData.mainType) {
      newErrors.mainType = 'Please select a business type'
    }
    
    if (!formData.subType) {
      newErrors.subType = 'Please select a business subtype'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsValidating(true)
    
    try {
      await generateBusinessData(formData)
      // Form will be reset by the context after successful generation
    } catch (error) {
      console.error('Error generating business data:', error)
    } finally {
      setIsValidating(false)
    }
  }

  // Handle location input with debounced suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.location.length >= 2) {
        const suggestions = await getLocationSuggestions(formData.location)
        setLocationSuggestions(suggestions)
        setShowSuggestions(true)
      } else {
        setLocationSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [formData.location, getLocationSuggestions])

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({ ...prev, location: suggestion }))
    setShowSuggestions(false)
    setErrors(prev => ({ ...prev, location: '' }))
  }

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card dark:glass-card-dark p-6 rounded-xl"
    >
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Business Information
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name 
                  ? 'border-error-500 bg-error-50 dark:bg-error-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900'
              }`}
              placeholder="Enter your business name"
              disabled={isGenerating}
            />
            {errors.name && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-1 mt-1 text-error-600 dark:text-error-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location *
          </label>
          <div className="relative" ref={locationRef}>
            <div className="relative">
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.location 
                    ? 'border-error-500 bg-error-50 dark:bg-error-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900'
                }`}
                placeholder="Enter city, state"
                disabled={isGenerating}
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            {/* Location Suggestions */}
            {showSuggestions && locationSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
              >
                {locationSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                  </button>
                ))}
              </motion.div>
            )}
            
            {errors.location && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-1 mt-1 text-error-600 dark:text-error-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.location}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Business Type (Main) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MAIN_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleInputChange('mainType', type.id)}
                className={`flex items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium
                  ${formData.mainType === type.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500 shadow-lg'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}
                `}
                aria-pressed={formData.mainType === type.id}
              >
                {type.name}
              </button>
            ))}
          </div>
          {errors.mainType && (
            <p className="text-xs text-error-600 dark:text-error-400 mt-1">
              {errors.mainType}
            </p>
          )}
        </div>

        {/* Business Subtype (only show if mainType is selected) */}
        {formData.mainType && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Subtype
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SUBTYPES[formData.mainType].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleInputChange('subType', sub.id)}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium
                    ${formData.subType === sub.id
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500 shadow-lg'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}
                  `}
                  aria-pressed={formData.subType === sub.id}
                >
                  {sub.name}
                </button>
              ))}
            </div>
            {errors.subType && (
              <p className="text-xs text-error-600 dark:text-error-400 mt-1">
                {errors.subType}
              </p>
            )}
          </div>
        )}

        {/* Business Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Description (Optional)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 resize-none"
            placeholder="Describe your business, services, or special offers..."
            disabled={isGenerating}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This helps generate more personalized SEO headlines
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isGenerating || isValidating}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            isGenerating || isValidating
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg hover:shadow-xl'
          }`}
          whileHover={!isGenerating && !isValidating ? { scale: 1.02 } : {}}
          whileTap={!isGenerating && !isValidating ? { scale: 0.98 } : {}}
        >
          {isGenerating || isValidating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate SEO Headline</span>
            </>
          )}
        </motion.button>

        {/* Success Message */}
        {!isGenerating && !isValidating && Object.keys(errors).length === 0 && formData.name && formData.location && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 text-success-600 dark:text-success-400 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Ready to generate insights!</span>
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}

export default BusinessForm 