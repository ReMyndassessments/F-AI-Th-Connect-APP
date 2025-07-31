import { useState, useEffect } from "react";
import type { Message } from "@/lib/chat-api";
import ScriptureReference from "@/components/chat/scripture-reference";
import MessageActions from "@/components/chat/message-actions";
import TextHighlighter from "@/components/chat/text-highlighter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Volume2, VolumeX, Pause, Play, Settings, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { elevenLabsClient, type ElevenLabsVoice } from "@/services/elevenlabs-client";

interface MessageBubbleProps {
  message: Message;
}

// Text-to-speech state management
let currentSpeechUtterance: SpeechSynthesisUtterance | null = null;
let speechState = {
  isSpeaking: false,
  isPaused: false,
  currentMessageId: null as number | null
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const scriptureReferences = message.scriptureReferences ? 
    (typeof message.scriptureReferences === 'string' ? 
      JSON.parse(message.scriptureReferences) : 
      message.scriptureReferences) : [];

  // Text-to-speech state for this message
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // ElevenLabs TTS state
  const [elevenLabsVoices, setElevenLabsVoices] = useState<ElevenLabsVoice[]>([]);
  const [elevenLabsAvailable, setElevenLabsAvailable] = useState(false);
  const [selectedElevenLabsVoice, setSelectedElevenLabsVoice] = useState<string>('EXAVITQu4vr4xnSDxMaL'); // Default to Bella
  const [usePremiumTTS, setUsePremiumTTS] = useState(true); // Default to premium only
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Load voices and check speech support
  useEffect(() => {
    const speechSupported = 'speechSynthesis' in window;
    setSpeechSupported(speechSupported);
    
    if (speechSupported) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Filter to high-quality English voices suitable for spiritual content
        const allowedVoices = voices.filter(voice => 
          voice.lang.startsWith('en') && (
            // Premium voices
            voice.name.includes('Google') ||
            voice.name.includes('Microsoft') ||
            voice.name.includes('Amazon') ||
            voice.name.includes('Apple') ||
            // Natural-sounding system voices
            voice.name.includes('Natural') ||
            voice.name.includes('Neural') ||
            voice.name.includes('Premium') ||
            // Common high-quality voices
            voice.name === 'Samantha' ||
            voice.name === 'Alex' ||
            voice.name === 'Victoria' ||
            voice.name === 'Daniel' ||
            voice.name === 'Karen' ||
            voice.name === 'Moira' ||
            voice.name === 'Tessa' ||
            voice.name === 'Veena' ||
            voice.name === 'Fiona' ||
            voice.name === 'Susan'
          )
        );
        
        setAvailableVoices(allowedVoices);
        
        // Prefer high-quality female voices for spiritual content
        const preferredVoice = allowedVoices.find(voice => 
          voice.name === 'Google UK English Female'
        ) || allowedVoices.find(voice => 
          voice.name === 'Samantha'
        ) || allowedVoices.find(voice => 
          voice.name === 'Victoria'
        ) || allowedVoices.find(voice => 
          voice.name === 'Karen'
        ) || allowedVoices.find(voice => 
          voice.name.includes('Female') || voice.name.includes('Woman')
        ) || allowedVoices[0];
        
        if (preferredVoice) {
          setSelectedVoice(preferredVoice);
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Load ElevenLabs voices
    const loadElevenLabsVoices = async () => {
      try {
        const voicesData = await elevenLabsClient.getAvailableVoices();
        if (voicesData && voicesData.available) {
          setElevenLabsAvailable(true);
          setElevenLabsVoices(voicesData.voices);
          // Default to Bella (gentle female voice)
          setSelectedElevenLabsVoice('EXAVITQu4vr4xnSDxMaL');
        } else {
          setElevenLabsAvailable(false);
        }
      } catch (error) {
        console.error('Failed to load ElevenLabs voices:', error);
        setElevenLabsAvailable(false);
      }
    };

    loadElevenLabsVoices();
  }, []);

  // Monitor global speech state
  useEffect(() => {
    const checkSpeechState = () => {
      if (speechState.currentMessageId === message.id) {
        setIsSpeaking(speechState.isSpeaking);
        setIsPaused(speechState.isPaused);
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    };

    const interval = setInterval(checkSpeechState, 100);
    return () => clearInterval(interval);
  }, [message.id]);

  // Text-to-speech functions
  const speakMessage = async () => {
    // Use premium TTS only as requested
    if (elevenLabsAvailable) {
      await speakWithElevenLabs();
      return;
    }

    // Show error if premium TTS not available
    toast({
      title: "Premium TTS unavailable",
      description: "ElevenLabs voices are not available. Please check your connection.",
      variant: "destructive",
    });
  };

  const pauseSpeech = () => {
    // Premium TTS pause handled by audio element
  };

  const resumeSpeech = () => {
    // Premium TTS resume handled by audio element
  };

  const stopSpeech = () => {
    // Stop premium TTS if playing
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    // Reset speech state
    speechState.isSpeaking = false;
    speechState.isPaused = false;
    speechState.currentMessageId = null;
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Play chunked audio sequentially
  const playChunkedAudio = async (audioUrls: string[]) => {
    if (audioUrls.length === 0) return;

    speechState.isSpeaking = true;
    speechState.isPaused = false;
    speechState.currentMessageId = message.id;
    setIsSpeaking(true);
    setIsPaused(false);

    for (let i = 0; i < audioUrls.length; i++) {
      const audioUrl = audioUrls[i];
      
      try {
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(audioUrl);
          audio.playbackRate = 1.0;

          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve();
          };

          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            reject(new Error('Audio playback failed'));
          };

          audio.play().catch(reject);
        });

        // Check if speech was stopped while playing
        if (!speechState.isSpeaking || speechState.currentMessageId !== message.id) {
          // Clean up remaining audio URLs
          for (let j = i + 1; j < audioUrls.length; j++) {
            URL.revokeObjectURL(audioUrls[j]);
          }
          break;
        }
      } catch (error) {
        console.error('Error playing audio chunk:', error);
        // Clean up remaining audio URLs
        for (let j = i + 1; j < audioUrls.length; j++) {
          URL.revokeObjectURL(audioUrls[j]);
        }
        break;
      }
    }

    // Reset state when finished
    speechState.isSpeaking = false;
    speechState.isPaused = false;
    speechState.currentMessageId = null;
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Premium TTS with ElevenLabs
  const speakWithElevenLabs = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      
      // Clean the message content
      const cleanText = message.content
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/---/g, '')
        .replace(/💙/g, '')
        .trim();

      // For long text, use chunked speech generation
      if (elevenLabsClient.isTextTooLong(cleanText)) {
        toast({
          title: "Processing long message",
          description: "Generating speech in segments for better quality...",
          variant: "default",
        });

        const audioUrls = await elevenLabsClient.generateChunkedSpeech(cleanText, selectedElevenLabsVoice);
        
        if (audioUrls.length === 0) {
          toast({
            title: "Premium TTS unavailable",
            description: "Unable to generate speech. Please check your connection.",
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }

        toast({
          title: "Ready to play",
          description: `Generated ${audioUrls.length} audio segments. Starting playback...`,
          variant: "default",
        });

        // Play chunked audio sequentially
        await playChunkedAudio(audioUrls);
        setIsGenerating(false);
        return;
      }

      // Generate audio with ElevenLabs for normal length text
      const newAudioUrl = await elevenLabsClient.generateSpeech(cleanText, selectedElevenLabsVoice);
      
      if (!newAudioUrl) {
        toast({
          title: "Premium TTS unavailable",
          description: "Unable to generate speech. Please check your connection.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Clean up previous audio
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(newAudioUrl);

      // Play the audio
      const audio = new Audio(newAudioUrl);
      audio.playbackRate = 1.0; // Regular speed as requested
      
      audio.onplay = () => {
        speechState.isSpeaking = true;
        speechState.isPaused = false;
        speechState.currentMessageId = message.id;
        setIsSpeaking(true);
        setIsPaused(false);
      };

      audio.onpause = () => {
        speechState.isPaused = true;
        speechState.isSpeaking = false;
        setIsPaused(true);
        setIsSpeaking(false);
      };

      audio.onended = () => {
        speechState.isSpeaking = false;
        speechState.isPaused = false;
        speechState.currentMessageId = null;
        setIsSpeaking(false);
        setIsPaused(false);
        URL.revokeObjectURL(newAudioUrl);
        setAudioUrl(null);
      };

      await audio.play();
      
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      toast({
        title: "Premium TTS failed",
        description: "Falling back to browser TTS",
        variant: "destructive",
      });
      // No fallback - premium only as requested
    } finally {
      setIsGenerating(false);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end group">
        <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-3 sm:px-4 py-2 sm:py-3 max-w-[280px] sm:max-w-xs lg:max-w-md">
          <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{message.content}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-blue-100">
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
            <MessageActions 
              content={message.content} 
              messageId={message.id}
              isAiMessage={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-2 sm:space-x-3 group">
      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-semibold text-xs sm:text-sm">AI</span>
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 sm:px-4 py-2 sm:py-3 max-w-[280px] sm:max-w-md lg:max-w-lg">
        <TextHighlighter content={message.content} messageId={message.id} sessionId={message.sessionId} />
        
        {scriptureReferences.length > 0 && (
          <div className="space-y-2 mt-3">
            {scriptureReferences.map((ref: any, index: number) => (
              <ScriptureReference key={index} reference={ref} />
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            F-AI-TH-Connect • {new Date(message.timestamp).toLocaleTimeString()}
          </p>
          
          {/* Audio Controls for AI Messages - Premium Only */}
          {elevenLabsAvailable && (
            <div className="flex items-center space-x-1">
              {/* Voice Selector - Premium voices only */}
              {elevenLabsVoices.length > 0 && (
                <Select 
                  value={selectedElevenLabsVoice} 
                  onValueChange={setSelectedElevenLabsVoice}
                >
                  <SelectTrigger className="w-20 h-6 text-xs">
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5 text-yellow-500" />
                      <span className="hidden sm:inline text-xs">Voice</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {elevenLabsVoices.map((voice) => (
                      <SelectItem key={voice.voice_id} value={voice.voice_id}>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{voice.name}</span>
                          <span className="text-xs text-gray-500">
                            {voice.gender} • {voice.accent} • Premium
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {!isSpeaking && !isGenerating ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={speakMessage}
                  className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  title="Listen with premium voice"
                >
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <span className="hidden sm:inline text-xs ml-1">Listen</span>
                </Button>
              ) : isGenerating ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="h-6 px-2 text-yellow-600"
                  title="Generating premium audio..."
                >
                  <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline text-xs ml-1">Generating...</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-1">
                  {isPaused ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resumeSpeech}
                      className="h-6 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                      title="Resume"
                    >
                      <Play className="w-3 h-3" />
                      <span className="hidden sm:inline text-xs ml-1">Resume</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={pauseSpeech}
                      className="h-6 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      title="Pause"
                    >
                      <Pause className="w-3 h-3" />
                      <span className="hidden sm:inline text-xs ml-1">Pause</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stopSpeech}
                    className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Stop"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span className="hidden sm:inline text-xs ml-1">Stop</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <MessageActions 
          content={message.content} 
          messageId={message.id}
          isAiMessage={true}
        />
      </div>
    </div>
  );
}
