import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');
  const sessionCountRef = useRef(0);
  const restartTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        // Configure speech recognition settings
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = 0; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Always accumulate final results
          if (finalTranscript.trim()) {
            finalTranscriptRef.current += finalTranscript + ' ';
            sessionCountRef.current++;
            console.log('Session', sessionCountRef.current, 'captured:', finalTranscript);
          }

          // Show current progress including interim
          const currentText = finalTranscriptRef.current + interimTranscript;
          if (currentText.trim()) {
            onTranscription(currentText, false);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          if (event.error === 'not-allowed') {
            setIsListening(false);
            setIsRecording(false);
            toast({
              title: "Microphone Permission Required",
              description: "Please allow microphone access in your browser and try again.",
              variant: "destructive",
            });
          } else if (event.error === 'no-speech') {
            console.log('No speech detected, will keep trying...');
          } else if (event.error !== 'aborted') {
            setIsListening(false);
            setIsRecording(false);
            toast({
              title: "Speech Recognition Unavailable",
              description: "Your browser's speech recognition is not working properly. Please type your message instead.",
              variant: "destructive",
            });
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          if (!isRecording) {
            setIsListening(false);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [onTranscription, toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        finalTranscriptRef.current = '';
        sessionCountRef.current = 0;
        onTranscription('', false);
        
        setIsRecording(true);
        setIsListening(true);
        recognitionRef.current.start();
        
        toast({
          title: "Listening...",
          description: "Speak your message clearly. Note: Speech recognition works best on newer browsers and may not work on all devices.",
        });
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsListening(false);
        setIsRecording(false);
        toast({
          title: "Speech Recognition Not Available",
          description: "Your browser doesn't support speech recognition or microphone access was denied. Please type your message instead.",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (isListening) {
      setIsRecording(false);
      setIsListening(false);
      
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      setTimeout(() => {
        const finalMessage = finalTranscriptRef.current.trim();
        if (finalMessage) {
          onTranscription(finalMessage, true);
          toast({
            title: "Message Sent",
            description: "Your spoken message has been sent to the AI.",
          });
        } else {
          toast({
            title: "No Speech Captured",
            description: "Speech recognition didn't capture any words. Please try typing your message or speak louder/closer to the microphone.",
            variant: "destructive",
          });
        }
        
        finalTranscriptRef.current = '';
        sessionCountRef.current = 0;
      }, 200);
    }
  };

  if (!isSupported) {
    return null; // Don't show the button if not supported
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isListening ? "default" : "outline"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
            disabled={disabled}
            className={`${isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'hover:bg-gray-50'} transition-all duration-200`}
          >
            {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">
              {isListening ? 'Click to stop recording' : 'Voice Input (Beta)'}
            </p>
            {!isListening && (
              <p className="text-xs text-muted-foreground mt-1">
                Works best on Chrome/Edge. May not work on all devices.
                <br />
                Typing is more reliable for longer messages.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

