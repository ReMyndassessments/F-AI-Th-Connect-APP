import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLocation } from "wouter";

export default function CTA() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-500 via-blue-600 to-amber-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Equip Your Group. Reach the Unreached.</h2>
        <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
          Join a growing community of D-Groups and mission teams studying the Word, discipling believers, and bringing the Gospel to the lost. Register your mission group to get a public profile and connect with supporters — completely free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => setLocation("/chat")}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg"
          >
            Start Free Conversation
          </Button>
          <Button
            onClick={() => setLocation("/missions/register")}
            variant="outline"
            className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg"
          >
            🌏 Register Your Mission
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-blue-100 text-sm">
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
            <span>Missions Partner Program</span>
          </div>
        </div>
      </div>
    </section>
  );
}
