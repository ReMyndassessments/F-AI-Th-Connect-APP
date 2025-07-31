import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, ArrowLeft, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { elevenLabsClient, type ElevenLabsVoice } from '@/services/elevenlabs-client';

export default function VoiceTest() {
  const [elevenLabsVoices, setElevenLabsVoices] = useState<ElevenLabsVoice[]>([]);
  const [elevenLabsAvailable, setElevenLabsAvailable] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const testText = "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.";

  useEffect(() => {
    const loadElevenLabsVoices = async () => {
      try {
        const voicesData = await elevenLabsClient.getAvailableVoices();
        if (voicesData && voicesData.available) {
          setElevenLabsAvailable(true);
          setElevenLabsVoices(voicesData.voices);
        } else {
          setElevenLabsAvailable(false);
          toast({
            title: "ElevenLabs Unavailable",
            description: "Could not connect to ElevenLabs API. Check your API key.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Failed to load ElevenLabs voices:', error);
        setElevenLabsAvailable(false);
        toast({
          title: "API Error", 
          description: "Failed to load ElevenLabs voices. Check your connection.",
          variant: "destructive",
        });
      }
    };

    loadElevenLabsVoices();
  }, [toast]);

  const playVoice = async (voiceId: string, voiceName: string) => {
    if (isGenerating === voiceId || isPlaying === voiceId) {
      stopAudio();
      return;
    }

    try {
      setIsGenerating(voiceId);
      
      const newAudioUrl = await elevenLabsClient.generateSpeech(testText, voiceId);
      
      if (!newAudioUrl) {
        toast({
          title: "Generation Failed",
          description: `Could not generate audio for ${voiceName}`,
          variant: "destructive",
        });
        return;
      }

      // Clean up previous audio
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(newAudioUrl);

      // Play the audio
      const audio = new Audio(newAudioUrl);
      audio.playbackRate = 0.75; // Slower for contemplation
      
      audio.onplay = () => {
        setIsPlaying(voiceId);
        setIsGenerating(null);
      };

      audio.onended = () => {
        setIsPlaying(null);
        URL.revokeObjectURL(newAudioUrl);
        setAudioUrl(null);
      };

      audio.onerror = () => {
        setIsPlaying(null);
        setIsGenerating(null);
        toast({
          title: "Playback Error",
          description: `Could not play audio for ${voiceName}`,
          variant: "destructive",
        });
      };

      await audio.play();
      
    } catch (error) {
      console.error('Voice test error:', error);
      toast({
        title: "Voice Test Failed",
        description: `Error testing ${voiceName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const stopAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setIsPlaying(null);
    setIsGenerating(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ElevenLabs Voice Test</h1>
            <p className="text-gray-600">Test premium AI voices for spiritual content</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/api-diagnostics">
              <Button variant="secondary" className="flex items-center space-x-2">
                <VolumeX className="w-4 h-4" />
                <span>Troubleshoot API</span>
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Chat</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Test Text */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Test Scripture (John 14:27)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic text-gray-700 leading-relaxed">
              "{testText}"
            </p>
          </CardContent>
        </Card>

        {/* Voice Grid */}
        {!elevenLabsAvailable ? (
          <Card>
            <CardContent className="text-center py-12">
              <VolumeX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ElevenLabs Unavailable</h3>
              <p className="text-gray-600">
                Could not connect to ElevenLabs API. Please check your API key and internet connection.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elevenLabsVoices.map((voice) => (
              <Card key={voice.voice_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{voice.name}</span>
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Premium</span>
                    </Badge>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{voice.gender}</Badge>
                    <Badge variant="outline">{voice.accent}</Badge>
                    <Badge variant="outline">{voice.age}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{voice.description}</p>
                  
                  <Button
                    onClick={() => playVoice(voice.voice_id, voice.name)}
                    disabled={isGenerating !== null && isGenerating !== voice.voice_id}
                    className="w-full"
                    variant={isPlaying === voice.voice_id ? "destructive" : "default"}
                  >
                    {isGenerating === voice.voice_id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : isPlaying === voice.voice_id ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Playing
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Test Voice
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Usage Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About ElevenLabs Premium Voices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Free Tier Benefits</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 10,000 characters per month</li>
                  <li>• Natural, human-like voices</li>
                  <li>• Perfect for spiritual content</li>
                  <li>• High-quality audio generation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Voice Characteristics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Warm, spiritual tones</li>
                  <li>• Contemplative 0.75x speed</li>
                  <li>• Multiple accents available</li>
                  <li>• Optimized for Bible reading</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}