import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, X, MessageCircle, Book, Heart } from "lucide-react";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoSteps = [
  {
    title: "Welcome to F-AI-TH-Connect",
    description: "Your AI companion for biblical guidance and spiritual support",
    icon: MessageCircle,
    bgColor: "bg-blue-500",
    duration: 3000
  },
  {
    title: "Ask Any Spiritual Question",
    description: "Share your concerns, prayer requests, or questions about faith",
    icon: Heart,
    bgColor: "bg-amber-500",
    duration: 4000
  },
  {
    title: "Receive Scripture-Based Answers",
    description: "Get thoughtful responses grounded in biblical wisdom",
    icon: Book,
    bgColor: "bg-blue-500",
    duration: 4000
  },
  {
    title: "Explore Biblical References",
    description: "Every response includes relevant Scripture passages and context",
    icon: Book,
    bgColor: "bg-amber-500",
    duration: 4000
  },
  {
    title: "Continue Your Journey",
    description: "Build ongoing conversations as your faith grows",
    icon: MessageCircle,
    bgColor: "bg-blue-500",
    duration: 3000
  }
];

export default function DemoVideoModal({ isOpen, onClose }: DemoVideoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isOpen) {
      const currentStepDuration = demoSteps[currentStep].duration;
      const progressInterval = 50; // Update every 50ms
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (progressInterval / currentStepDuration) * 100;
          
          if (newProgress >= 100) {
            // Move to next step
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(prev => prev + 1);
              return 0;
            } else {
              // Demo complete
              setIsPlaying(false);
              setCurrentStep(0);
              return 0;
            }
          }
          
          return newProgress;
        });
      }, progressInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isOpen, currentStep]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    onClose();
  };

  const current = demoSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">F-AI-TH-Connect Demo</DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Demo Content */}
          <div className="px-6">
            <div className={`${current.bgColor} rounded-2xl p-8 text-white text-center min-h-[300px] flex flex-col items-center justify-center`}>
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <current.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{current.title}</h3>
              <p className="text-lg text-white text-opacity-90 max-w-md leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Step {currentStep + 1} of {demoSteps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {demoSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? "bg-blue-500"
                      : index < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 pt-4 flex items-center justify-center space-x-4">
            <Button
              onClick={handlePlayPause}
              className="faith-button-primary px-6"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {currentStep === 0 && progress === 0 ? "Start Demo" : "Resume"}
                </>
              )}
            </Button>
            
            <Button
              onClick={handleRestart}
              variant="outline"
              className="px-6"
            >
              Restart
            </Button>
          </div>

          {/* Call to Action */}
          <div className="bg-gray-50 p-6 text-center">
            <p className="text-gray-600 mb-4">Ready to experience biblical guidance?</p>
            <Button
              onClick={() => {
                handleClose();
                window.location.href = '/chat';
              }}
              className="faith-button-primary px-8 py-3"
            >
              Start Your Conversation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}