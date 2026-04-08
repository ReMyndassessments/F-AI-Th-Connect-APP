import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, Share, Smartphone } from "lucide-react";
import { useLocation } from "wouter";
import { usePWA } from "@/hooks/usePWA";

export default function Header() {
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { canInstall, install } = usePWA();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const startChat = () => {
    setLocation("/chat");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold faith-gradient-text">F-AI-TH-Connect</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setLocation("/bible")}
              className="text-gray-600 hover:text-blue-500 transition-colors font-medium"
            >
              D-Groups
            </button>
            <button
              onClick={() => setLocation("/bible-games")}
              className="text-gray-600 hover:text-blue-500 transition-colors font-medium"
            >
              Bible Games
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              How It Works
            </button>

            <Button
              onClick={() => setLocation("/share")}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 touch-target mobile-tap"
              title="Share App - Get QR Code"
            >
              <Share className="w-5 h-5 text-gray-600" />
            </Button>
            {canInstall && (
              <Button
                onClick={install}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 touch-target mobile-tap"
                title="Install App"
              >
                <Smartphone className="w-5 h-5 text-green-600" />
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="px-3 lg:px-4 py-2 rounded-lg font-medium border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 text-sm lg:text-base touch-target mobile-tap"
            >
              <a href="https://www.givesendgo.com/CodeandCoffeeforChrist" target="_blank" rel="noopener noreferrer">
                💝 Support
              </a>
            </Button>
            <Button
              onClick={startChat}
              className="faith-button-primary px-4 lg:px-6 py-2 rounded-lg font-medium text-sm lg:text-base touch-target mobile-tap"
            >
              Start Chatting
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 touch-target mobile-tap rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile menu - Enhanced for touch */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setLocation("/bible");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:text-blue-500 transition-colors text-left font-medium py-3 px-2 rounded-lg hover:bg-gray-50 touch-target mobile-tap"
              >
                D-Groups
              </button>
              <button
                onClick={() => {
                  setLocation("/bible-games");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:text-blue-500 transition-colors text-left font-medium py-3 px-2 rounded-lg hover:bg-gray-50 touch-target mobile-tap"
              >
                Bible Games
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-600 hover:text-blue-500 transition-colors text-left py-3 px-2 rounded-lg hover:bg-gray-50 touch-target mobile-tap"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-600 hover:text-blue-500 transition-colors text-left py-3 px-2 rounded-lg hover:bg-gray-50 touch-target mobile-tap"
              >
                How It Works
              </button>

              <Button
                onClick={() => setLocation("/share")}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-blue-500 py-3 touch-target mobile-tap"
              >
                <Share className="w-4 h-4 mr-2" />
                Share App
              </Button>
              {canInstall && (
                <Button
                  onClick={install}
                  variant="ghost"
                  className="w-full justify-start text-green-600 hover:text-green-700 py-3 touch-target mobile-tap"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Install App
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 py-3 touch-target mobile-tap"
              >
                <a href="https://www.givesendgo.com/CodeandCoffeeforChrist" target="_blank" rel="noopener noreferrer">
                  💝 Support This Ministry
                </a>
              </Button>
              <Button
                onClick={startChat}
                className="faith-button-primary w-full py-3 touch-target mobile-tap"
              >
                Start Chatting
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
