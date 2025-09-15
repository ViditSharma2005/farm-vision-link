import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Eye, 
  Thermometer,
  TrendingUp,
  TrendingDown,
  MapPin,
  RefreshCw
} from "lucide-react";
import { weatherService, WeatherData } from "@/services/weatherService";
import { cn } from "@/lib/utils";

interface WeatherWidgetProps {
  location?: string;
}

export function WeatherWidget({ location = "Mumbai" }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const data = await weatherService.getCurrentWeather(location);
      setWeather(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const getWeatherIcon = (description: string, size: string = "w-6 h-6") => {
    if (description.includes('rain')) return <CloudRain className={cn(size, "text-blue-500")} />;
    if (description.includes('cloud')) return <Cloud className={cn(size, "text-gray-500")} />;
    return <Sun className={cn(size, "text-yellow-500")} />;
  };

  const getTemperatureColor = (temp: number) => {
    if (temp > 35) return "text-red-500";
    if (temp > 25) return "text-orange-500";
    if (temp > 15) return "text-green-500";
    return "text-blue-500";
  };

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Unable to load weather data</p>
        <Button onClick={fetchWeather} variant="outline" className="mt-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </Card>
    );
  }

  const advice = weatherService.getWeatherAdvice(weather);

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-primary-light/20 to-primary-light/5 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{weather.location}</span>
          </div>
          <Button
            onClick={fetchWeather}
            variant="ghost"
            size="sm"
            disabled={loading}
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.description, "w-12 h-12")}
            <div>
              <div className={cn("text-4xl font-bold", getTemperatureColor(weather.temperature))}>
                {weather.temperature}°C
              </div>
              <p className="text-muted-foreground capitalize">{weather.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
            <Wind className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-semibold">{weather.windSpeed} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
            <Thermometer className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="font-semibold">{weather.pressure} hPa</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
            <Eye className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="font-semibold">{weather.visibility} km</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-right">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </Card>

      {/* Weather Advice */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Farming Recommendations
        </h3>
        <div className="space-y-2">
          {advice.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
              <span className="text-lg">{tip.split(' ')[0]}</span>
              <p className="text-sm text-muted-foreground flex-1">{tip.substring(tip.indexOf(' ') + 1)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}