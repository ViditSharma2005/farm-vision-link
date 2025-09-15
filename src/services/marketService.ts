// Market price service using government APIs and mock data
export interface MarketPrice {
  commodity: string;
  variety?: string;
  market: string;
  state: string;
  price: {
    min: number;
    max: number;
    modal: number; // Most common price
  };
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  change: number; // Percentage change
}

export interface CommodityCategory {
  name: string;
  commodities: string[];
}

export class MarketService {
  private static instance: MarketService;

  public static getInstance(): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService();
    }
    return MarketService.instance;
  }

  // Government API endpoints (these would be real in production)
  private readonly API_ENDPOINTS = {
    agmarknet: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
    commodity_prices: 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24',
  };

  async getMarketPrices(state?: string, commodity?: string): Promise<MarketPrice[]> {
    try {
      // For demo purposes, return mock data
      // In production, this would call real government APIs
      return this.getMockMarketData(state, commodity);
      
      /* Real API implementation would look like:
      const params = new URLSearchParams({
        'api-key': API_KEY,
        format: 'json',
        ...(state && { state }),
        ...(commodity && { commodity }),
      });
      
      const response = await fetch(`${this.API_ENDPOINTS.agmarknet}?${params}`);
      const data = await response.json();
      return this.processMarketData(data.records);
      */
    } catch (error) {
      console.error('Error fetching market prices:', error);
      return this.getMockMarketData(state, commodity);
    }
  }

  async getCommodityCategories(): Promise<CommodityCategory[]> {
    return [
      {
        name: "Cereals",
        commodities: ["Rice", "Wheat", "Maize", "Bajra", "Jowar", "Barley", "Ragi"]
      },
      {
        name: "Pulses",
        commodities: ["Arhar/Tur", "Moong", "Urad", "Chana", "Masur", "Rajma", "Cowpea"]
      },
      {
        name: "Oilseeds",
        commodities: ["Groundnut", "Mustard", "Sunflower", "Soybean", "Sesame", "Safflower", "Niger"]
      },
      {
        name: "Spices",
        commodities: ["Turmeric", "Coriander", "Cumin", "Fenugreek", "Red Chilli", "Black Pepper", "Cardamom"]
      },
      {
        name: "Vegetables",
        commodities: ["Onion", "Potato", "Tomato", "Cauliflower", "Cabbage", "Brinjal", "Okra", "Bitter Gourd"]
      },
      {
        name: "Fruits",
        commodities: ["Apple", "Banana", "Orange", "Mango", "Grapes", "Pomegranate", "Papaya", "Guava"]
      }
    ];
  }

  async getPriceHistory(commodity: string, days: number = 30): Promise<{ date: string, price: number }[]> {
    // Mock historical data - in production, this would fetch real historical prices
    const history = [];
    const basePrice = this.getBasePriceForCommodity(commodity);
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate price fluctuations
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const price = basePrice * (1 + variation);
      
      history.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100
      });
    }
    
    return history;
  }

  private getMockMarketData(state?: string, commodity?: string): MarketPrice[] {
    const mockData: MarketPrice[] = [
      {
        commodity: "Rice",
        variety: "Common",
        market: "APMC Pune",
        state: "Maharashtra",
        price: { min: 2800, max: 3200, modal: 3000 },
        unit: "Quintal",
        date: new Date().toISOString().split('T')[0],
        trend: "up",
        change: 2.5
      },
      {
        commodity: "Wheat",
        variety: "Lokvan",
        market: "APMC Delhi",
        state: "Delhi",
        price: { min: 2200, max: 2600, modal: 2400 },
        unit: "Quintal",
        date: new Date().toISOString().split('T')[0],
        trend: "stable",
        change: 0.1
      },
      {
        commodity: "Onion",
        variety: "Red",
        market: "APMC Nashik",
        state: "Maharashtra",
        price: { min: 1500, max: 2000, modal: 1750 },
        unit: "Quintal",
        date: new Date().toISOString().split('T')[0],
        trend: "down",
        change: -5.2
      },
      {
        commodity: "Turmeric",
        variety: "Finger",
        market: "APMC Sangli",
        state: "Maharashtra",
        price: { min: 8500, max: 9500, modal: 9000 },
        unit: "Quintal",
        date: new Date().toISOString().split('T')[0],
        trend: "up",
        change: 8.7
      },
      {
        commodity: "Soybean",
        variety: "Yellow",
        market: "APMC Indore",
        state: "Madhya Pradesh",
        price: { min: 4200, max: 4800, modal: 4500 },
        unit: "Quintal",
        date: new Date().toISOString().split('T')[0],
        trend: "up",
        change: 3.4
      },
      {
        commodity: "Cotton",
        variety: "Medium Staple",
        market: "APMC Akola",
        state: "Maharashtra",
        price: { min: 5800, max: 6200, modal: 6000 },
        unit: "Quintal",
        date: new Date().toISOString().split('T')[0],
        trend: "stable",
        change: -0.8
      },
      {
        commodity: "Sugarcane",
        variety: "Common",
        market: "APMC Kolhapur",
        state: "Maharashtra",
        price: { min: 280, max: 320, modal: 300 },
        unit: "Quintal",
        date: new Date().toISOString().split('T')[0],
        trend: "up",
        change: 1.7
      },
      {
        commodity: "Tomato",
        variety: "Local",
        market: "APMC Bangalore",
        state: "Karnataka",
        price: { min: 800, max: 1200, modal: 1000 },
        unit: "Quintal",
        date: new Date().toISOString().split('T')[0],
        trend: "down",
        change: -12.5
      }
    ];

    // Filter by state and commodity if provided
    let filteredData = mockData;
    
    if (state) {
      filteredData = filteredData.filter(item => 
        item.state.toLowerCase().includes(state.toLowerCase())
      );
    }
    
    if (commodity) {
      filteredData = filteredData.filter(item => 
        item.commodity.toLowerCase().includes(commodity.toLowerCase())
      );
    }
    
    return filteredData;
  }

  private getBasePriceForCommodity(commodity: string): number {
    const basePrices: { [key: string]: number } = {
      'Rice': 3000,
      'Wheat': 2400,
      'Onion': 1750,
      'Turmeric': 9000,
      'Soybean': 4500,
      'Cotton': 6000,
      'Sugarcane': 300,
      'Tomato': 1000,
    };
    
    return basePrices[commodity] || 2000;
  }

  getMarketAdvice(prices: MarketPrice[]): string[] {
    const advice: string[] = [];
    
    prices.forEach(price => {
      if (price.trend === 'up' && price.change > 5) {
        advice.push(`📈 ${price.commodity} prices are rising (+${price.change}%) - Good time to sell!`);
      } else if (price.trend === 'down' && price.change < -5) {
        advice.push(`📉 ${price.commodity} prices are falling (${price.change}%) - Consider holding or buying for future.`);
      } else if (price.trend === 'up' && price.change > 0) {
        advice.push(`📊 ${price.commodity} showing positive trend (+${price.change}%).`);
      }
    });
    
    if (advice.length === 0) {
      advice.push("📊 Market prices are relatively stable. Good time for planned transactions.");
    }
    
    return advice;
  }

  async getStateMarkets(state: string): Promise<string[]> {
    // Mock data - in production, this would fetch from government APIs
    const stateMarkets: { [key: string]: string[] } = {
      'Maharashtra': ['APMC Pune', 'APMC Mumbai', 'APMC Nashik', 'APMC Aurangabad', 'APMC Nagpur'],
      'Karnataka': ['APMC Bangalore', 'APMC Mysore', 'APMC Hubli', 'APMC Belgaum'],
      'Madhya Pradesh': ['APMC Indore', 'APMC Bhopal', 'APMC Ujjain', 'APMC Ratlam'],
      'Uttar Pradesh': ['APMC Lucknow', 'APMC Kanpur', 'APMC Agra', 'APMC Meerut'],
      'Gujarat': ['APMC Ahmedabad', 'APMC Surat', 'APMC Rajkot', 'APMC Vadodara'],
    };
    
    return stateMarkets[state] || ['APMC Market'];
  }
}

export const marketService = MarketService.getInstance();