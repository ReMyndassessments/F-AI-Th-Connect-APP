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
        recognitionRef.current.continuous = false; // Single session, manual control
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event: any) => {
          console.log('Speech recognition result:', event);
          
          // Get the latest transcript
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');

          console.log('Current transcript:', transcript);
          
          // Combine with any accumulated text
          const fullTranscript = accumulatedText + transcript;
          
          // Always show current text in input field
          onTranscription(fullTranscript, false);
          
          // If final result, add to accumulated text for next session
          const isFinal = event.results[event.results.length - 1].isFinal;
          if (isFinal && transcript.trim()) {
            setAccumulatedText(prev => prev + transcript + ' ');
            console.log('Added to accumulated text:', transcript);
          }
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
          console.log('Speech recognition ended, isListening:', isListening);
          
          // Auto-restart if still in listening mode
          if (isListening) {
            try {
              console.log('Auto-restarting speech recognition');
              restartTimeoutRef.current = setTimeout(() => {
                if (isListening && recognitionRef.current) {
                  try {
                    recognitionRef.current.start();
                  } catch (restartError) {
                    console.log('Restart failed, stopping:', restartError);
                    setIsListening(false);
                    
                    // Send whatever we have accumulated
                    const finalMessage = accumulatedText.trim();
                    if (finalMessage) {
                      onTranscription(finalMessage, true);
                      toast({
                        title: "Message Sent",
                        description: "Your message has been sent to the AI.",
                      });
                      setAccumulatedText('');
                    }
                  }
                }
              }, 300);
            } catch (error) {
              console.log('Could not setup restart:', error);
              setIsListening(false);
            }
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
    console.log('Attempting to start listening, isSupported:', isSupported, 'recognitionRef:', recognitionRef.current);
    if (recognitionRef.current && !isListening) {
      try {
        setAccumulatedText(''); // Reset accumulated text
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "Recording Started",
          description: "Speak now. Click the red microphone to stop and send your message.",
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

