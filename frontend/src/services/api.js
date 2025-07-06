const API_BASE_URL = '/api'

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Business API
export const businessApi = {
  // Generate business data
  generateBusinessData: async (businessInfo) => {
    return apiCall('/business/data', {
      method: 'POST',
      body: JSON.stringify({
        ...businessInfo,
        mainType: businessInfo.mainType || '',
        subType: businessInfo.subType || '',
        description: businessInfo.description || ''
      }),
    })
  },

  // Generate SEO headlines
  generateHeadlines: async (businessData) => {
    return apiCall('/business/headline', {
      method: 'POST',
      body: JSON.stringify({ businessData }),
    })
  },

  // Get business categories
  getCategories: async () => {
    const response = await apiCall('/business/categories')
    return response.categories || []
  },

  // Get location suggestions
  getLocationSuggestions: async (query) => {
    return apiCall(`/business/location-suggestions?query=${encodeURIComponent(query)}`)
  },
}

// Health check
export const healthApi = {
  check: async () => {
    return apiCall('/health')
  },
}

// Export all APIs
export default {
  business: businessApi,
  health: healthApi,
} 