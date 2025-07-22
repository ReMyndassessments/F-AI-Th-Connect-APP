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
        recognitionRef.current.continuous = false; // Short sessions work better
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
          console.log('Speech recognition session ended, still recording:', isRecording);
          
          // Auto-restart if still in recording mode
          if (isRecording && recognitionRef.current) {
            restartTimeoutRef.current = setTimeout(() => {
              if (isRecording && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                  console.log('Restarted session', sessionCountRef.current + 1);
                } catch (error) {
                  console.log('Failed to restart:', error);
                  setIsRecording(false);
                  setIsListening(false);
                }
              }
            }, 100);
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
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [onTranscription, toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        // Reset everything for new recording
        finalTranscriptRef.current = '';
        sessionCountRef.current = 0;
        onTranscription('', false);
        
        // Start recording mode
        setIsRecording(true);
        setIsListening(true);
        recognitionRef.current.start();
        
        toast({
          title: "Recording Started",
          description: "Keep talking! The system will capture everything. Click again to stop and send.",
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
    if (isListening) {
      // Stop recording mode first
      setIsRecording(false);
      setIsListening(false);
      
      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      
      // Stop current recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      // Send accumulated message after brief delay
      setTimeout(() => {
        const finalMessage = finalTranscriptRef.current.trim();
        if (finalMessage) {
          onTranscription(finalMessage, true);
          toast({
            title: "Message Sent",
            description: `Captured ${sessionCountRef.current} speech segments. Message sent to AI.`,
          });
        } else {
          toast({
            title: "No Speech Detected",
            description: "Please try speaking louder or closer to the microphone.",
            variant: "destructive",
          });
        }
        
        // Reset for next session
        finalTranscriptRef.current = '';
        sessionCountRef.current = 0;
      }, 300);
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

