import { useEffect, useState } from "react";
import { getCurrentSeasonalPhoto } from "@/utils/seasonalPhotos";
import type { SeasonalPhoto } from "@/utils/seasonalPhotos";

interface SeasonalHeroProps {
  className?: string;
}

export default function SeasonalHero({ className = "" }: SeasonalHeroProps) {
  const [currentPhoto, setCurrentPhoto] = useState<SeasonalPhoto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updatePhoto = () => {
      try {
        const photo = getCurrentSeasonalPhoto();
        setCurrentPhoto(photo);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading seasonal photo:", error);
        setIsLoading(false);
      }
    };

    updatePhoto();

    // Update photo daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      updatePhoto();
      // Set up daily interval after first midnight
      const interval = setInterval(updatePhoto, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading || !currentPhoto) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url("${currentPhoto.imageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-white bg-opacity-90 rounded-lg p-6 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentPhoto.title}
          </h2>
          <p className="text-gray-600 text-sm">
            {currentPhoto.description}
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Season: {currentPhoto.season.charAt(0).toUpperCase() + currentPhoto.season.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Smaller variant for sidebar use
export function SeasonalHeroCompact({ className = "" }: SeasonalHeroProps) {
  const [currentPhoto, setCurrentPhoto] = useState<SeasonalPhoto | null>(null);

  useEffect(() => {
    const photo = getCurrentSeasonalPhoto();
    setCurrentPhoto(photo);
  }, []);

  if (!currentPhoto) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-md h-32 ${className}`}>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url("${currentPhoto.imageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative z-10 flex items-end h-full p-3">
        <div className="bg-white bg-opacity-90 rounded px-3 py-1">
          <div className="text-sm font-semibold text-gray-800">
            {currentPhoto.title}
          </div>
          <div className="text-xs text-gray-600">
            {currentPhoto.season.charAt(0).toUpperCase() + currentPhoto.season.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );
}