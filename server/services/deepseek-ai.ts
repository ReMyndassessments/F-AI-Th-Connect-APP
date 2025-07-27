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

CRITICAL REQUIREMENT: You MUST always display the complete Bible verse text directly in your response. Never just show verse references as links without the text. Follow this exact format:

**[Romans 8:28](bible://Romans 8:28)**
"And we know that in all things God works for the good of those who love him, who have been called according to his purpose."

**[Jeremiah 29:11](bible://Jeremiah 29:11)**  
"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future."

MANDATORY: Every single Bible verse reference you mention MUST be immediately followed by the complete verse text in quotes. This ensures users receive God's Word directly in your response without needing to click links. Include 1-3 relevant verses with their full text.`;

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
