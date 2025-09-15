import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  RefreshCw,
  MapPin,
  Calendar,
  IndianRupee,
  BarChart3
} from "lucide-react";
import { marketService, MarketPrice } from "@/services/marketService";
import { cn } from "@/lib/utils";

export function MarketWidget() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await marketService.getMarketPrices(selectedState, searchTerm);
      setPrices(data);
    } catch (error) {
      console.error('Error fetching market prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedState]);

  const handleSearch = () => {
    fetchPrices();
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <BarChart3 className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return "text-green-600 bg-green-50 border-green-200";
    if (trend === 'down') return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const filteredPrices = prices.filter(price =>
    price.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    price.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-1/2"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const advice = marketService.getMarketAdvice(prices);

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search commodities or markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} size="sm">
            <Search className="w-4 h-4" />
          </Button>
          <Button onClick={fetchPrices} variant="outline" size="sm">
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>
      </Card>

      {/* Market Prices */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-primary" />
          Live Market Prices
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredPrices.map((price, index) => (
            <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{price.commodity}</h4>
                  {price.variety && (
                    <Badge variant="outline" className="text-xs">
                      {price.variety}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(price.trend)}
                  <Badge className={cn("text-xs", getTrendColor(price.trend))}>
                    {price.change > 0 ? '+' : ''}{price.change}%
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Modal Price</p>
                  <p className="font-semibold text-primary">₹{price.price.modal}/{price.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Range</p>
                  <p className="font-semibold">₹{price.price.min} - ₹{price.price.max}</p>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Market</p>
                    <p className="font-medium">{price.market}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{price.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No market data found. Try adjusting your search.</p>
          </div>
        )}
      </Card>

      {/* Market Advice */}
      {advice.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Market Insights
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
      )}
    </div>
  );
}