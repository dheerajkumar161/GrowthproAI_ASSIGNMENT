const dataGenerator = require('../utils/dataGenerator');

class BusinessAnalyzer {
  constructor() {
    this.businessTypes = {
      restaurant: {
        keywords: ['restaurant', 'cafe', 'diner', 'bistro', 'pizzeria', 'grill', 'kitchen', 'food', 'eat', 'dining'],
        ratingRange: { min: 3.2, max: 4.8 },
        reviewRange: { min: 50, max: 2000 },
        category: 'Food & Dining'
      },
      salon: {
        keywords: ['salon', 'spa', 'beauty', 'hair', 'nail', 'cosmetic', 'stylist', 'barber', 'beauty salon'],
        ratingRange: { min: 3.5, max: 4.9 },
        reviewRange: { min: 30, max: 800 },
        category: 'Beauty & Wellness'
      },
      retail: {
        keywords: ['store', 'shop', 'retail', 'boutique', 'market', 'mall', 'outlet', 'department'],
        ratingRange: { min: 3.0, max: 4.6 },
        reviewRange: { min: 20, max: 1500 },
        category: 'Retail & Shopping'
      },
      fitness: {
        keywords: ['gym', 'fitness', 'workout', 'exercise', 'training', 'health', 'wellness', 'yoga', 'pilates'],
        ratingRange: { min: 3.8, max: 4.9 },
        reviewRange: { min: 40, max: 1200 },
        category: 'Health & Fitness'
      },
      healthcare: {
        keywords: ['clinic', 'medical', 'health', 'doctor', 'dental', 'pharmacy', 'hospital', 'care', 'wellness'],
        ratingRange: { min: 3.5, max: 4.7 },
        reviewRange: { min: 25, max: 600 },
        category: 'Healthcare'
      },
      other: {
        keywords: [],
        ratingRange: { min: 3.0, max: 5.0 },
        reviewRange: { min: 10, max: 1000 },
        category: 'Other'
      }
    };
  }

  detectBusinessType(businessName) {
    const name = businessName.toLowerCase();
    
    for (const [type, config] of Object.entries(this.businessTypes)) {
      if (config.keywords.some(keyword => name.includes(keyword))) {
        return type;
      }
    }
    
    return 'other';
  }

  generateBusinessData({ name, location, category, mainType, subType, description }) {
    const businessType = category || this.detectBusinessType(name);
    const typeConfig = this.businessTypes[businessType] || this.businessTypes.other;
    
    const businessId = this.generateBusinessId(name, location);
    const rating = this.generateRealisticRating(typeConfig.ratingRange);
    const reviewCount = this.generateReviewCount(typeConfig.reviewRange, location);
    
    return {
      id: businessId,
      name,
      location,
      category: businessType,
      categoryDisplay: typeConfig.category,
      mainType: mainType || '',
      subType: subType || '',
      description: description || '',
      rating,
      reviewCount,
      ratingDistribution: this.generateRatingDistribution(rating, reviewCount),
      businessHours: this.generateBusinessHours(businessType),
      contactInfo: this.generateContactInfo(name, location),
      socialMetrics: this.generateSocialMetrics(businessType, rating),
      performanceMetrics: this.generatePerformanceMetrics(businessType, rating),
      lastUpdated: new Date().toISOString()
    };
  }

  generateBusinessId(name, location) {
    const timestamp = Date.now().toString(36);
    const nameHash = name.replace(/\s+/g, '').toLowerCase().slice(0, 6);
    const locationHash = location.replace(/\s+/g, '').toLowerCase().slice(0, 4);
    return `${nameHash}-${locationHash}-${timestamp}`;
  }

  generateRealisticRating({ min, max }) {
    // Generate a more realistic rating distribution
    const baseRating = Math.random() * (max - min) + min;
    const decimal = Math.random();
    
    // Add some variation to make ratings more realistic
    if (decimal < 0.3) {
      return Math.round(baseRating * 10) / 10;
    } else if (decimal < 0.7) {
      return Math.round(baseRating * 2) / 2;
    } else {
      return Math.round(baseRating);
    }
  }

  generateReviewCount({ min, max }, location) {
    // Location-based review count adjustment
    const locationMultiplier = this.getLocationMultiplier(location);
    const baseCount = Math.random() * (max - min) + min;
    return Math.round(baseCount * locationMultiplier);
  }

