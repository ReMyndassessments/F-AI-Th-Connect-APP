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
  const [hasStarted, setHasStarted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');
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

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          // Update final transcript reference
          if (finalTranscript) {
            finalTranscriptRef.current += finalTranscript + ' ';
          }

          // Show current progress to user
          const currentText = finalTranscriptRef.current + interimTranscript;
          if (currentText.trim()) {
            onTranscription(currentText, false);
          }

          console.log('Final:', finalTranscript, 'Interim:', interimTranscript, 'Total:', currentText);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          // Handle different error types
          if (event.error === 'aborted') {
            // Normal when stopping manually
            return;
          } else if (event.error === 'not-allowed') {
            setIsListening(false);
            toast({
              title: "Microphone Access Denied",
              description: "Please enable microphone permissions and try again.",
              variant: "destructive",
            });
          } else if (event.error === 'no-speech') {
            // Continue listening for no-speech errors
            console.log('No speech detected, continuing...');
          } else {
            setIsListening(false);
            toast({
              title: "Speech Recognition Error",
              description: "Speech recognition failed. Click the microphone to try again.",
              variant: "destructive",
            });
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
          setHasStarted(false);
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
    if (recognitionRef.current && !isListening) {
      try {
        finalTranscriptRef.current = '';
        onTranscription('', false); // Clear the input
        recognitionRef.current.start();
        setIsListening(true);
        setHasStarted(true);
        toast({
          title: "Recording Started",
          description: "Speak your message. Click the microphone again to stop.",
        });
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Microphone Error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
      
      // Send the message with a small delay to catch final words
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
            title: "No Speech Detected",
            description: "Please try speaking again.",
            variant: "destructive",
          });
        }
        finalTranscriptRef.current = '';
      }, 500);
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

