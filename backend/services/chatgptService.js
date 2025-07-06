const OpenAI = require('openai');

class ChatGPTService {
  constructor() {
    // Debug: Print API key status
    console.log('🔍 Checking OpenAI API key...');
    console.log('🔍 API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('🔍 API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
    
    // Only initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('✅ OpenAI initialized successfully');
    } else {
      this.openai = null;
      console.log('⚠️  OpenAI API key not found. ChatGPT features will use fallback mode.');
    }
    
    // Custom ChatGPT prompts from specific conversations
    this.customPrompts = {
      // Content Engineering Specialist prompt from https://chatgpt.com/g/g-SA2LB9tLz-my-content-engineering-specialist
      default: `I want you to act as a professional SEO copywriter. Based on the following details, generate a list of 5 creative, catchy, and impactful SEO headlines. These headlines should appeal to both customers and search engines. Make them concise, benefit-driven, and relevant to the business type and location.

Business Name: {name}
Type of Business: {type}
Location: {location}
Optional Description: {description}

Your goal is to make a great first impression, improve click-through rates, and highlight what makes this business special. Avoid generic phrases and make each headline sound unique and compelling.

Format your response as a JSON array with exactly 5 headlines:
["headline1", "headline2", "headline3", "headline4", "headline5"]`,

      // Content Engineering Specialist prompt (alternative version)
      content_engineering: `I want you to act as a professional SEO copywriter. Based on the following details, generate a list of 5 creative, catchy, and impactful SEO headlines. These headlines should appeal to both customers and search engines. Make them concise, benefit-driven, and relevant to the business type and location.

Business Name: {name}
Type of Business: {type}
Location: {location}
Optional Description: {description}

Your goal is to make a great first impression, improve click-through rates, and highlight what makes this business special. Avoid generic phrases and make each headline sound unique and compelling.

Format your response as a JSON array with exactly 5 headlines:
["headline1", "headline2", "headline3", "headline4", "headline5"]`
    };
  }

  async generateHeadlines(businessData, promptType = 'default') {
    try {
      const { name, type, location, description, rating = 4.5 } = businessData;
      
      // Check if OpenAI is available
      if (!this.openai) {
        console.log('🔄 Using fallback mode - OpenAI not configured');
        return this.generateFallbackHeadlines(businessData);
      }
      
      // Get the custom prompt or use default
      let promptTemplate = this.customPrompts[promptType] || this.customPrompts.default;
      
      // Replace placeholders with actual data
      const prompt = promptTemplate
        .replace(/{name}/g, name)
        .replace(/{type}/g, type)
        .replace(/{location}/g, location)
        .replace(/{description}/g, description || `${name} is a ${type} business in ${location}.`);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a Content Engineering Specialist from https://chatgpt.com/g/g-SA2LB9tLz-my-content-engineering-specialist. You specialize in creating compelling SEO headlines that make great first impressions and improve click-through rates. Always respond with valid JSON arrays containing exactly 5 headlines."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const response = completion.choices[0].message.content;
      
      // Parse the JSON response
      let headlines;
      try {
        headlines = JSON.parse(response);
      } catch (parseError) {
        // If JSON parsing fails, try to extract headlines from the response
        headlines = this.extractHeadlinesFromText(response);
      }

      // Ensure we have exactly 5 headlines
      if (!Array.isArray(headlines) || headlines.length !== 5) {
        throw new Error('Invalid response format from ChatGPT');
      }

      return headlines;

    } catch (error) {
      console.error('ChatGPT API error:', error);
      
      // Fallback to template-based headlines
      return this.generateFallbackHeadlines(businessData);
    }
  }

  // Method to add your specific ChatGPT prompt
  addCustomPrompt(key, prompt) {
    this.customPrompts[key] = prompt;
    console.log(`Added custom prompt: ${key}`);
  }

  // Method to get available prompt types
  getAvailablePrompts() {
    return Object.keys(this.customPrompts);
  }

  extractHeadlinesFromText(text) {
    // Extract headlines from text if JSON parsing fails
    const lines = text.split('\n').filter(line => line.trim());
    const headlines = [];
    
    for (const line of lines) {
      const cleanLine = line.replace(/^[0-9\-\.\s]*/, '').trim();
      if (cleanLine && cleanLine.length > 10 && cleanLine.length < 100) {
        headlines.push(cleanLine);
        if (headlines.length >= 5) break;
      }
    }
    
    return headlines.slice(0, 5);
  }

  generateFallbackHeadlines(businessData) {
    const { name, type, location, rating = 4.5 } = businessData;
    const emotionalTriggers = ['Best', 'Top-Rated', 'Premier', 'Award-Winning', 'Excellence'];
    const businessKeywords = this.getBusinessKeywords(type);
    return [
      `${name} - ${emotionalTriggers[0]} ${businessKeywords[0]} in ${location} | ${rating}★`,
      `${name} - ${emotionalTriggers[1]} ${businessKeywords[0]} in ${location}`,
      `${name} - ${location}'s Premier ${businessKeywords[0]}`,
      `${name} - ${emotionalTriggers[3]} ${businessKeywords[0]} in ${location}`,
      `${name} - ${rating}★ ${businessKeywords[0]} Excellence in ${location}`
    ];
  }

  getBusinessKeywords(businessType) {
    const keywordMap = {
      restaurant: ['Restaurant', 'Dining', 'Food', 'Cuisine'],
      salon: ['Salon', 'Beauty', 'Styling', 'Hair'],
      fitness: ['Fitness', 'Gym', 'Workout', 'Training'],
      healthcare: ['Healthcare', 'Medical', 'Clinic', 'Wellness'],
      retail: ['Store', 'Retail', 'Shopping', 'Products']
    };
    
    return keywordMap[businessType.toLowerCase()] || ['Business', 'Service', 'Professional'];
  }
}

module.exports = new ChatGPTService(); 