interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  gender: string;
  accent: string;
  age: string;
  description: string;
}

interface ElevenLabsTTSRequest {
  text: string;
  voice_id: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

class ElevenLabsTTSService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  
  // High-quality spiritual voices for Christian content
  private spiritualVoices: ElevenLabsVoice[] = [
    {
      voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam - warm male voice
      name: 'Adam',
      category: 'premade',
      gender: 'male',
      accent: 'american',
      age: 'middle aged',
      description: 'Deep, warm voice perfect for spiritual guidance'
    },
    {
      voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella - gentle female voice  
      name: 'Bella',
      category: 'premade',
      gender: 'female',
      accent: 'american',
      age: 'young',
      description: 'Gentle, nurturing voice ideal for Bible reading'
    },
    {
      voice_id: 'VR6AewLTigWG4xSOukaG', // Grace (if available)
      name: 'Grace',
      category: 'premade', 
      gender: 'female',
      accent: 'american',
      age: 'middle aged',
      description: 'Serene, peaceful voice for spiritual reflection'
    }
  ];

  constructor() {
    // Check for ElevenLabs API key in environment
    this.apiKey = process.env.ELEVENLABS_API_KEY || null;
  }

  isAvailable(): boolean {
    return this.apiKey !== null;
  }

  getAvailableVoices(): ElevenLabsVoice[] {
    return this.spiritualVoices;
  }

  async generateSpeech(text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL'): Promise<Buffer | null> {
    if (!this.apiKey) {
      console.log('ElevenLabs API key not available');
      return null;
    }

    try {
      const request: ElevenLabsTTSRequest = {
        text: this.cleanTextForSpeech(text),
        voice_id: voiceId,
        voice_settings: {
          stability: 0.75,        // Higher stability for spiritual content
          similarity_boost: 0.8,  // High similarity to original voice
          style: 0.3,            // Moderate emotional style
          use_speaker_boost: true // Enhance clarity
        }
      };

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        console.error('ElevenLabs API error:', response.status, response.statusText);
        return null;
      }

      const audioBuffer = await response.arrayBuffer();
      return Buffer.from(audioBuffer);
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      return null;
    }
  }

  private cleanTextForSpeech(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')           // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')               // Remove italic markdown  
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // Replace links with text
      .replace(/---/g, '')                       // Remove separator lines
      .replace(/💙/g, '')                        // Remove emojis
      .replace(/\n\s*\n/g, '. ')                 // Replace line breaks with pauses
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2')    // Add proper pauses between sentences
      .trim();
  }

  async getUsageInfo(): Promise<{ character_count: number; character_limit: number } | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'xi-api-key': this.apiKey,
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          character_count: data.subscription?.character_count || 0,
          character_limit: data.subscription?.character_limit || 20000
        };
      }
    } catch (error) {
      console.error('Failed to get ElevenLabs usage:', error);
    }
    
    return null;
  }
}

export const elevenLabsTTS = new ElevenLabsTTSService();
export type { ElevenLabsVoice };