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
  const recognitionRef = useRef<any>(null);
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
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');

          const isFinal = event.results[event.results.length - 1].isFinal;
          console.log('Transcript:', transcript, 'isFinal:', isFinal);
          
          // Always show interim results in the input field
          onTranscription(transcript, false);
          
          // Only auto-send if it's final AND we have meaningful content
          if (isFinal && transcript.trim().length > 0) {
            setTimeout(() => {
              onTranscription(transcript, true);
              toast({
                title: "Message Sent",
                description: "Your spoken message has been sent to the AI.",
              });
            }, 100); // Small delay to ensure UI updates
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
          setIsListening(false);
          
          // Auto-restart if still listening (to keep continuous recording)
          if (isListening && recognitionRef.current) {
            try {
              console.log('Auto-restarting speech recognition');
              setTimeout(() => {
                if (isListening && recognitionRef.current) {
                  recognitionRef.current.start();
                }
              }, 100);
            } catch (error) {
              console.log('Could not restart recognition:', error);
            }
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
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak now. The microphone will turn red. Click to stop recording.",
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
      recognitionRef.current.stop();
      toast({
        title: "Recording Stopped",
        description: "Processing your message...",
      });
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

