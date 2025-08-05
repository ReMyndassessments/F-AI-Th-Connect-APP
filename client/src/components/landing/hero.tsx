import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import { useLocation } from "wouter";
import DemoVideoModal from "@/components/demo/demo-video-modal";
import easterImage from "@assets/easter-hero-image.png";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const startChat = () => {
    setLocation("/chat");
  };

  const openDemo = () => {
    setIsDemoOpen(true);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-amber-50 py-12 sm:py-16 lg:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(207, 90%, 54%) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(43, 96%, 56%) 0%, transparent 50%)`
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              <span className="text-gray-900">Find</span>
              <span className="faith-gradient-text"> Biblical Wisdom</span>
              <span className="text-gray-900"> Through AI</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              Experience personalized Christian guidance, Scripture-based answers, and spiritual support powered by advanced AI. Connect with your faith in meaningful conversations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
              <Button
                onClick={startChat}
                className="faith-button-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg touch-target mobile-tap"
              >
                Start Free Conversation
              </Button>
              <Button
                onClick={openDemo}
                variant="outline"
                className="faith-button-secondary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg touch-target mobile-tap"
              >
                <Play className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Support Ministry Button */}
            <div className="mt-4 sm:mt-6 flex justify-center lg:justify-start px-4 sm:px-0">
              <Button
                asChild
                variant="outline"
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 touch-target mobile-tap text-sm sm:text-base"
              >
                <a href="https://www.givesendgo.com/CodeandCoffeeforChrist" target="_blank" rel="noopener noreferrer">
                  💝 Support This Ministry
                </a>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Always Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Scripture-Based</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={easterImage}
              alt="Take a moment to reflect on the power of the resurrection - praying hands over open Bible" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
            
            {/* Floating chat preview */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 max-w-xs border border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">AI</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Consider Matthew 11:28: "Come to me, all you who are weary and burdened, and I will give you rest."
                  </p>
                  <p className="text-xs text-gray-500 mt-1">F-AI-TH-Connect • Now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DemoVideoModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
      />
    </section>
  );
}
