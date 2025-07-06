const express = require('express');
const { body, validationResult } = require('express-validator');
const businessService = require('../services/businessAnalyzer');
const headlineGenerator = require('../services/headlineGenerator');
const chatgptService = require('../services/chatgptService');
const fetch = require('node-fetch');
const crypto = require('crypto');

const router = express.Router();

// Validation middleware
const validateBusinessData = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Location must be between 2 and 200 characters'),
  body('category')
    .optional()
    .isIn(['restaurant', 'salon', 'retail', 'fitness', 'healthcare', 'other'])
    .withMessage('Invalid business category'),
];

// In-memory cache for headlines
const headlineCache = {};

// Helper to create a unique key for each business input
function getBusinessKey({ name, mainType, subType, location, description }) {
  return crypto.createHash('sha256').update(
    [name, mainType, subType, location, description].join('|')
  ).digest('hex');
}

// Helper to call local Mistral API
async function generateHeadlinesWithMistral({ name, mainType, subType, location, description }, count = 5) {
  const prompt = `Generate 5 unique, catchy SEO headlines for a business. Focus strictly on the following details:\nBusiness Name: ${name}\nMain Type: ${mainType}\nSubtype: ${subType}\nLocation: ${location}\nDescription: ${description || ''}\nReturn ONLY a JSON array of 5 headlines, no explanation.`;
  let allHeadlines = [];
  // Only one API call for 5 headlines
  console.log('🔗 Calling Mistral local API for headlines...');
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral',
      prompt,
      stream: false
    })
  });
  const data = await res.json();
  console.log('🟢 Raw Mistral response:', data.response);
  // Try to parse JSON array from response
  let headlines = [];
  try {
    // If the response is an array of objects, map to just the headline strings
    const parsed = JSON.parse(data.response.match(/\[.*\]/s)[0]);
    if (Array.isArray(parsed) && typeof parsed[0] === 'object' && parsed[0].headline) {
      headlines = parsed.map(h => h.headline);
    } else {
      headlines = parsed;
    }
  } catch (e) {
    // fallback: split by lines
    headlines = data.response.split('\n').filter(Boolean);
  }
  allHeadlines.push(...headlines);
  // Deduplicate and trim to count
  return Array.from(new Set(allHeadlines)).slice(0, count);
}

// POST /api/business/data - Generate business data
router.post('/data', validateBusinessData, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, location, category, mainType, subType, description } = req.body;
    
    // Generate comprehensive business data
    const businessData = await businessService.generateBusinessData({
      name,
      location,
      category: category || businessService.detectBusinessType(name),
      mainType,
      subType,
      description
    });

    // Generate SEO headline
    const headline = await headlineGenerator.generateSmartHeadline(businessData);

    res.json({
      success: true,
      data: {
        ...businessData,
        mainType,
        subType,
        description,
        headline,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Business data generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate business data',
      message: error.message 
    });
  }
});

