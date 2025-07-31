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

interface DailyVerseCardProps {
  variant?: "default" | "compact" | "banner";
  className?: string;
}

export default function DailyVerseCard({ variant = "default", className = "" }: DailyVerseCardProps) {
  const { toast } = useToast();

  // Check feature flags for TTS availability
  const { data: featureFlags } = useQuery({
    queryKey: ['/api/feature-flags/public'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isBibleTTSEnabled = featureFlags?.flags?.find((f: any) => f.name === 'tts_bible_verses')?.enabled || false;
  const [isSharing, setIsSharing] = useState(false);
  
  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [availableVoices, setAvailableVoices] = useState<ElevenLabsVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('pNInz6obpgDQGcFmaJgB'); // Bella (default)
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
      const voices = await elevenLabsClient.getAvailableVoices();
      if (voices && Array.isArray(voices)) {
        setAvailableVoices(voices);
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
        title: "Verse copied!",
        description: "Today's memory verse has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy verse to clipboard.",
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
      
      const audioUrl = await elevenLabsClient.generateSpeech(fullText, selectedVoice);
      const audio = new Audio(audioUrl);
      
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Playback Error",
          description: "Unable to play audio. Please try again.",
          variant: "destructive",
        });
      };

      setCurrentAudio(audio);
      await audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        title: "Voice Generation Failed",
        description: "Unable to generate speech. Please try again.",
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
                  Today's Verse
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
          <h3 className="text-xl font-semibold mb-4">Today's Memory Verse</h3>
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
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Memory Verse</h3>
              <p className="text-sm text-gray-600">{todayDate}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
            {todaysVerse.theme}
          </Badge>
        </div>

        <blockquote className="text-gray-700 text-lg italic mb-4 leading-relaxed">
          "{todaysVerse.text}"
        </blockquote>

        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-blue-600">
            {todaysVerse.reference}
          </p>
          <div className="flex space-x-2">
            {/* TTS Controls - Only show if feature flag enabled */}
            {isBibleTTSEnabled && (
              <>
                {/* Voice Settings */}
                {availableVoices.length > 0 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="p-1 h-8 w-8"
                >
                  <Settings className="h-3 w-3" />
                </Button>
                
                {showVoiceSettings && (
                  <div className="absolute right-0 bottom-10 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
                    <p className="text-xs font-medium text-gray-700 mb-2">Premium Voice:</p>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="w-full h-8 text-xs">
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
            
            {/* Listen Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleTTSToggle}
              disabled={isLoadingTTS}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              {isLoadingTTS ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 mr-1" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1" />
              )}
              {isLoadingTTS ? 'Loading...' : isPlaying ? 'Pause' : 'Listen'}
            </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyVerse}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareVerse}
              disabled={isSharing}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-100">
          <p className="text-xs text-gray-500 text-center">
            Memory verses change daily • Meditate on God's Word
          </p>
        </div>
      </CardContent>
    </Card>
  );
}