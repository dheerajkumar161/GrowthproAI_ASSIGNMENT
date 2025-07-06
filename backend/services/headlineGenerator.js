class HeadlineGenerator {
  constructor() {
    // Simplified templates based on business type
    this.templates = {
      restaurant: [
        "{name} - Best {cuisine} in {location} | {rating}★",
        "{name} - Top-Rated {cuisine} Restaurant in {location}",
        "{name} - {location}'s Premier {cuisine} Dining Experience",
        "{name} - Award-Winning {cuisine} in {location}",
        "{name} - {rating}★ {cuisine} Excellence in {location}"
      ],
      salon: [
        "{name} - Best Hair Salon in {location} | {rating}★",
        "{name} - Luxury Beauty Salon in {location}",
        "{name} - {location}'s Premier Beauty Destination",
        "{name} - {rating}★ Professional Hair & Beauty in {location}",
        "{name} - Expert Beauty Services in {location}"
      ],
      retail: [
        "{name} - Best Shopping in {location} | {rating}★",
        "{name} - Premium Retail Store in {location}",
        "{name} - {location}'s Top Shopping Destination",
        "{name} - {rating}★ Quality Products in {location}",
        "{name} - Trusted Retailer in {location}"
      ],
      fitness: [
        "{name} - Best Gym in {location} | {rating}★",
        "{name} - Premium Fitness Center in {location}",
        "{name} - {location}'s Top Fitness Destination",
        "{name} - {rating}★ Professional Training in {location}",
        "{name} - Elite Fitness in {location}"
      ],
      healthcare: [
        "{name} - Best Healthcare in {location} | {rating}★",
        "{name} - Premier Medical Care in {location}",
        "{name} - {location}'s Trusted Healthcare Provider",
        "{name} - {rating}★ Professional Medical Services in {location}",
        "{name} - Quality Healthcare in {location}"
      ],
      other: [
        "{name} - Best Business in {location} | {rating}★",
        "{name} - {location}'s Premier Service Provider",
        "{name} - {rating}★ Quality Services in {location}",
        "{name} - Professional Services in {location}",
        "{name} - Trusted Business in {location}"
      ]
    };

    this.cuisineTypes = [
      'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'American', 
      'French', 'Mediterranean', 'Greek', 'Korean', 'Vietnamese', 'Spanish', 'German'
    ];

    this.locationKeywords = {
      'new york': ['NYC', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx'],
      'los angeles': ['LA', 'Hollywood', 'Beverly Hills', 'Santa Monica'],
      'chicago': ['Windy City', 'Chi-Town', 'Loop', 'Wicker Park'],
      'houston': ['Space City', 'H-Town', 'Bayou City'],
      'phoenix': ['Valley of the Sun', 'PHX', 'Desert City'],
      'philadelphia': ['Philly', 'City of Brotherly Love', 'Phila'],
      'san antonio': ['Alamo City', 'SA', 'River City'],
      'san diego': ['America\'s Finest City', 'SD', 'Gaslamp'],
      'dallas': ['Big D', 'D-Town', 'Metroplex'],
      'san jose': ['Silicon Valley', 'SJ', 'Tech Hub']
    };
  }

  async generateSmartHeadline(businessData) {
    const { name, location, category, rating } = businessData;
    
    // Detect business type if not provided
    const businessType = category || this.detectBusinessType(name);
    
    // Get templates for business type
    const templates = this.templates[businessType] || this.templates.other;
    
    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Generate headline with context
    const headline = this.fillTemplate(template, {
      name,
      location: this.getLocationDisplay(location),
      rating: rating.toFixed(1),
      cuisine: this.detectCuisineType(name)
    });

    return headline;
  }

  detectBusinessType(businessName) {
    const name = businessName.toLowerCase();
    
    if (name.includes('restaurant') || name.includes('cafe') || name.includes('diner') || 
        name.includes('bistro') || name.includes('pizzeria') || name.includes('grill')) {
      return 'restaurant';
    } else if (name.includes('salon') || name.includes('spa') || name.includes('beauty') || 
               name.includes('hair') || name.includes('nail')) {
      return 'salon';
    } else if (name.includes('store') || name.includes('shop') || name.includes('retail') || 
               name.includes('boutique') || name.includes('market')) {
      return 'retail';
    } else if (name.includes('gym') || name.includes('fitness') || name.includes('workout') || 
               name.includes('training') || name.includes('yoga')) {
      return 'fitness';
    } else if (name.includes('clinic') || name.includes('medical') || name.includes('doctor') || 
               name.includes('dental') || name.includes('pharmacy')) {
      return 'healthcare';
    }
    
    return 'other';
  }

  detectCuisineType(businessName) {
    const name = businessName.toLowerCase();
    
    for (const cuisine of this.cuisineTypes) {
      if (name.includes(cuisine.toLowerCase())) {
        return cuisine;
      }
    }
    
    // Default cuisine types based on business name patterns
    if (name.includes('pizza') || name.includes('italian')) return 'Italian';
    if (name.includes('taco') || name.includes('mexican')) return 'Mexican';
    if (name.includes('sushi') || name.includes('japanese')) return 'Japanese';
    if (name.includes('curry') || name.includes('indian')) return 'Indian';
    if (name.includes('thai')) return 'Thai';
    if (name.includes('french') || name.includes('bistro')) return 'French';
    if (name.includes('greek')) return 'Greek';
    if (name.includes('korean')) return 'Korean';
    
    return 'Local';
  }

  getLocationDisplay(location) {
    return location;
  }

  fillTemplate(template, data) {
    let headline = template;
    
    // Replace all placeholders with actual data
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{${key}}`;
      headline = headline.replace(new RegExp(placeholder, 'g'), value);
    }
    
    // Clean up any remaining placeholders
    headline = headline.replace(/\{[^}]+\}/g, '');
    
    return headline.trim();
  }

  // Generate alternative headlines for A/B testing
  async generateAlternativeHeadlines(businessData, count = 3) {
    const headlines = [];
    
    for (let i = 0; i < count; i++) {
      const headline = await this.generateSmartHeadline(businessData);
      if (!headlines.includes(headline)) {
        headlines.push(headline);
      }
    }
    
    return headlines;
  }

  // Analyze headline SEO score
  calculateHeadlineScore(headline, businessData) {
    let score = 0;
    const { name, location, category } = businessData;
    
    // Check for business name inclusion
    if (headline.toLowerCase().includes(name.toLowerCase())) {
      score += 30;
    }
    
    // Check for location inclusion
    if (headline.toLowerCase().includes(location.toLowerCase())) {
      score += 25;
    }
    
    // Check for category keywords
    const categoryKeywords = this.getCategoryKeywords(category);
    const headlineLower = headline.toLowerCase();
    categoryKeywords.forEach(keyword => {
      if (headlineLower.includes(keyword)) {
        score += 10;
      }
    });
    
    // Check for emotional triggers
    const emotionalWords = ['best', 'top', 'premier', 'award-winning', 'excellent', 'quality'];
    emotionalWords.forEach(word => {
      if (headlineLower.includes(word)) {
        score += 5;
      }
    });
    
    // Length optimization (50-60 characters is ideal)
    const length = headline.length;
    if (length >= 45 && length <= 65) {
      score += 15;
    } else if (length >= 35 && length <= 75) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }

  getCategoryKeywords(category) {
    const keywords = {
      restaurant: ['dining', 'food', 'restaurant', 'cafe', 'cuisine', 'meal'],
      salon: ['beauty', 'salon', 'hair', 'styling', 'spa', 'wellness'],
      retail: ['shopping', 'store', 'retail', 'products', 'boutique'],
      fitness: ['gym', 'fitness', 'workout', 'training', 'exercise', 'health'],
      healthcare: ['medical', 'healthcare', 'clinic', 'doctor', 'wellness']
    };
    
    return keywords[category] || ['service', 'business', 'professional'];
  }
}

module.exports = new HeadlineGenerator(); 