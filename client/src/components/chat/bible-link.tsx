import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Book, ExternalLink, Copy, Loader2, Sparkles, Volume2, VolumeX, Pause, Play, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { elevenLabsClient, type ElevenLabsVoice } from "@/services/elevenlabs-client";

interface BibleLinkProps {
  reference: string;
  children: React.ReactNode;
  className?: string;
}

interface VerseData {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: string;
  version?: string;
}

// Bible versions available for comparison - using API.Bible public domain translations
const BIBLE_VERSIONS = [
  { value: 'kjv', label: 'King James Version (KJV)' },
  { value: 'web', label: 'World English Bible (WEB)' },
  { value: 'asv', label: 'American Standard Version (ASV)' }
];

// Sample verse data - in production this could come from a Bible API
const SAMPLE_VERSES: Record<string, VerseData> = {
  "John 3:16": {
    reference: "John 3:16",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    book: "John",
    chapter: 3,
    verse: "16"
  },
  "Romans 8:28": {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    book: "Romans",
    chapter: 8,
    verse: "28"
  },
  "Philippians 4:13": {
    reference: "Philippians 4:13",
    text: "I can do all this through him who gives me strength.",
    book: "Philippians",
    chapter: 4,
    verse: "13"
  },
  "Jeremiah 29:11": {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    book: "Jeremiah",
    chapter: 29,
    verse: "11"
  },
  "Psalm 23:1": {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd, I lack nothing.",
    book: "Psalm",
    chapter: 23,
    verse: "1"
  },
  "Matthew 28:19": {
    reference: "Matthew 28:19",
    text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
    book: "Matthew",
    chapter: 28,
    verse: "19"
  },
  "1 Corinthians 13:4": {
    reference: "1 Corinthians 13:4",
    text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
    book: "1 Corinthians",
    chapter: 13,
    verse: "4"
  },
  "Joshua 1:9": {
    reference: "Joshua 1:9",
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    book: "Joshua",
    chapter: 1,
    verse: "9"
  }
};

