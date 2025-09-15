// Weather service using OpenWeatherMap API
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo-key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex?: number;
  location: string;
  icon: string;
  forecast?: ForecastData[];
}

export interface ForecastData {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export class WeatherService {
  private static instance: WeatherService;

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      // For demo purposes, return mock data if no API key
      if (WEATHER_API_KEY === 'demo-key') {
        return this.getMockWeatherData(city);
      }

      const response = await fetch(
        `${WEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        location: `${data.name}, ${data.sys.country}`,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Return mock data as fallback
      return this.getMockWeatherData(city);
    }
  }

  async getWeatherForecast(city: string): Promise<ForecastData[]> {
    try {
      // For demo purposes, return mock data if no API key
      if (WEATHER_API_KEY === 'demo-key') {
        return this.getMockForecastData();
      }

      const response = await fetch(
        `${WEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process 5-day forecast (API returns 3-hour intervals)
      const dailyForecasts = this.processForecastData(data.list);
      
      return dailyForecasts.slice(0, 5); // Return 5-day forecast
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      return this.getMockForecastData();
    }
  }

  private processForecastData(forecastList: any[]): ForecastData[] {
    const dailyData: Map<string, any> = new Map();
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date,
          temperatures: [item.main.temp],
          descriptions: [item.weather[0].description],
          icons: [item.weather[0].icon],
          humidity: [item.main.humidity],
          windSpeed: [item.wind.speed],
        });
      } else {
        const existing = dailyData.get(date);
        existing.temperatures.push(item.main.temp);
        existing.descriptions.push(item.weather[0].description);
        existing.icons.push(item.weather[0].icon);
        existing.humidity.push(item.main.humidity);
        existing.windSpeed.push(item.wind.speed);
      }
    });

    return Array.from(dailyData.values()).map(day => ({
      date: day.date,
      temperature: {
        min: Math.round(Math.min(...day.temperatures)),
        max: Math.round(Math.max(...day.temperatures)),
      },
      description: day.descriptions[0], // Use first description of the day
      icon: day.icons[0],
      humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round(day.windSpeed.reduce((a: number, b: number) => a + b, 0) / day.windSpeed.length * 10) / 10,
    }));
  }

  private getMockWeatherData(city: string): WeatherData {
    return {
      temperature: 28,
      description: 'Partly cloudy',
      humidity: 65,
      windSpeed: 12,
      pressure: 1013,
      visibility: 10,
      location: city || 'Demo Location',
      icon: '02d',
      forecast: this.getMockForecastData(),
    };
  }

  private getMockForecastData(): ForecastData[] {
    const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
    return days.map((day, index) => ({
      date: day,
      temperature: {
        min: 22 + index,
        max: 30 + index,
      },
      description: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Sunny'][index],
      icon: ['01d', '02d', '03d', '10d', '01d'][index],
      humidity: 60 + index * 5,
      windSpeed: 10 + index * 2,
    }));
  }

  async getLocationWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      if (WEATHER_API_KEY === 'demo-key') {
        return this.getMockWeatherData('Your Location');
      }

      const response = await fetch(
        `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
        location: `${data.name}, ${data.sys.country}`,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error('Error fetching location weather:', error);
      return this.getMockWeatherData('Your Location');
    }
  }

  getWeatherAdvice(weather: WeatherData): string[] {
    const advice: string[] = [];
    
    if (weather.temperature > 35) {
      advice.push("🌡️ Very hot weather! Ensure adequate irrigation and shade for crops.");
      advice.push("💧 Increase watering frequency, especially for young plants.");
    } else if (weather.temperature < 10) {
      advice.push("❄️ Cold weather alert! Protect sensitive crops from frost.");
      advice.push("🛡️ Consider using row covers or plastic tunnels.");
    }
    
    if (weather.humidity > 80) {
      advice.push("💨 High humidity detected! Monitor for fungal diseases.");
      advice.push("🍃 Ensure good air circulation around plants.");
    } else if (weather.humidity < 30) {
      advice.push("🏜️ Low humidity! Increase watering and consider mulching.");
    }
    
    if (weather.windSpeed > 20) {
      advice.push("💨 Strong winds expected! Secure tall plants and provide windbreaks.");
    }
    
    if (weather.description.includes('rain')) {
      advice.push("🌧️ Rain expected! Avoid field work and ensure proper drainage.");
      advice.push("🚿 Good natural irrigation - reduce manual watering.");
    }
    
    return advice.length > 0 ? advice : ["🌱 Current weather conditions are favorable for most farming activities."];
  }
}

export const weatherService = WeatherService.getInstance();