// POST /api/business/regenerate-headline - Regenerate SEO headline
router.post('/regenerate-headline', async (req, res) => {
  try {
    const { businessData } = req.body;
    
    if (!businessData) {
      return res.status(400).json({ error: 'Business data is required' });
    }

    const newHeadline = await headlineGenerator.generateSmartHeadline(businessData);
    
    res.json({
      success: true,
      headline: newHeadline,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Headline regeneration error:', error);
    res.status(500).json({ 
      error: 'Failed to regenerate headline',
      message: error.message 
    });
  }
});

// GET /api/business/categories - Get available business categories
router.get('/categories', (req, res) => {
  const categories = [
    { id: 'service', name: 'Service Businesses' },
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'salon', name: 'Salon' },
    { id: 'cafe', name: 'Cafe' },
    { id: 'gym', name: 'Gym' },
    { id: 'hotel', name: 'Hotel' },
    { id: 'clinic', name: 'Clinic' },
    { id: 'lawfirm', name: 'Law Firm' },
    { id: 'consulting', name: 'Consulting' },
    { id: 'autoservice', name: 'Auto Service' },
    { id: 'retail', name: 'Retail & Commerce' },
    { id: 'retailstore', name: 'Retail Store' },
    { id: 'grocerystore', name: 'Grocery Store' },
    { id: 'pharmacy', name: 'Pharmacy' },
    { id: 'electronics', name: 'Electronics Store' },
    { id: 'professional', name: 'Professional Services' },
    { id: 'accounting', name: 'Accounting Firm' },
    { id: 'insurance', name: 'Insurance Agency' },
    { id: 'marketing', name: 'Marketing Agency' },
    { id: 'itservices', name: 'IT Services' },
    { id: 'realestate', name: 'Real Estate & Property' },
    { id: 'realestateonly', name: 'Real Estate' },
    { id: 'propertymgmt', name: 'Property Management' },
    { id: 'construction', name: 'Construction' },
    { id: 'healthwellness', name: 'Health & Wellness' },
    { id: 'dental', name: 'Dental Office' },
    { id: 'veterinary', name: 'Veterinary Clinic' },
    { id: 'physicaltherapy', name: 'Physical Therapy' },
    { id: 'personal', name: 'Personal Services' },
    { id: 'spa', name: 'Spa' },
    { id: 'drycleaning', name: 'Dry Cleaning' },
    { id: 'photography', name: 'Photography' },
    { id: 'foodbeverage', name: 'Food & Beverage' },
    { id: 'bakery', name: 'Bakery' },
    { id: 'bar', name: 'Bar/Pub' },
    { id: 'catering', name: 'Catering' },
    { id: 'other', name: 'Other' },
    { id: 'childcare', name: 'Childcare' },
    { id: 'tutoring', name: 'Tutoring' },
    { id: 'eventplanning', name: 'Event Planning' },
    { id: 'cleaning', name: 'Cleaning Service' },
  ];
  res.json({ categories });
});

// GET /api/business/location-suggestions - Get location suggestions
router.get('/location-suggestions', (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 2) {
    return res.json({ suggestions: [] });
  }

  // Mock location suggestions (in real app, this would call a geocoding API)
  const suggestions = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA'
  ].filter(location => 
    location.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  res.json({ suggestions });
});

// Remove or disable the /headline endpoint
router.post('/headline', (req, res) => {
  res.status(501).json({ error: 'Headline generation via OpenAI has been removed.' });
});

// Add custom ChatGPT prompt
router.post('/add-prompt', async (req, res) => {
  try {
    const { key, prompt } = req.body
    
    if (!key || !prompt) {
      return res.status(400).json({ 
        error: 'Missing required fields: key, prompt' 
      })
    }

    chatgptService.addCustomPrompt(key, prompt)

    res.json({ 
      success: true, 
      message: `Custom prompt '${key}' added successfully`,
      availablePrompts: chatgptService.getAvailablePrompts()
    })
  } catch (error) {
    console.error('Error adding custom prompt:', error)
    res.status(500).json({ 
      error: 'Failed to add custom prompt',
      details: error.message 
    })
  }
})

// Get available prompt types
router.get('/prompts', (req, res) => {
  try {
    const availablePrompts = chatgptService.getAvailablePrompts()
    res.json({ 
      success: true, 
      prompts: availablePrompts
    })
  } catch (error) {
    console.error('Error getting prompts:', error)
    res.status(500).json({ 
      error: 'Failed to get available prompts',
      details: error.message 
    })
  }
})

// POST /api/business/local-headlines
router.post('/local-headlines', async (req, res) => {
  try {
    const { name, mainType, subType, location, description, index = 0 } = req.body;
    if (!name || !mainType || !subType || !location) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const key = getBusinessKey({ name, mainType, subType, location, description });
    if (!headlineCache[key]) {
      // Generate and cache headlines (now only 5)
      const headlines = await generateHeadlinesWithMistral({ name, mainType, subType, location, description }, 5);
      headlineCache[key] = headlines;
    }
    const headlines = headlineCache[key];
    const safeIndex = Math.max(0, Math.min(index, headlines.length - 1));
    res.json({
      headline: headlines[safeIndex],
      index: safeIndex,
      total: headlines.length,
      // allHeadlines: headlines // Uncomment to return all
    });
  } catch (error) {
    console.error('Local Mistral headline error:', error);
    res.status(500).json({ error: 'Failed to generate headlines', details: error.message });
  }
});

module.exports = router; 