import { useState, useEffect } from "react";
import { Send, Mic, Bot, User, Cloud, Wheat, TrendingUp, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeatherWidget } from "@/components/WeatherWidget";
import { MarketWidget } from "@/components/MarketWidget";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  activeSection: string;
}

const quickActions = [
  { id: "weather", label: "Weather Forecast", icon: Cloud, color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { id: "crops", label: "Seasonal Crops", icon: Wheat, color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { id: "prices", label: "Market Prices", icon: TrendingUp, color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
  { id: "soil", label: "Soil Health", icon: Leaf, color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
];

export function ChatInterface({ activeSection }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content: `Namaste! 🙏 I'm your AI Crop Advisor. I'm here to help you with:

• Crop selection and planning
• Weather-based alerts
• Pest and disease identification
• Soil health recommendations
• Market prices
• Fertilizer guidance

How can I assist you today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response based on the message content
    setTimeout(() => {
      let botResponse = "";
      const lowerInput = inputMessage.toLowerCase();

      if (lowerInput.includes("weather")) {
        botResponse = "I'll get you the latest weather information for your location. Please share your location or specify the area you're interested in. Check the Weather Alerts section for detailed forecasts and farming recommendations.";
      } else if (lowerInput.includes("price") || lowerInput.includes("market")) {
        botResponse = "I can help you with current market prices for various crops. Which crop are you interested in selling or buying? You can also check the Market Prices section for live updates from APMCs across India.";
      } else if (lowerInput.includes("crop") || lowerInput.includes("plant")) {
        botResponse = "I'd be happy to help with crop recommendations! What's your location and what season are you planning for? I can suggest the best crops based on your soil type, climate, and market demand.";
      } else if (lowerInput.includes("soil")) {
        botResponse = "For soil health analysis, I can provide recommendations based on your soil type and crop requirements. Do you have any recent soil test reports? I can help interpret the results and suggest improvements.";
      } else if (lowerInput.includes("pest") || lowerInput.includes("disease")) {
        botResponse = "I can help identify pests and diseases! Please describe the symptoms you're seeing, or if you have images, I can analyze them. Early detection is key to effective treatment.";
      } else {
        botResponse = "That's a great question! I'm here to help with all aspects of farming. Could you provide more specific details so I can give you the most accurate advice?";
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickAction = (actionId: string) => {
    let message = "";
    switch (actionId) {
      case "weather":
        message = "Show me the weather forecast for my area";
        break;
      case "crops":
        message = "What crops should I plant this season?";
        break;
      case "prices":
        message = "Show me current market prices";
        break;
      case "soil":
        message = "Help me with soil health recommendations";
        break;
    }
    setInputMessage(message);
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "crop-advisory": return "AI Crop Advisor";
      case "weather-alerts": return "Weather Advisory";
      case "pest-detection": return "Pest Detection";
      case "market-prices": return "Market Intelligence";
      case "soil-health": return "Soil Health Advisor";
      default: return "AI Crop Advisor";
    }
  };

  const renderChatInterface = () => (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.type === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.type === "bot" && (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 shadow-soft",
                message.type === "bot"
                  ? "bg-chat-bubble text-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
              <p className={cn(
                "text-xs mt-2 opacity-70",
                message.type === "bot" ? "text-muted-foreground" : "text-primary-foreground"
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.type === "user" && (
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="bg-chat-bubble rounded-2xl px-4 py-3 shadow-soft">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - Show only on first message */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.id)}
                  className={cn(
                    "rounded-full border-2 transition-all hover:scale-105",
                    action.color
                  )}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-6 bg-card">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about crops, weather, soil, pests, or market prices..."
              className="pr-12 py-3 rounded-xl border-2 focus:border-primary"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-primary hover:opacity-90 transition-all hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-6 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{getSectionTitle()}</h2>
            <p className="text-muted-foreground">Get personalized farming guidance</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-status-online rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-status-online">Online</span>
          </div>
        </div>
      </div>

      {/* Dynamic Content based on active section */}
      {activeSection === "weather-alerts" || activeSection === "market-prices" ? (
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === "weather-alerts" && <WeatherWidget />}
          {activeSection === "market-prices" && <MarketWidget />}
        </div>
      ) : (
        renderChatInterface()
      )}
    </div>
  );
}