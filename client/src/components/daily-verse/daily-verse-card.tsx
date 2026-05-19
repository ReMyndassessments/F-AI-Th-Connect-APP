import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calendar, Copy, Share2, Sparkles, Loader2, Pause, Settings } from "lucide-react";
import { getTodaysVerse, getFormattedDate } from "@/lib/daily-verses";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { elevenLabsClient, type ElevenLabsVoice } from "@/services/elevenlabs-client";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailyVerseCardProps {
  variant?: "default" | "compact" | "banner";
  className?: string;
}

export default function DailyVerseCard({ variant = "default", className = "" }: DailyVerseCardProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  // Check feature flags for TTS availability
  const { data: featureFlags } = useQuery({
    queryKey: ['/api/feature-flags/public'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isBibleTTSEnabled = (featureFlags as any)?.flags?.find((f: any) => f.name === 'tts_bible_verses')?.enabled || false;
  const [isSharing, setIsSharing] = useState(false);
  
  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [availableVoices, setAvailableVoices] = useState<ElevenLabsVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('EXAVITQu4vr4xnSDxMaL'); // Bella (default)
  const [isLoadingTTS, setIsLoadingTTS] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  const todaysVerse = getTodaysVerse();
  const todayDate = getFormattedDate();

  // Load available voices on component mount
  useEffect(() => {
    loadAvailableVoices();
    
    // Cleanup audio when component unmounts
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, []);

  const loadAvailableVoices = async () => {
    try {
      console.log('Loading ElevenLabs voices for daily verse...');
      const voicesResponse = await elevenLabsClient.getAvailableVoices();
      console.log('Voices response:', voicesResponse);
      if (voicesResponse && voicesResponse.available && Array.isArray(voicesResponse.voices)) {
        setAvailableVoices(voicesResponse.voices);
        console.log('Voices loaded successfully:', voicesResponse.voices.length);
      } else {
        console.warn('No voices available or invalid response:', voicesResponse);
      }
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const handleCopyVerse = async () => {
    const verseText = `"${todaysVerse.text}" - ${todaysVerse.reference}`;
    try {
      await navigator.clipboard.writeText(verseText);
      toast({
        title: t.dailyVerse.verseCopied,
        description: t.dailyVerse.verseCopiedDesc,
      });
    } catch (error) {
      toast({
        title: t.dailyVerse.copyFailed,
        description: t.dailyVerse.copyFailedDesc,
        variant: "destructive",
      });
    }
  };

  const handleShareVerse = async () => {
    const verseText = `Today's Memory Verse: "${todaysVerse.text}" - ${todaysVerse.reference}`;
    
    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: "Daily Memory Verse",
          text: verseText,
          url: window.location.origin,
        });
      } catch (error) {
        // User cancelled sharing
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback to clipboard
      await handleCopyVerse();
    }
  };

  const handleTTSToggle = async () => {
    if (isPlaying && currentAudio) {
      // Stop current playback
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoadingTTS(true);
      
      // Clean text for TTS (remove quotes and format nicely)
      const cleanText = (todaysVerse.text || '').replace(/^"|"$/g, '');
      const fullText = `Today's Memory Verse: ${cleanText}. ${todaysVerse.reference || ''}`;
      
      console.log('Generating TTS for daily verse:', fullText);
      console.log('Using voice ID:', selectedVoice);
      const audioUrl = await elevenLabsClient.generateSpeech(fullText, selectedVoice);
      console.log('TTS generation result:', audioUrl ? 'success' : 'failed');
      
      if (!audioUrl) {
        console.error('TTS generation failed - no audio URL returned');
        toast({
          title: "Voice Generation Failed",
          description: "Check your internet connection and try again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Audio URL generated successfully, preparing playback...');
      
      const audio = new Audio(audioUrl);
      
      // Mobile compatibility settings
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      
      audio.onplay = () => {
        console.log('Audio playback started');
        setIsPlaying(true);
      };
      audio.onpause = () => {
        console.log('Audio playback paused');
        setIsPlaying(false);
      };
      audio.onended = () => {
        console.log('Audio playback ended');
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Playback Error",
          description: "Unable to play audio on this device. Try using headphones or check your volume settings.",
          variant: "destructive",
        });
      };
      
      // Test if audio can be loaded
      audio.oncanplaythrough = () => {
        console.log('Audio ready to play');
      };
      
      audio.onloadstart = () => {
        console.log('Audio loading started');
      };

      setCurrentAudio(audio);
      
      // Add extra checks for mobile playback
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (playError) {
        console.error('Play promise rejected:', playError);
        toast({
          title: "Playback Blocked",
          description: "Audio playback was blocked. Please try tapping the button again.",
          variant: "destructive",
        });
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      }
    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        title: "Voice Generation Failed", 
        description: error instanceof Error ? error.message : "Network or audio error. Check connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTTS(false);
    }
  };

  if (variant === "compact") {
    return (
      <Card className={`border-blue-100 bg-gradient-to-r from-blue-50 to-amber-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs bg-white border-blue-200 text-blue-700">
                  {t.dailyVerse.title}
                </Badge>
              </div>
              <blockquote className="text-sm text-gray-700 italic mb-2 line-clamp-2">
                "{todaysVerse.text}"
              </blockquote>
              <p className="text-xs font-medium text-blue-600">
                {todaysVerse.reference}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-amber-600 text-white py-8 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">{todayDate}</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">{t.dailyVerse.title}</h3>
          <blockquote className="text-lg md:text-xl italic mb-4 max-w-3xl mx-auto">
            "{todaysVerse.text}"
          </blockquote>
          <p className="text-base font-medium mb-4">
            {todaysVerse.reference}
          </p>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {todaysVerse.theme}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-blue-100 bg-gradient-to-br from-blue-50 via-white to-amber-50 ${className}`}>
      <CardContent className="p-4 sm:p-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t.dailyVerse.title}</h3>
              <p className="text-sm text-gray-600">{todayDate}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 text-xs sm:text-sm self-start sm:self-auto">
            {todaysVerse.theme}
          </Badge>
        </div>

        {/* Verse Text - Mobile Enhanced */}
        <blockquote className="text-gray-700 text-base sm:text-lg italic mb-4 leading-relaxed px-2 sm:px-0">
          "{todaysVerse.text}"
        </blockquote>

        {/* Reference and Actions - Mobile Stack */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm sm:text-base font-semibold text-blue-600 text-center sm:text-left">
            {todaysVerse.reference}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:space-x-2 sm:gap-0">
            {/* TTS Controls - Mobile Enhanced */}
            {isBibleTTSEnabled && (
              <>
                {/* Voice Settings - Mobile Optimized */}
                {availableVoices.length > 0 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="p-2 h-9 w-9 sm:p-1 sm:h-8 sm:w-8 touch-target mobile-tap"
                >
                  <Settings className="h-4 w-4 sm:h-3 sm:w-3" />
                </Button>
                
                {showVoiceSettings && (
                  <div className="absolute right-0 bottom-12 sm:bottom-10 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
                    <p className="text-xs font-medium text-gray-700 mb-2">{t.dailyVerse.premiumVoice}</p>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="w-full h-9 sm:h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVoices.map((voice) => (
                          <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {voice.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
            
            {/* Listen Button - Mobile Enhanced */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleTTSToggle}
              disabled={isLoadingTTS}
              className="border-purple-200 text-purple-600 hover:bg-purple-50 h-9 sm:h-8 px-3 sm:px-2 text-xs sm:text-sm touch-target mobile-tap"
            >
              {isLoadingTTS ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 mr-1" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1" />
              )}
              <span className="hidden sm:inline">{isLoadingTTS ? t.dailyVerse.loading : isPlaying ? t.dailyVerse.pause : t.dailyVerse.listen}</span>
              <span className="sm:hidden">{isLoadingTTS ? '...' : isPlaying ? '⏸️' : '🔊'}</span>
            </Button>
              </>
            )}
            
            {/* Copy Button - Mobile Enhanced */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyVerse}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 h-9 sm:h-8 px-3 sm:px-2 text-xs sm:text-sm touch-target mobile-tap"
            >
              <Copy className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{t.dailyVerse.copy}</span>
              <span className="sm:hidden">📋</span>
            </Button>
            
            {/* Share Button - Mobile Enhanced */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareVerse}
              disabled={isSharing}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 h-9 sm:h-8 px-3 sm:px-2 text-xs sm:text-sm touch-target mobile-tap"
            >
              <Share2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{t.dailyVerse.share}</span>
              <span className="sm:hidden">📤</span>
            </Button>
          </div>
        </div>

        {/* Footer - Mobile Optimized */}
        <div className="mt-4 pt-4 border-t border-blue-100">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            {t.dailyVerse.footer}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}