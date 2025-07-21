import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import { useLocation } from "wouter";

export default function Hero() {
  const [, setLocation] = useLocation();

  const startChat = () => {
    setLocation("/chat");
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-amber-50 py-20 lg:py-32 overflow-hidden">
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Find</span>
              <span className="faith-gradient-text"> Biblical Wisdom</span>
              <span className="text-gray-900"> Through AI</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Experience personalized Christian guidance, Scripture-based answers, and spiritual support powered by advanced AI. Connect with your faith in meaningful conversations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={startChat}
                className="faith-button-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
              >
                Start Free Conversation
              </Button>
              <Button
                variant="outline"
                className="faith-button-secondary px-8 py-4 rounded-xl font-semibold text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
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
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
              alt="People praying together in community" 
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
    </section>
  );
}
