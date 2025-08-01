import { biblicalTerms } from './biblical-terms-dictionary';

export interface SpellCheckResult {
  word: string;
  isCorrect: boolean;
  suggestions: string[];
  confidence: number;
}

export interface PredictiveTextResult {
  suggestions: string[];
  source: 'biblical' | 'common' | 'mixed';
}

class SpellCheckService {
  private biblicalDictionary: Set<string>;
  private commonWords: Set<string>;
  private readonly maxDistance = 2; // Maximum Levenshtein distance for suggestions

  constructor() {
    // Initialize biblical terms dictionary
    this.biblicalDictionary = new Set(biblicalTerms.map(term => term.toLowerCase()));
    
    // Common English words (subset for basic spell checking)
    this.commonWords = new Set([
      'the', 'and', 'of', 'to', 'a', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with',
      'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what',
      'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'each', 'which', 'she', 'do', 'how', 'their',
      'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would',
      'make', 'like', 'into', 'him', 'has', 'two', 'more', 'very', 'after', 'words', 'first', 'where', 'much'
    ]);
  }

  checkSpelling(text: string): SpellCheckResult[] {
    const words = this.extractWords(text);
    const results: SpellCheckResult[] = [];

    for (const word of words) {
      const cleanWord = word.toLowerCase();
      
      // Skip very short words or numbers
      if (cleanWord.length < 2 || /^\d+$/.test(cleanWord)) {
        continue;
      }

      const isCorrect = this.isWordCorrect(cleanWord);
      const suggestions = isCorrect ? [] : this.getSuggestions(cleanWord);
      
      results.push({
        word: word,
        isCorrect,
        suggestions,
        confidence: this.calculateConfidence(cleanWord, suggestions)
      });
    }

    return results;
  }

  getPredictiveText(input: string, limit: number = 5): PredictiveTextResult {
    const cleanInput = input.toLowerCase().trim();
    
    if (cleanInput.length < 2) {
      return { suggestions: [], source: 'mixed' };
    }

    const biblicalSuggestions = this.getBiblicalSuggestions(cleanInput, limit);
    const commonSuggestions = this.getCommonSuggestions(cleanInput, limit);
    
    // Prioritize biblical terms
    const suggestions = [
      ...biblicalSuggestions.slice(0, Math.ceil(limit * 0.7)),
      ...commonSuggestions.slice(0, Math.floor(limit * 0.3))
    ].slice(0, limit);

    const source = biblicalSuggestions.length > 0 ? 'biblical' : 
                  commonSuggestions.length > 0 ? 'common' : 'mixed';

    return { suggestions, source };
  }

  private extractWords(text: string): string[] {
    return text.match(/\b[a-zA-Z']+\b/g) || [];
  }

  private isWordCorrect(word: string): boolean {
    return this.biblicalDictionary.has(word) || this.commonWords.has(word);
  }

  private getSuggestions(word: string): string[] {
    const suggestions: Array<{ word: string; distance: number; priority: number }> = [];
    
    // Check biblical terms first (higher priority)
    for (const term of this.biblicalDictionary) {
      const distance = this.levenshteinDistance(word, term);
      if (distance <= this.maxDistance) {
        suggestions.push({ word: term, distance, priority: 1 });
      }
    }
    
    // Check common words (lower priority)
    for (const commonWord of this.commonWords) {
      const distance = this.levenshteinDistance(word, commonWord);
      if (distance <= this.maxDistance) {
        suggestions.push({ word: commonWord, distance, priority: 2 });
      }
    }
    
    // Sort by priority first, then by distance
    return suggestions
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.distance - b.distance;
      })
      .slice(0, 5)
      .map(s => s.word);
  }

  private getBiblicalSuggestions(input: string, limit: number): string[] {
    const suggestions: string[] = [];
    
    for (const term of this.biblicalDictionary) {
      if (term.startsWith(input)) {
        suggestions.push(term);
        if (suggestions.length >= limit) break;
      }
    }
    
    return suggestions;
  }

  private getCommonSuggestions(input: string, limit: number): string[] {
    const suggestions: string[] = [];
    
    for (const word of this.commonWords) {
      if (word.startsWith(input)) {
        suggestions.push(word);
        if (suggestions.length >= limit) break;
      }
    }
    
    return suggestions;
  }

  private calculateConfidence(word: string, suggestions: string[]): number {
    if (suggestions.length === 0) return 0;
    
    const bestSuggestion = suggestions[0];
    const distance = this.levenshteinDistance(word, bestSuggestion);
    const maxLen = Math.max(word.length, bestSuggestion.length);
    
    return Math.max(0, (maxLen - distance) / maxLen);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,        // deletion
          matrix[j - 1][i] + 1,        // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

export const spellCheckService = new SpellCheckService();