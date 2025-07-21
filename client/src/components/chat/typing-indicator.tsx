import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface TypingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

export default function TypingIndicator({ isVisible, message = "Seeking biblical guidance..." }: TypingIndicatorProps) {
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setDots("");
      setProgress(0);
      return;
    }

    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Progress simulation for long requests
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev; // Don't complete until actually done
        return prev + Math.random() * 5;
      });
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="flex items-start space-x-3 mb-4">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-semibold text-sm">AI</span>
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 min-w-[200px]">
        <div className="flex items-center space-x-2 mb-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-sm text-gray-600">{message}{dots}</span>
        </div>
        
        {progress > 0 && (
          <div className="space-y-1">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-400 mt-2">
          Large content may take up to 60 seconds
        </p>
      </div>
    </div>
  );
}