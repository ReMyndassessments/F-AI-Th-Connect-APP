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
    this.apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || process.env.API_KEY || '';
    if (!this.apiKey) {
      console.warn('DEEPSEEK_API_KEY not found in environment variables');
    }
  }

  async generateChristianResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}> = [], language = 'en'): Promise<{
    response: string;
    scriptureReferences: ScriptureReference[];
  }> {
    try {
      // Optimize system prompt for faster responses
      const isLongContent = userMessage.length > 1000;

      const languageInstruction = language === 'tl'
        ? '\n\nCRITICAL INSTRUCTION: You must respond ENTIRELY in Tagalog (Filipino). Write all your responses in natural, clear Filipino/Tagalog language. Do not respond in English under any circumstance.'
        : language === 'zh'
        ? '\n\nCRITICAL INSTRUCTION: You must respond ENTIRELY in Simplified Chinese (简体中文). Write all your responses in natural, clear Mandarin Chinese. Do not respond in English under any circumstance.'
        : '';
      
      const systemPrompt = `You are F-AI-TH-Connect, a Christian AI assistant providing comprehensive biblical guidance and theological wisdom. ${isLongContent ? 
        'Provide thorough analysis of key spiritual themes with detailed, actionable guidance and practical applications.' : 
        'Offer detailed biblical guidance, practical applications, and comprehensive Christian wisdom.'}${languageInstruction}

Structure your responses with depth and detail:

1. BIBLICAL FOUNDATION: Start with solid scriptural grounding
2. THEOLOGICAL CONTEXT: Explain the deeper meaning and historical context
3. PRACTICAL APPLICATION: Provide specific, actionable steps for daily life
4. PERSONAL REFLECTION: Include questions for spiritual growth and self-examination
5. ADDITIONAL RESOURCES: Suggest related biblical passages or spiritual practices

Always include 2-4 relevant Scripture references with book, chapter, and verse numbers. When referencing verses, use the format [John 3:16](bible://John 3:16) to create clickable study links. For verse ranges, use formats like [Romans 3:23-24](bible://Romans 3:23-24).

IMPORTANT: Write your responses in plain text only. Do NOT use any markdown formatting symbols such as asterisks, hashtags, or underscores. Write section headers in CAPITAL LETTERS followed by a colon. Do not use bold, italic, or any other text formatting.

Provide rich, substantive responses that truly help believers grow in their faith with thorough explanations, examples, and spiritual insights.`;

      // Optimize conversation history for speed - limit to last 4 messages for context
      const recentHistory = conversationHistory.slice(-4);
      
      const languageReminder = language === 'tl'
        ? '\n\n[IMPORTANT: Your entire response must be written in Tagalog/Filipino. Do not use English.]'
        : language === 'zh'
        ? '\n\n[重要：你的全部回答必须用简体中文。不得使用英文。]'
        : '';

      const messages = [
        { role: 'system', content: systemPrompt },
        ...recentHistory,
        { role: 'user', content: userMessage + languageReminder }
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds to allow complete responses for comprehensive Bible studies

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
          max_tokens: userMessage.length > 1000 ? 8000 : 2000, // Maximum tokens for complete Bible study guides without truncation
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
