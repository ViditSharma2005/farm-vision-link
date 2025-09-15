import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  const [activeSection, setActiveSection] = useState("crop-advisory");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <ChatInterface activeSection={activeSection} />
    </div>
  );
};

export default Index;
