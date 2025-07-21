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
      // Optimize system prompt for long content processing
      const isLongContent = userMessage.length > 1000;
      
      const systemPrompt = `You are F-AI-TH-Connect, a Christian AI assistant. ${isLongContent ? 
        'The user has shared extensive content. Focus on key spiritual themes and provide structured, actionable guidance.' : 
        'Provide biblical guidance, spiritual support, and Christian wisdom.'} Your responses should be:

1. Grounded in Scripture - Always reference relevant Bible verses
2. Theologically sound - Align with orthodox Christian doctrine
3. Compassionate and encouraging - Show Christ's love in your responses
4. Practical - Offer actionable guidance for Christian living
5. Respectful - Honor different Christian traditions while staying biblical

When responding:
- Include relevant Scripture verses with book, chapter, and verse numbers
- Provide both the reference and the actual text when helpful
- Offer practical prayer suggestions when appropriate
- Encourage users to seek pastoral care for serious issues
- Always point users toward God and His Word

Format Scripture references clearly, for example: "Matthew 6:26-27 (NIV): 'Look at the birds of the air; they do not sow or reap...'"`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for longer content

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: userMessage.length > 1000 ? 1200 : 600, // More tokens for longer input
          stream: false,
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
          errorMessage = 'The request took too long to process. Please try asking a shorter question or try again.';
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