export default function BibleLink({ reference, children, className = "" }: BibleLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [comparisonVersion, setComparisonVersion] = useState('niv');
  const [comparisonVerse, setComparisonVerse] = useState<VerseData | null>(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);
  
  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [availableVoices, setAvailableVoices] = useState<ElevenLabsVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('pNInz6obpgDQGcFmaJgB'); // Bella (default)
  const [isLoadingTTS, setIsLoadingTTS] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  const { toast } = useToast();

  // Check feature flags for TTS availability
  const { data: featureFlags } = useQuery({
    queryKey: ['/api/feature-flags/public'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isBibleTTSEnabled = featureFlags?.flags?.find((f: any) => f.name === 'tts_bible_verses')?.enabled || false;

  // Fetch verse data when dialog opens
  useEffect(() => {
    if (isOpen && !verseData && !isLoading) {
      fetchVerseData();
    }
  }, [isOpen, reference]);

  // Load available voices when dialog opens
  useEffect(() => {
    if (isOpen && availableVoices.length === 0) {
      loadAvailableVoices();
    }
  }, [isOpen]);

  // Cleanup audio when component unmounts or dialog closes
  useEffect(() => {
    if (!isOpen && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    }
  }, [isOpen, currentAudio]);

  const fetchVerseData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try the live API
      const response = await apiRequest('GET', `/api/bible/verse/${encodeURIComponent(reference)}`);
      const data = await response.json();
      
      if (response.ok) {
        setVerseData(data);
      } else {
        // Fallback to sample verses
        const fallback = SAMPLE_VERSES[reference];
        if (fallback) {
          setVerseData(fallback);
        } else {
          setError(data.message || 'Verse not found');
        }
      }
    } catch (err) {
      // Try fallback verses first
      const fallback = SAMPLE_VERSES[reference];
      if (fallback) {
        setVerseData(fallback);
      } else {
        setError('Unable to load verse at this time');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleCopyVerse = async () => {
    if (verseData) {
      const textToCopy = `"${verseData.text}" - ${verseData.reference}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: "Verse copied",
          description: "Bible verse has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Unable to copy verse to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const fetchComparisonVerse = async (version: string) => {
    if (!verseData || version === verseData.version) return;
    
    setIsLoadingComparison(true);
    try {
      const response = await apiRequest('GET', `/api/bible/verse/${encodeURIComponent(reference)}?version=${version}`);
      const data = await response.json();
      
      if (response.ok) {
        setComparisonVerse(data);
      } else {
        // Could add fallback logic here if needed
        setComparisonVerse(null);
      }
    } catch (err) {
      setComparisonVerse(null);
    } finally {
      setIsLoadingComparison(false);
    }
  };

  const handleVersionChange = (version: string) => {
    setComparisonVersion(version);
    if (showVersionComparison && verseData) {
      fetchComparisonVerse(version);
    }
  };

  const toggleVersionComparison = () => {
    const newState = !showVersionComparison;
    setShowVersionComparison(newState);
    if (newState && verseData && comparisonVersion !== verseData.version) {
      fetchComparisonVerse(comparisonVersion);
    }
  };

  const openBibleGateway = () => {
    const searchQuery = encodeURIComponent(reference);
    const url = `https://www.biblegateway.com/passage/?search=${searchQuery}&version=NIV`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const loadAvailableVoices = async () => {
    try {
      const voices = await elevenLabsClient.getAvailableVoices();
      setAvailableVoices(voices);
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const handleTTSToggle = async (text: string, verseRef: string) => {
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
      const cleanText = text.replace(/^"|"$/g, '');
      const fullText = `${cleanText}. ${verseRef}`;
      
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

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 underline decoration-1 underline-offset-2 transition-colors ${className}`}
        title={`Click to view ${reference}`}
      >
        <Book className="w-3 h-3 flex-shrink-0" />
        <span>{children}</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 pr-12">
              <Book className="w-5 h-5 text-blue-600" />
              <span>{reference}</span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Bible verse lookup dialog showing {reference} with version comparison options
            </DialogDescription>
          </DialogHeader>
          
          {/* Version Comparison Toggle - Positioned to avoid close button */}
          {verseData && (
            <div className="flex justify-start mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVersionComparison}
                className="flex items-center gap-1 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Book className="h-3 w-3" />
                {showVersionComparison ? 'Hide' : 'Compare'} Versions
              </Button>
            </div>
          )}
          
          {/* Version Comparison Selector */}
          {showVersionComparison && verseData && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Compare with:
                </span>
                <Select value={comparisonVersion} onValueChange={handleVersionChange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select version to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    {BIBLE_VERSIONS.filter(v => v.value !== verseData?.version).map((version) => (
                      <SelectItem key={version.value} value={version.value}>
                        {version.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
                <p className="text-gray-600">Loading verse...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">{error}</p>
                <Button
                  onClick={openBibleGateway}
                  className="faith-button-primary"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read {reference} on Bible Gateway
                </Button>
              </div>
            ) : verseData ? (
              <>
                {/* Original Version */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="default" className="bg-blue-600 text-white">
                      {verseData.version || 'KJV'}
                    </Badge>
                    
                    {/* Voice Controls for Original Verse - Only show if feature flag enabled */}
                    {isBibleTTSEnabled && (
                      <div className="flex items-center space-x-2">
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
                            <div className="absolute right-0 top-10 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
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
                        onClick={() => handleTTSToggle(verseData.text, verseData.reference)}
                        disabled={isLoadingTTS}
                        className="flex items-center space-x-1 border-purple-300 text-purple-700 hover:bg-purple-50 h-8 px-2"
                      >
                        {isLoadingTTS ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        <span className="text-xs">
                          {isLoadingTTS ? 'Loading...' : isPlaying ? 'Pause' : 'Listen'}
                        </span>
                      </Button>
                      </div>
                    )}
                  </div>
                  <blockquote className="text-gray-800 italic leading-relaxed border-l-4 border-blue-500 pl-4 mb-3">
                    "{verseData.text}"
                  </blockquote>
                  <p className="text-sm text-gray-600 font-medium">
                    {verseData.reference} - {verseData.version || 'KJV'}
                  </p>
                </div>

                {/* Comparison Version */}
                {showVersionComparison && comparisonVerse && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="default" className="bg-green-600 text-white">
                        {comparisonVerse.version}
                      </Badge>
                      
                      {/* Voice Controls for Comparison Verse - Only show if feature flag enabled */}
                      {isBibleTTSEnabled && (
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTTSToggle(comparisonVerse.text, `${comparisonVerse.reference} ${comparisonVerse.version}`)}
                        disabled={isLoadingTTS}
                        className="flex items-center space-x-1 border-purple-300 text-purple-700 hover:bg-purple-50 h-8 px-2"
                      >
                        {isLoadingTTS ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        <span className="text-xs">
                          {isLoadingTTS ? 'Loading...' : isPlaying ? 'Pause' : 'Listen'}
                        </span>
                        </Button>
                      )}
                    </div>
                    <blockquote className="text-gray-800 italic leading-relaxed border-l-4 border-green-500 pl-4 mb-3">
                      "{comparisonVerse.text}"
                    </blockquote>
                    <p className="text-sm text-gray-600 font-medium">
                      {comparisonVerse.reference} - {comparisonVerse.version}
                    </p>
                  </div>
                )}

                {/* Loading state for comparison */}
                {showVersionComparison && isLoadingComparison && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2 text-green-600" />
                      <span className="text-green-700">Loading comparison verse...</span>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={handleCopyVerse}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Verse
                  </Button>
                  
                  <Button
                    onClick={openBibleGateway}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read More
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}