  getLocationMultiplier(location) {
    const majorCities = ['new york', 'los angeles', 'chicago', 'houston', 'phoenix'];
    const city = location.toLowerCase();
    
    if (majorCities.some(c => city.includes(c))) {
      return 1.5; // More reviews in major cities
    } else if (city.includes('ca') || city.includes('ny') || city.includes('tx')) {
      return 1.2; // Slightly more in populous states
    }
    
    return 1.0;
  }

  generateRatingDistribution(rating, totalReviews) {
    const distribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    
    // Generate realistic distribution based on overall rating
    const remainingReviews = totalReviews;
    let reviewsLeft = remainingReviews;
    
    // Calculate distribution percentages based on rating
    const percentages = this.calculateRatingPercentages(rating);
    
    Object.keys(distribution).reverse().forEach(star => {
      const percentage = percentages[star];
      const count = Math.round(reviewsLeft * percentage);
      distribution[star] = Math.min(count, reviewsLeft);
      reviewsLeft -= distribution[star];
    });
    
    return distribution;
  }

  calculateRatingPercentages(rating) {
    // Realistic rating distribution based on overall rating
    if (rating >= 4.5) {
      return { 5: 0.6, 4: 0.25, 3: 0.1, 2: 0.03, 1: 0.02 };
    } else if (rating >= 4.0) {
      return { 5: 0.4, 4: 0.35, 3: 0.15, 2: 0.07, 1: 0.03 };
    } else if (rating >= 3.5) {
      return { 5: 0.25, 4: 0.35, 3: 0.25, 2: 0.1, 1: 0.05 };
    } else {
      return { 5: 0.1, 4: 0.25, 3: 0.3, 2: 0.2, 1: 0.15 };
    }
  }

  generateBusinessHours(businessType) {
    const hours = {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '11:00', close: '15:00' }
    };

    // Adjust hours based on business type
    if (businessType === 'restaurant') {
      hours.monday.close = '22:00';
      hours.tuesday.close = '22:00';
      hours.wednesday.close = '22:00';
      hours.thursday.close = '22:00';
      hours.friday.close = '23:00';
      hours.saturday.close = '23:00';
      hours.sunday.close = '21:00';
    } else if (businessType === 'salon') {
      hours.monday.open = '10:00';
      hours.sunday.open = '12:00';
      hours.sunday.close = '18:00';
    }

    return hours;
  }

  generateContactInfo(name, location) {
    return {
      phone: this.generatePhoneNumber(),
      email: this.generateEmail(name),
      website: this.generateWebsite(name),
      address: this.generateAddress(location)
    };
  }

  generatePhoneNumber() {
    const areaCodes = ['212', '213', '312', '713', '602', '215', '210', '619', '214', '408'];
    const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    const prefix = Math.floor(Math.random() * 900) + 100;
    const line = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${prefix}-${line}`;
  }

  generateEmail(businessName) {
    const cleanName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'business.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `contact@${cleanName}.${domain}`;
  }

  generateWebsite(businessName) {
    const cleanName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://www.${cleanName}.com`;
  }

  generateAddress(location) {
    const streetNumbers = ['123', '456', '789', '321', '654', '987'];
    const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr', 'Cedar Ln'];
    const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    return `${streetNumber} ${streetName}, ${location}`;
  }

  generateSocialMetrics(businessType, rating) {
    const baseFollowers = Math.floor(rating * 1000) + Math.floor(Math.random() * 500);
    const engagementRate = (rating - 3) * 0.1 + Math.random() * 0.05;
    
    return {
      followers: baseFollowers,
      following: Math.floor(baseFollowers * 0.3),
      posts: Math.floor(baseFollowers * 0.1),
      engagementRate: Math.round(engagementRate * 100) / 100,
      lastPost: this.generateRecentDate()
    };
  }

  generatePerformanceMetrics(businessType, rating) {
    const baseRevenue = Math.floor(rating * 50000) + Math.floor(Math.random() * 20000);
    const growthRate = (rating - 3.5) * 0.2 + Math.random() * 0.1;
    
    return {
      monthlyRevenue: baseRevenue,
      growthRate: Math.round(growthRate * 100) / 100,
      customerSatisfaction: Math.round(rating * 20),
      marketShare: Math.round((rating - 3) * 10 + Math.random() * 5),
      employeeCount: Math.floor(rating * 5) + Math.floor(Math.random() * 10)
    };
  }

  generateRecentDate() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7);
    const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    return date.toISOString();
  }
}

module.exports = new BusinessAnalyzer(); 