import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  MessageCircle, 
  Book, 
  Heart,
  Upload,
  BookOpen,
  Gamepad2,
  Users,
  Highlighter,
  Smartphone,
  HelpCircle,
  Church,
  ArrowRight
} from "lucide-react";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoSteps = [
  {
    title: "Welcome to F-AI-TH-Connect",
    description: "Your comprehensive Christian AI companion for spiritual growth, Bible study, and interactive faith-based learning",
    icon: MessageCircle,
    bgColor: "bg-blue-500",
    duration: 3000
  },
  {
    title: "AI Chat with Biblical Wisdom",
    description: "Ask spiritual questions and receive Scripture-grounded responses with biblical references and practical guidance",
    icon: Heart,
    bgColor: "bg-amber-500",
    duration: 4000
  },
  {
    title: "Upload Documents for Study",
    description: "Upload PDFs, text files, or documents to create personalized Bible studies and discussion guides",
    icon: Upload,
    bgColor: "bg-green-500",
    duration: 4000
  },
  {
    title: "Prompt Library for Ministry",
    description: "Access 30+ professionally written prompts organized by ministry areas - perfect for pastors and leaders",
    icon: BookOpen,
    bgColor: "bg-purple-500",
    duration: 4000
  },
  {
    title: "Bible Study Tools",
    description: "Look up verses across multiple translations (KJV, NIV, ESV, NLT, NASB) with premium voice playback",
    icon: Book,
    bgColor: "bg-blue-500",
    duration: 4000
  },
  {
    title: "Interactive Bible Games",
    description: "Test your knowledge with 4 game types: Scripture Scramble, Fill-in-the-Blank, Character Guessing, Memory Challenge",
    icon: Gamepad2,
    bgColor: "bg-orange-500",
    duration: 4500
  },
  {
    title: "Group Bible Study Features",
    description: "Icebreaker challenges for 3-15 participants, Quick Fire sessions, and Team Building activities for ministry groups",
    icon: Users,
    bgColor: "bg-indigo-500",
    duration: 4500
  },
  {
    title: "Advanced Study Features",
    description: "Text highlighting in 5 colors, export study notes, conversation search, and intelligent biblical spell check",
    icon: Highlighter,
    bgColor: "bg-pink-500",
    duration: 4000
  },
  {
    title: "Mobile & PWA Experience",
    description: "Install as a Progressive Web App for offline access, touch-optimized interface, and home screen convenience",
    icon: Smartphone,
    bgColor: "bg-teal-500",
    duration: 4000
  },
  {
    title: "Comprehensive Help Center",
    description: "Access detailed documentation, group leader resources, troubleshooting guides, and step-by-step instructions",
    icon: HelpCircle,
    bgColor: "bg-cyan-500",
    duration: 3500
  },
  {
    title: "Ministry Support & Community",
    description: "Support Christian ministry through integrated features and connect with a global faith community",
    icon: Church,
    bgColor: "bg-emerald-500",
    duration: 3500
  },
  {
    title: "Start Your Spiritual Journey",
    description: "Experience the full power of AI-powered biblical guidance, Bible study tools, and interactive learning",
    icon: ArrowRight,
    bgColor: "bg-gradient-to-r from-blue-500 to-amber-500",
    duration: 4000
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
            <DialogTitle className="text-2xl font-bold">F-AI-TH-Connect Demo</DialogTitle>
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