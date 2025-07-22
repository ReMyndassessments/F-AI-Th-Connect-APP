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
        recognitionRef.current.continuous = false; // Change to false for better control
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          console.log('Speech recognition result:', event);
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');

          const isFinal = event.results[event.results.length - 1].isFinal;
          console.log('Transcript:', transcript, 'isFinal:', isFinal);
          
          // Show interim results in the input field, send when final
          onTranscription(transcript, isFinal);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
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
          description: "Speak now. Click the microphone again to stop.",
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
      recognitionRef.current.stop();
      setIsListening(false);
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

