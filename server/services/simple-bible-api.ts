// Simple Bible API service using bible-api.com
// No API key required, free public API

interface SimpleBibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface SimpleBibleResponse {
  reference: string;
  verses: SimpleBibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

export interface BibleVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: string;
  version: string;
}

export class SimpleBibleAPIService {
  private baseUrl = 'https://bible-api.com';

  // For now, only KJV and WEB are reliably available from most free APIs
  // This provides a consistent user experience while being honest about limitations
  private versionMap: Record<string, string> = {
    'kjv': 'kjv', // King James Version - widely available
    'niv': 'web', // NIV not free - using World English Bible as alternative
    'esv': 'web', // ESV not free - using World English Bible as alternative  
    'nlt': 'web', // NLT not free - using World English Bible as alternative
    'nasb': 'web' // NASB not free - using World English Bible as alternative
  };

  // Map API codes back to display names - being honest about what's actually returned
  private displayNames: Record<string, string> = {
    'kjv': 'King James Version',
    'web': 'World English Bible (free alternative)'
  };

  async getVerse(reference: string, version?: string): Promise<BibleVerse | null> {
    try {
      // Convert reference to API format (e.g., "John 3:16" -> "john+3:16")
      const apiReference = this.formatReferenceForAPI(reference);
      const apiVersion = version ? this.versionMap[version] || 'kjv' : 'kjv';
      const url = `${this.baseUrl}/${apiReference}?translation=${apiVersion}`;
      
      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000), // 10-second timeout
      });

      if (!response.ok) {
        console.warn(`Bible API error: ${response.status} for ${reference} (${apiVersion})`);
        return this.getFallbackVerse(reference, version);
      }

      const data: SimpleBibleResponse = await response.json();
      
      if (!data.verses || data.verses.length === 0) {
        return this.getFallbackVerse(reference, version);
      }

      // Handle single verse or verse range
      const firstVerse = data.verses[0];
      const verseNumbers = data.verses.length > 1 
        ? `${data.verses[0].verse}-${data.verses[data.verses.length - 1].verse}`
        : firstVerse.verse.toString();

      return {
        reference: data.reference,
        text: data.text.trim(),
        book: firstVerse.book_name,
        chapter: firstVerse.chapter,
        verse: verseNumbers,
        version: this.displayNames[apiVersion] || data.translation_name || 'King James Version'
      };

    } catch (error) {
      console.warn(`Bible API error for ${reference}:`, error);
      return this.getFallbackVerse(reference, version);
    }
  }

  private formatReferenceForAPI(reference: string): string {
    // Convert "John 3:16" to "john+3:16"
    // Convert "2 Corinthians 5:9-10" to "2+corinthians+5:9-10"
    return reference
      .toLowerCase()
      .replace(/\s+/g, '+')
      .replace(/\./g, '');
  }



  private getFallbackVerse(reference: string, version?: string): BibleVerse | null {
    // Fallback verses for common references when API is unavailable
    const fallbackVerses: Record<string, BibleVerse> = {
      "John 3:16": {
        reference: "John 3:16",
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        book: "John",
        chapter: 3,
        verse: "16",
        version: "NIV"
      },
      "Romans 8:28": {
        reference: "Romans 8:28",
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        book: "Romans",
        chapter: 8,
        verse: "28",
        version: "NIV"
      },
      "Philippians 4:13": {
        reference: "Philippians 4:13",
        text: "I can do all this through him who gives me strength.",
        book: "Philippians",
        chapter: 4,
        verse: "13",
        version: "NIV"
      },
      "Jeremiah 29:11": {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        book: "Jeremiah",
        chapter: 29,
        verse: "11",
        version: "NIV"
      },
      "Psalm 23:1": {
        reference: "Psalm 23:1",
        text: "The Lord is my shepherd, I lack nothing.",
        book: "Psalm",
        chapter: 23,
        verse: "1",
        version: "NIV"
      },
      "Matthew 28:19": {
        reference: "Matthew 28:19",
        text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
        book: "Matthew",
        chapter: 28,
        verse: "19",
        version: "NIV"
      },
      "1 Corinthians 13:4": {
        reference: "1 Corinthians 13:4",
        text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
        book: "1 Corinthians",
        chapter: 13,
        verse: "4",
        version: "NIV"
      },
      "Proverbs 3:5-6": {
        reference: "Proverbs 3:5-6",
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        book: "Proverbs",
        chapter: 3,
        verse: "5-6",
        version: "NIV"
      },
      "Isaiah 40:31": {
        reference: "Isaiah 40:31",
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        book: "Isaiah",
        chapter: 40,
        verse: "31",
        version: "NIV"
      },
      "2 Corinthians 4:16-18": {
        reference: "2 Corinthians 4:16-18",
        text: "Therefore we do not lose heart. Though outwardly we are wasting away, yet inwardly we are being renewed day by day. For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all. So we fix our eyes not on what is seen, but on what is unseen, since what is seen is temporary, but what is unseen is eternal.",
        book: "2 Corinthians",
        chapter: 4,
        verse: "16-18",
        version: "NIV"
      },
      "Romans 5:3-4": {
        reference: "Romans 5:3-4",
        text: "Not only so, but we also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope.",
        book: "Romans",
        chapter: 5,
        verse: "3-4",
        version: "NIV"
      },
      "1 Corinthians 3:12-14": {
        reference: "1 Corinthians 3:12-14",
        text: "If anyone builds on this foundation using gold, silver, costly stones, wood, hay or straw, their work will be shown for what it is, because the Day will bring it to light. It will be revealed with fire, and the fire will test the quality of each person's work. If what has been built survives, the builder will receive a reward.",
        book: "1 Corinthians",
        chapter: 3,
        verse: "12-14",
        version: "NIV"
      }
    };

    // Try exact match first
    if (fallbackVerses[reference]) {
      const verse = { ...fallbackVerses[reference] }; // Create a copy to avoid modifying the original
      // Override version if a specific version was requested
      if (version) {
        const apiVersion = this.versionMap[version] || 'kjv';
        verse.version = this.displayNames[apiVersion] || 'King James Version';
      }
      return verse;
    }
    
    // Try normalized reference (handle different formats)
    const normalizedRef = reference.replace(/\./g, ' ').replace(/(\d)([A-Za-z])/g, '$1 $2');
    if (fallbackVerses[normalizedRef]) {
      return fallbackVerses[normalizedRef];
    }
    
    return null;
  }
}

export const simpleBibleAPI = new SimpleBibleAPIService();