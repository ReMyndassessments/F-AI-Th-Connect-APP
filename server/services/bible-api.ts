// Bible API service for fetching verses dynamically
interface BibleVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: string;
  version: string;
}

interface BibleAPIResponse {
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
}

export class BibleAPIService {
  private apiKey: string;
  private baseUrl = 'https://api.scripture.api.bible/v1';
  private bibleId = '9879dbb7cfe39e4d-01'; // World English Bible (public domain)

  constructor() {
    this.apiKey = process.env.BIBLE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('BIBLE_API_KEY not found - using fallback verses');
    }
  }

  async getVerse(reference: string): Promise<BibleVerse | null> {
    try {
      if (!this.apiKey) {
        return this.getFallbackVerse(reference);
      }

      // Parse reference (e.g., "John 3:16" -> book: "John", chapter: 3, verse: 16)
      const parsed = this.parseReference(reference);
      if (!parsed) {
        return this.getFallbackVerse(reference);
      }

      const verseId = `${parsed.book}.${parsed.chapter}.${parsed.verse}`;
      
      const response = await fetch(`${this.baseUrl}/bibles/${this.bibleId}/verses/${verseId}`, {
        headers: {
          'api-key': this.apiKey,
        },
        signal: AbortSignal.timeout(5000), // 5-second timeout
      });

      if (!response.ok) {
        console.warn(`Bible API error: ${response.status} for ${reference}`);
        return this.getFallbackVerse(reference);
      }

      const data = await response.json();
      
      return {
        reference,
        text: this.cleanVerseText(data.data.content),
        book: parsed.book,
        chapter: parsed.chapter,
        verse: parsed.verse.toString(),
        version: 'WEB',
      };
    } catch (error) {
      console.warn(`Failed to fetch verse ${reference}:`, error);
      return this.getFallbackVerse(reference);
    }
  }

  private parseReference(reference: string): { book: string; chapter: number; verse: string } | null {
    // Clean up the reference and handle various formats
    let cleanRef = reference.replace(/\./g, ' '); // Replace dots with spaces
    
    // Handle formats like:
    // "John 3:16", "1 Corinthians 13:4", "Psalm 23:1"
    // "2Corinthians 5:9-10", "Matthew 28:19-20"
    const match = cleanRef.match(/^(\d*\s*[A-Za-z]+)\s+(\d+):(\d+(?:-\d+)?)$/);
    if (!match) return null;

    const [, book, chapter, verse] = match;
    return {
      book: book.trim(),
      chapter: parseInt(chapter, 10),
      verse: verse, // Keep as string to handle ranges like "9-10"
    };
  }

  private cleanVerseText(html: string): string {
    // Remove HTML tags and clean up the verse text
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private getFallbackVerse(reference: string): BibleVerse | null {
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
      "Joshua 1:9": {
        reference: "Joshua 1:9",
        text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        book: "Joshua",
        chapter: 1,
        verse: "9",
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
      "2 Corinthians 5:9-10": {
        reference: "2 Corinthians 5:9-10",
        text: "So we make it our goal to please him, whether we are at home in the body or away from it. For we must all appear before the judgment seat of Christ, so that each of us may receive what is due us for the things done while in the body, whether good or bad.",
        book: "2 Corinthians",
        chapter: 5,
        verse: "9-10",
        version: "NIV"
      },
      "Matthew 28:19-20": {
        reference: "Matthew 28:19-20",
        text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.",
        book: "Matthew",
        chapter: 28,
        verse: "19-20",
        version: "NIV"
      },
      "Romans 3:23-24": {
        reference: "Romans 3:23-24",
        text: "for all have sinned and fall short of the glory of God, and all are justified freely by his grace through the redemption that came by Christ Jesus.",
        book: "Romans",
        chapter: 3,
        verse: "23-24",
        version: "NIV"
      },
      "Ephesians 2:8-9": {
        reference: "Ephesians 2:8-9",
        text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
        book: "Ephesians",
        chapter: 2,
        verse: "8-9",
        version: "NIV"
      },
      "Romans 5:3-5": {
        reference: "Romans 5:3-5",
        text: "Not only so, but we also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope. And hope does not put us to shame, because God's love has been poured out into our hearts through the Holy Spirit, who has been given to us.",
        book: "Romans",
        chapter: 5,
        verse: "3-5",
        version: "NIV"
      },
      "James 1:2-4": {
        reference: "James 1:2-4",
        text: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance. Let perseverance finish its work so that you may be mature and complete, not lacking anything.",
        book: "James",
        chapter: 1,
        verse: "2-4",
        version: "NIV"
      },
      "1 Peter 5:7": {
        reference: "1 Peter 5:7",
        text: "Cast all your anxiety on him because he cares for you.",
        book: "1 Peter",
        chapter: 5,
        verse: "7",
        version: "NIV"
      },
      "Galatians 6:9": {
        reference: "Galatians 6:9",
        text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
        book: "Galatians",
        chapter: 6,
        verse: "9",
        version: "NIV"
      },
      "2 Corinthians 5:17-21": {
        reference: "2 Corinthians 5:17-21",
        text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here! All this is from God, who reconciled us to himself through Christ and gave us the ministry of reconciliation: that God was reconciling the world to himself in Christ, not counting people's sins against them. And he has committed to us the message of reconciliation. We are therefore Christ's ambassadors, as though God were making his appeal through us. We implore you on Christ's behalf: Be reconciled to God. God made him who had no sin to be sin for us, so that in him we might become the righteousness of God.",
        book: "2 Corinthians",
        chapter: 5,
        verse: "17-21",
        version: "NIV"
      },
      "Matthew 5:14-16": {
        reference: "Matthew 5:14-16",
        text: "You are the light of the world. A town built on a hill cannot be hidden. Neither do people light a lamp and put it under a bowl. Instead they put it on its stand, and it gives light to everyone in the house. In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
        book: "Matthew",
        chapter: 5,
        verse: "14-16",
        version: "NIV"
      },
      "Colossians 3:12-14": {
        reference: "Colossians 3:12-14",
        text: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience. Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you. And over all these virtues put on love, which binds them all together in perfect unity.",
        book: "Colossians",
        chapter: 3,
        verse: "12-14",
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
      "2 Corinthians 11:24-28": {
        reference: "2 Corinthians 11:24-28",
        text: "Five times I received from the Jews the forty lashes minus one. Three times I was beaten with rods, once I was pelted with stones, three times I was shipwrecked, I spent a night and a day in the open sea, I have been constantly on the move. I have been in danger from rivers, in danger from bandits, in danger from my fellow Jews, in danger from Gentiles; in danger in the city, in danger in the country, in danger at sea; and in danger from false believers. I have labored and toiled and have often gone without sleep; I have known hunger and thirst and have often gone without food; I have been cold and naked. Besides everything else, I face daily the pressure of my concern for all the churches.",
        book: "2 Corinthians",
        chapter: 11,
        verse: "24-28",
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
      return fallbackVerses[reference];
    }
    
    // Try normalized reference (handle different formats)
    const normalizedRef = reference.replace(/\./g, ' ').replace(/(\d)([A-Za-z])/g, '$1 $2');
    if (fallbackVerses[normalizedRef]) {
      return fallbackVerses[normalizedRef];
    }
    
    return null;
  }
}

export const bibleAPI = new BibleAPIService();