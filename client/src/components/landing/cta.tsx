import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLocation } from "wouter";

export default function CTA() {
  const [, setLocation] = useLocation();

  const startChat = () => {
    setLocation("/chat");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-500 via-blue-600 to-amber-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Begin Your Spiritual Journey Today</h2>
        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
          Join thousands of believers who are growing in faith through AI-powered biblical guidance. Start your free conversation now.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={startChat}
            className="bg-white text-blue-500 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
          >
            Start Free Conversation
          </Button>
          <Button
            onClick={() => setLocation("/admin")}
            variant="outline"
            className="admin-button-cta px-8 py-4 rounded-xl transition-all font-semibold text-lg"
          >
            Admin Dashboard
          </Button>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-blue-100 text-sm">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>No Registration Required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>Completely Free</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>Instant Access</span>
          </div>
        </div>
      </div>
    </section>
  );
}
