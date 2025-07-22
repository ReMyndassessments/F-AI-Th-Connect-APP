import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechInputProps {
  onTranscription: (text: string, isComplete?: boolean) => void;
  disabled?: boolean;
}

export default function SpeechInput({ onTranscription, disabled = false }: SpeechInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [accumulatedText, setAccumulatedText] = useState('');
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;
        
        // Add speech timeout settings for better control
        if ('webkitSpeechRecognition' in window) {
          // Webkit-specific settings for better speech detection
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
        }

        recognitionRef.current.onresult = (event: any) => {
          console.log('Speech recognition result:', event);
          
          // Get the current transcript
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i][0]) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          
          // Combine with accumulated text
          const fullTranscript = accumulatedText + currentTranscript;
          console.log('Full transcript:', fullTranscript);
          
          // Always show current text in input field
          onTranscription(fullTranscript, false);
          
          // If final result, add to accumulated text
          const isFinal = event.results[event.results.length - 1].isFinal;
          if (isFinal && currentTranscript.trim()) {
            setAccumulatedText(prev => prev + currentTranscript + ' ');
            console.log('Added to accumulated text:', currentTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Don't show error for 'aborted' - that's normal when user stops manually
          if (event.error === 'aborted') {
            return;
          }
          
          let errorMessage = 'Speech recognition failed. Please try again.';
          if (event.error === 'not-allowed') {
            errorMessage = 'Microphone access denied. Please enable microphone permissions.';
          } else if (event.error === 'no-speech') {
            errorMessage = 'No speech detected. Please try speaking again.';
          }
          
          toast({
            title: "Speech Recognition Error",
            description: errorMessage,
            variant: "destructive",
          });
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          
          // Auto-restart if still listening (to keep continuous recording)
          if (isListening && recognitionRef.current) {
            try {
              console.log('Auto-restarting speech recognition');
              restartTimeoutRef.current = setTimeout(() => {
                if (isListening && recognitionRef.current) {
                  recognitionRef.current.start();
                }
              }, 100);
            } catch (error) {
              console.log('Could not restart recognition:', error);
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscription, toast]);

  const startListening = () => {
    console.log('Attempting to start listening, isSupported:', isSupported, 'recognitionRef:', recognitionRef.current);
    if (recognitionRef.current && !isListening) {
      try {
        setAccumulatedText(''); // Reset accumulated text
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "Recording Started",
          description: "Speak your message. Click the microphone again to stop and send.",
        });
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Failed to start",
          description: "Could not start speech recognition. Check microphone permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false); // Set this first to prevent auto-restart
      
      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      
      recognitionRef.current.stop();
      
      // Send the accumulated message
      const finalMessage = accumulatedText.trim();
      if (finalMessage) {
        setTimeout(() => {
          onTranscription(finalMessage, true);
          toast({
            title: "Message Sent",
            description: "Your spoken message has been sent to the AI.",
          });
        }, 200);
      } else {
        toast({
          title: "Recording Stopped",
          description: "No speech detected. Try speaking again.",
          variant: "destructive",
        });
      }
      
      setAccumulatedText('');
    }
  };

  if (!isSupported) {
    return null; // Don't show the button if not supported
  }

  return (
    <Button
      type="button"
      variant={isListening ? "default" : "outline"}
      size="sm"
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      className={`${isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'hover:bg-gray-50'} transition-all duration-200`}
      title={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </Button>
  );
}

