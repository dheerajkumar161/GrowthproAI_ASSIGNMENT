import { createContext, useContext, useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { businessApi } from '../services/api'

const BusinessContext = createContext()

export const useBusiness = () => {
  const context = useContext(BusinessContext)
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider')
  }
  return context
}

export const BusinessProvider = ({ children }) => {
  const [currentBusiness, setCurrentBusiness] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const queryClient = useQueryClient()

  // Query for business categories
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery(
    'categories',
    businessApi.getCategories,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
        console.log('✅ Categories loaded successfully:', data)
      },
      onError: (error) => {
        console.error('❌ Error loading categories:', error)
      }
    }
  )

  // Mutation for generating business data
  const generateBusinessMutation = useMutation(
    businessApi.generateBusinessData,
    {
      onSuccess: (data) => {
        setCurrentBusiness(data.data)
        toast.success('Business data generated successfully!')
    
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to generate business data')
      },
      onSettled: () => {
        setIsGenerating(false)
      },
    }
  )

  // Mutation for regenerating headline
  const regenerateHeadlineMutation = useMutation(
    businessApi.regenerateHeadline,
    {
      onSuccess: (data) => {
        if (currentBusiness) {
          setCurrentBusiness({
            ...currentBusiness,
            headline: data.headline
          })
        }
        toast.success('Headline regenerated successfully!')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to regenerate headline')
      },
    }
  )

  // Generate business data
  const generateBusinessData = useCallback(async (businessInfo) => {
    setIsGenerating(true)
    try {
      await generateBusinessMutation.mutateAsync(businessInfo)
    } catch (error) {
      console.error('Error generating business data:', error)
    }
  }, [generateBusinessMutation])

  // Regenerate headline
  const regenerateHeadline = useCallback(async () => {
    if (!currentBusiness) {
      toast.error('No business data available')
      return
    }

    try {
      await regenerateHeadlineMutation.mutateAsync({ businessData: currentBusiness })
    } catch (error) {
      console.error('Error regenerating headline:', error)
    }
  }, [currentBusiness, regenerateHeadlineMutation])

  // Clear current business
  const clearBusiness = useCallback(() => {
    setCurrentBusiness(null)

  }, [queryClient])

  // Get location suggestions
  const getLocationSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) return []
    
    try {
      const response = await businessApi.getLocationSuggestions(query)
      return response.suggestions || []
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
      return []
    }
  }, [])

  const value = {
    // State
    currentBusiness,
    isGenerating,
    isLoading: isGenerating,
    categories,
    categoriesLoading,
    categoriesError,
    
    // Actions
    generateBusinessData,
    regenerateHeadline,
    clearBusiness,
    getLocationSuggestions,
    
    // Mutations
    generateBusinessMutation,
    regenerateHeadlineMutation,
  }

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  )
} 