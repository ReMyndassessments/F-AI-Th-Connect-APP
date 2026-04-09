import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLocation } from "wouter";
import commissionImage from "@assets/great-commission-matthew-28-19.png";

export default function Hero() {
  const [, setLocation] = useLocation();

  const startDGroup = () => {
    setLocation("/bible");
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
              <span className="faith-gradient-text">Built for D-Groups</span>
              <span className="text-gray-900"> and Bible Study Communities</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              Upload your CCF 4&nbsp;W's guide, generate a themed study for your group, and meet live in a free video room — all in one place. Built to equip communities to study the Word and go reach the lost and unreached.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
              <Button
                onClick={startDGroup}
                className="faith-button-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg touch-target mobile-tap"
              >
                Start Your D-Group Study
              </Button>
            </div>

            {/* Support Ministry Button */}
            <div className="mt-4 sm:mt-6 flex justify-center lg:justify-start px-4 sm:px-0">
              <Button
                onClick={() => setLocation("/support")}
                variant="outline"
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 touch-target mobile-tap text-sm sm:text-base"
              >
                💝 Fund Missions — Keep Us Free
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>CCF 4 W's Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Free Video Rooms</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Always Free</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={commissionImage}
              alt="Go and make disciples of all nations — Matthew 28:19, The Great Commission" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
            {/* Verse overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-5 sm:p-7">
              <p className="text-white text-base sm:text-lg font-semibold italic leading-snug drop-shadow-lg">
                "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."
              </p>
              <p className="mt-2 text-amber-300 font-bold text-sm tracking-wider uppercase drop-shadow">
                Matthew 28:19 — The Great Commission
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}
