import { useState } from "react";
import { 
  Sprout, 
  CloudRain, 
  Bug, 
  TrendingUp, 
  Leaf,
  ChevronRight,
  Settings,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  {
    id: "crop-advisory",
    title: "Crop Advisory",
    subtitle: "Real-time guidance",
    icon: Sprout,
    color: "text-green-200",
  },
  {
    id: "weather-alerts",
    title: "Weather Alerts",
    subtitle: "Location-based",
    icon: CloudRain,
    color: "text-orange-200",
  },
  {
    id: "pest-detection",
    title: "Pest Detection",
    subtitle: "Image analysis",
    icon: Bug,
    color: "text-blue-200",
  },
  {
    id: "market-prices",
    title: "Market Prices",
    subtitle: "Live updates",
    icon: TrendingUp,
    color: "text-yellow-200",
  },
  {
    id: "soil-health",
    title: "Soil Health",
    subtitle: "Recommendations",
    icon: Leaf,
    color: "text-green-300",
  },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  return (
    <div className="w-80 h-screen bg-gradient-sidebar text-sidebar-foreground flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border border-opacity-30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Sprout className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Kisan Saathi</h1>
          </div>
        </div>
        <p className="text-sm text-sidebar-foreground opacity-80">Smart Crop Advisory System</p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all duration-300",
                "hover:bg-sidebar-accent hover:bg-opacity-20",
                "group relative overflow-hidden",
                isActive && "bg-sidebar-accent bg-opacity-30 shadow-medium"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "bg-sidebar-primary bg-opacity-20 group-hover:bg-opacity-30 transition-all",
                  isActive && "bg-sidebar-primary bg-opacity-40"
                )}>
                  <IconComponent className={cn("w-5 h-5", item.color)} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sidebar-foreground">{item.title}</h3>
                  <p className="text-sm text-sidebar-foreground opacity-70">{item.subtitle}</p>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 text-sidebar-foreground opacity-50 transition-transform",
                  isActive && "rotate-90 opacity-100"
                )} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Language Selector */}
      <div className="p-4 border-t border-sidebar-border border-opacity-30">
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-3 bg-sidebar-primary bg-opacity-20 rounded-lg text-sidebar-foreground appearance-none cursor-pointer hover:bg-opacity-30 transition-all"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी</option>
            <option value="Bengali">বাংলা</option>
            <option value="Tamil">தமிழ்</option>
            <option value="Telugu">తెలుగు</option>
            <option value="Marathi">मराठी</option>
          </select>
          <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground opacity-70 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}