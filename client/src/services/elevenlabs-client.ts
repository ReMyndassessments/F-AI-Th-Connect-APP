import { apiRequest } from "@/lib/queryClient";

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  gender: string;
  accent: string;
  age: string;
  description: string;
}

export interface TTSVoicesResponse {
  available: boolean;
  voices: ElevenLabsVoice[];
  service: string;
}

export interface TTSUsage {
  character_count: number;
  character_limit: number;
}

class ElevenLabsClientService {
  async getAvailableVoices(): Promise<TTSVoicesResponse | null> {
    try {
      const response = await apiRequest('GET', '/api/tts/voices');
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch TTS voices:', error);
      return null;
    }
  }

  async generateSpeech(text: string, voiceId?: string): Promise<string | null> {
    try {
      const response = await apiRequest('POST', '/api/tts/generate', {
        text: text.trim(),
        voiceId: voiceId || 'EXAVITQu4vr4xnSDxMaL' // Default to Bella
      });

      if (!response.ok) {
        const error = await response.json();
        console.warn('TTS generation failed:', error.message);
        return null;
      }

      // Convert audio response to blob URL
      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('TTS generation error:', error);
      return null;
    }
  }

  async getUsageInfo(): Promise<TTSUsage | null> {
    try {
      const response = await apiRequest('GET', '/api/tts/usage');
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch TTS usage:', error);
      return null;
    }
  }

  // Helper to check if text is within limits
  isTextTooLong(text: string): boolean {
    return text.length > 2500;
  }

  // Smart text chunking for long messages
  chunkText(text: string, maxLength: number = 2000): string[] {
    if (text.length <= maxLength) {
      return [text];
    }

    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+\s+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      // If adding this sentence would exceed the limit
      if (currentChunk.length + trimmedSentence.length + 2 > maxLength) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        
        // If a single sentence is too long, split it further
        if (trimmedSentence.length > maxLength) {
          const words = trimmedSentence.split(' ');
          let wordChunk = '';
          
          for (const word of words) {
            if (wordChunk.length + word.length + 1 > maxLength) {
              if (wordChunk.length > 0) {
                chunks.push(wordChunk.trim());
                wordChunk = '';
              }
            }
            wordChunk += (wordChunk ? ' ' : '') + word;
          }
          
          if (wordChunk.length > 0) {
            currentChunk = wordChunk;
          }
        } else {
          currentChunk = trimmedSentence;
        }
      } else {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text.substring(0, maxLength)];
  }

  // Generate speech for chunked text
  async generateChunkedSpeech(text: string, voiceId?: string): Promise<string[]> {
    const chunks = this.chunkText(text);
    const audioUrls: string[] = [];

    for (const chunk of chunks) {
      const audioUrl = await this.generateSpeech(chunk, voiceId);
      if (audioUrl) {
        audioUrls.push(audioUrl);
      }
    }

    return audioUrls;
  }

  // Helper to estimate character usage
  calculateCharacterCount(text: string): number {
    // Clean text similar to server-side cleaning
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/---/g, '')
      .replace(/💙/g, '')
      .trim().length;
  }
}

export const elevenLabsClient = new ElevenLabsClientService();