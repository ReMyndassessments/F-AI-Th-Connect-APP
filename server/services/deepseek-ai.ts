interface DeepseekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ScriptureReference {
  verse: string;
  book: string;
  chapter: number;
  verses: string;
  text: string;
}

export class DeepseekAI {
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com/v1';

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || process.env.API_KEY || '';
    if (!this.apiKey) {
      console.warn('DEEPSEEK_API_KEY not found in environment variables');
    }
  }

  async generateChristianResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<{
    response: string;
    scriptureReferences: ScriptureReference[];
  }> {
    try {
      // Optimize system prompt for faster responses
      const isLongContent = userMessage.length > 1000;
      
      const systemPrompt = `You are F-AI-TH-Connect, a Christian AI assistant. ${isLongContent ? 
        'Focus on key spiritual themes and provide concise, actionable guidance.' : 
        'Provide biblical guidance and Christian wisdom.'} Be concise yet meaningful. 

IMPORTANT: When referencing Bible verses, you MUST include the full verse text in your response for immediate spiritual guidance. Use this format:

**Scripture Reference:** [John 3:16](bible://John 3:16)
"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."

Always include 1-2 relevant Scripture references with the complete verse text. This allows users to receive God's Word immediately without external lookups. Keep responses helpful, biblical, and include the actual Scripture text.`;

      // Optimize conversation history for speed - limit to last 4 messages for context
      const recentHistory = conversationHistory.slice(-4);
      
      const messages = [
        { role: 'system', content: systemPrompt },
        ...recentHistory,
        { role: 'user', content: userMessage }
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Reduced to 30 seconds for faster responses

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.6, // Slightly lower temperature for faster, more focused responses
          max_tokens: userMessage.length > 1000 ? 800 : 400, // Reduced token limits for faster generation
          stream: false,
          top_p: 0.9, // Add nucleus sampling for more efficient generation
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`);
      }

      const data: DeepseekResponse = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I encountered an issue generating a response. Please try again.';

      // Extract scripture references from the response
      const scriptureReferences = this.extractScriptureReferences(aiResponse);

      return {
        response: aiResponse,
        scriptureReferences
      };
    } catch (error) {
      console.error('Error calling Deepseek AI:', error);
      
      // Handle different types of errors
      let errorMessage = 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Response generation took longer than expected. Please try again.';
        } else if (error.message.includes('401')) {
          errorMessage = 'There seems to be an authentication issue. Please check the API key configuration.';
        } else if (error.message.includes('429')) {
          errorMessage = 'The service is currently busy. Please wait a moment and try again.';
        }
      }
      
      return {
        response: `${errorMessage} In the meantime, remember that God is always with you: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." - Joshua 1:9`,
        scriptureReferences: [{
          verse: 'Joshua 1:9',
          book: 'Joshua',
          chapter: 1,
          verses: '9',
          text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.'
        }]
      };
    }
  }

  private extractScriptureReferences(text: string): ScriptureReference[] {
    const references: ScriptureReference[] = [];
    
    // Pattern to match Bible references like "Matthew 6:26-27", "1 Peter 5:7", etc.
    const scripturePattern = /(\d?\s?[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(\d+):(\d+(?:-\d+)?)/g;
    
    let match;
    while ((match = scripturePattern.exec(text)) !== null) {
      const book = match[1].trim();
      const chapter = parseInt(match[2]);
      const verses = match[3];
      const fullRef = `${book} ${chapter}:${verses}`;
      
      // Extract the quoted text if it follows the reference
      const quotePattern = new RegExp(`${fullRef}[^"]*["'](.*?)["']`, 'i');
      const quoteMatch = text.match(quotePattern);
      const quotedText = quoteMatch ? quoteMatch[1] : '';
      
      references.push({
        verse: fullRef,
        book,
        chapter,
        verses,
        text: quotedText
      });
    }
    
    return references;
  }
}
