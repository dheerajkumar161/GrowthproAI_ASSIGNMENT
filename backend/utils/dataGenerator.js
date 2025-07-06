class DataGenerator {
  constructor() {
    this.reviewTemplates = {
      positive: [
        "Amazing experience! Highly recommend.",
        "Great service and friendly staff.",
        "Excellent quality and value.",
        "Will definitely come back again.",
        "Outstanding customer service.",
        "Best in the area, hands down.",
        "Professional and reliable service.",
        "Clean facility and great atmosphere.",
        "Fair prices and quality work.",
        "Very satisfied with the results."
      ],
      neutral: [
        "Good service overall.",
        "Decent experience, would recommend.",
        "Fair prices for the quality.",
        "Staff was helpful and friendly.",
        "Clean and organized facility.",
        "Met my expectations.",
        "Reasonable service and pricing.",
        "Convenient location and hours.",
        "Professional staff and service.",
        "Satisfactory experience."
      ],
      negative: [
        "Disappointed with the service.",
        "Not worth the price.",
        "Poor customer service.",
        "Would not recommend.",
        "Below average quality.",
        "Unprofessional staff.",
        "Overpriced for what you get.",
        "Long wait times.",
        "Dirty and unorganized.",
        "Not satisfied with results."
      ]
    };

    this.businessNames = {
      restaurant: [
        "The Golden Plate", "Cafe Bella Vista", "Spice Garden", "Rustic Kitchen",
        "Urban Bistro", "Fresh Harvest", "Coastal Grill", "Mountain View Cafe",
        "Sunset Diner", "Heritage Restaurant", "Fusion Kitchen", "Artisan Table",
        "Riverside Cafe", "Vintage Bistro", "Modern Eats"
      ],
      salon: [
        "Elegance Salon", "Beauty Haven", "Style Studio", "Glamour Lounge",
        "Chic Cuts", "Luxe Beauty", "Artisan Hair", "Graceful Styling",
        "Premier Salon", "Beauty Boutique", "Style Lab", "Glamour Studio",
        "Elegant Cuts", "Beauty Bar", "Style Haven"
      ],
      retail: [
        "Urban Market", "Boutique Central", "Style Store", "Quality Goods",
        "Modern Retail", "Premium Shop", "Style Gallery", "Urban Outfitters",
        "Fashion Forward", "Lifestyle Store", "Quality Market", "Style Center",
        "Urban Boutique", "Premium Market", "Style Gallery"
      ],
      fitness: [
        "Peak Performance", "Elite Fitness", "Power Gym", "Wellness Center",
        "Strength Studio", "Fit Life", "Energy Gym", "Vitality Center",
        "Peak Training", "Elite Wellness", "Power Center", "Fit Studio",
        "Strength Gym", "Wellness Hub", "Energy Center"
      ],
      healthcare: [
        "Wellness Clinic", "Health Center", "Medical Care", "Wellness Hub",
        "Health Partners", "Medical Center", "Wellness Care", "Health Clinic",
        "Medical Partners", "Wellness Center", "Health Care", "Medical Hub",
        "Wellness Partners", "Health Center", "Medical Care"
      ]
    };
  }

  generateReviewText(rating) {
    let templates;
    if (rating >= 4.5) {
      templates = this.reviewTemplates.positive;
    } else if (rating >= 3.5) {
      templates = this.reviewTemplates.neutral;
    } else {
      templates = this.reviewTemplates.negative;
    }
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  generateBusinessName(category) {
    const names = this.businessNames[category] || this.businessNames.retail;
    return names[Math.floor(Math.random() * names.length)];
  }

  generateLocation() {
    const cities = [
      "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX",
      "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA",
      "Dallas, TX", "San Jose, CA", "Austin, TX", "Jacksonville, FL",
      "Fort Worth, TX", "Columbus, OH", "Charlotte, NC", "San Francisco, CA",
      "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC"
    ];
    
    return cities[Math.floor(Math.random() * cities.length)];
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

  generateRatingDistribution(rating, totalReviews) {
    const distribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    
    // Calculate distribution percentages based on rating
    const percentages = this.calculateRatingPercentages(rating);
    
    let reviewsLeft = totalReviews;
    
    Object.keys(distribution).reverse().forEach(star => {
      const percentage = percentages[star];
      const count = Math.round(reviewsLeft * percentage);
      distribution[star] = Math.min(count, reviewsLeft);
      reviewsLeft -= distribution[star];
    });
    
    return distribution;
  }

  calculateRatingPercentages(rating) {
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

  generateCompetitorData(businessData) {
    const competitors = [];
    const businessTypes = ['restaurant', 'salon', 'retail', 'fitness', 'healthcare'];
    
    const competitorCount = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < competitorCount; i++) {
      const type = businessTypes[Math.floor(Math.random() * businessTypes.length)];
      const competitor = {
        id: `comp-${i + 1}`,
        name: this.generateBusinessName(type),
        type,
        rating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 1000) + 50,
        distance: (Math.random() * 5 + 0.5).toFixed(1),
        marketShare: Math.round(Math.random() * 20 + 5)
      };
      
      competitors.push(competitor);
    }
    
    return competitors.sort((a, b) => b.rating - a.rating);
  }

  generateTrendData(businessData) {
    const days = 30;
    const trends = [];
    let baseRating = businessData.rating;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const variation = (Math.random() - 0.5) * 0.2;
      const rating = Math.max(1, Math.min(5, baseRating + variation));
      
      trends.push({
        date: date.toISOString().split('T')[0],
        rating: Math.round(rating * 10) / 10,
        reviews: Math.floor(Math.random() * 20) + 5
      });
    }
    
    return trends;
  }

  calculateSEOScore(businessData) {
    let score = 0;
    const { name, location, category, rating } = businessData;
    
    // Business name inclusion
    if (name && name.length > 0) score += 20;
    
    // Location inclusion
    if (location && location.length > 0) score += 20;
    
    // Category relevance
    if (category && category.length > 0) score += 15;
    
    // Rating factor
    if (rating >= 4.5) score += 25;
    else if (rating >= 4.0) score += 20;
    else if (rating >= 3.5) score += 15;
    else score += 10;
    
    // Additional factors
    score += Math.floor(Math.random() * 20);
    
    return Math.min(score, 100);
  }

  generateSocialMetrics(businessData) {
    const { rating } = businessData;
    const baseFollowers = Math.floor(rating * 1000) + Math.floor(Math.random() * 500);
    
    return {
      followers: baseFollowers,
      following: Math.floor(baseFollowers * 0.3),
      posts: Math.floor(baseFollowers * 0.1),
      engagementRate: Math.round((rating - 3) * 0.1 * 100) / 100,
      lastPost: this.generateRecentDate()
    };
  }
}

module.exports = new DataGenerator(); 