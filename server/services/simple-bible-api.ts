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
  
  async searchVerses(query: string, version: string = 'kjv', limit: number = 10): Promise<any[]> {
    try {
      // Comprehensive database of popular and commonly searched Bible verses
      const popularVerses = [
        // Salvation and Grace
        {
          reference: "John 3:16",
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          book: "John", chapter: 3, verse: "16", version: "NIV"
        },
        {
          reference: "Romans 6:23",
          text: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.",
          book: "Romans", chapter: 6, verse: "23", version: "NIV"
        },
        {
          reference: "Ephesians 2:8-9",
          text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
          book: "Ephesians", chapter: 2, verse: "8-9", version: "NIV"
        },
        {
          reference: "Romans 10:9",
          text: "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved.",
          book: "Romans", chapter: 10, verse: "9", version: "NIV"
        },
        {
          reference: "Acts 16:31",
          text: "They replied, 'Believe in the Lord Jesus, and you will be saved—you and your household.'",
          book: "Acts", chapter: 16, verse: "31", version: "NIV"
        },
        {
          reference: "2 Corinthians 5:17",
          text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
          book: "2 Corinthians", chapter: 5, verse: "17", version: "NIV"
        },
        {
          reference: "1 John 1:9",
          text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.",
          book: "1 John", chapter: 1, verse: "9", version: "NIV"
        },
        
        // Comfort and Encouragement
        {
          reference: "Romans 8:28",
          text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
          book: "Romans", chapter: 8, verse: "28", version: "NIV"
        },
        {
          reference: "Philippians 4:13",
          text: "I can do all this through him who gives me strength.",
          book: "Philippians", chapter: 4, verse: "13", version: "NIV"
        },
        {
          reference: "Jeremiah 29:11",
          text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
          book: "Jeremiah", chapter: 29, verse: "11", version: "NIV"
        },
        {
          reference: "Isaiah 40:31",
          text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
          book: "Isaiah", chapter: 40, verse: "31", version: "NIV"
        },
        {
          reference: "Matthew 11:28-30",
          text: "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.",
          book: "Matthew", chapter: 11, verse: "28-30", version: "NIV"
        },
        {
          reference: "Joshua 1:9",
          text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
          book: "Joshua", chapter: 1, verse: "9", version: "NIV"
        },
        {
          reference: "Psalm 46:10",
          text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.",
          book: "Psalm", chapter: 46, verse: "10", version: "NIV"
        },
        {
          reference: "Isaiah 41:10",
          text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
          book: "Isaiah", chapter: 41, verse: "10", version: "NIV"
        },
        {
          reference: "Psalm 27:1",
          text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?",
          book: "Psalm", chapter: 27, verse: "1", version: "NIV"
        },
        {
          reference: "Romans 8:38-39",
          text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
          book: "Romans", chapter: 8, verse: "38-39", version: "NIV"
        },
        {
          reference: "Deuteronomy 31:6",
          text: "Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.",
          book: "Deuteronomy", chapter: 31, verse: "6", version: "NIV"
        },
        
        // Psalms
        {
          reference: "Psalm 23:1",
          text: "The Lord is my shepherd, I lack nothing.",
          book: "Psalm", chapter: 23, verse: "1", version: "NIV"
        },
        {
          reference: "Psalm 23:4",
          text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
          book: "Psalm", chapter: 23, verse: "4", version: "NIV"
        },
        {
          reference: "Psalm 139:14",
          text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.",
          book: "Psalm", chapter: 139, verse: "14", version: "NIV"
        },
        {
          reference: "Psalm 118:24",
          text: "This is the day the Lord has made; let us rejoice and be glad in it.",
          book: "Psalm", chapter: 118, verse: "24", version: "NIV"
        },
        {
          reference: "Psalm 121:1-2",
          text: "I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord, the Maker of heaven and earth.",
          book: "Psalm", chapter: 121, verse: "1-2", version: "NIV"
        },
        {
          reference: "Psalm 37:4",
          text: "Take delight in the Lord, and he will give you the desires of your heart.",
          book: "Psalm", chapter: 37, verse: "4", version: "NIV"
        },
        {
          reference: "Psalm 91:1-2",
          text: "Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the Lord, 'He is my refuge and my fortress, my God, in whom I trust.'",
          book: "Psalm", chapter: 91, verse: "1-2", version: "NIV"
        },
        
        // Love and Relationships
        {
          reference: "1 Corinthians 13:4",
          text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
          book: "1 Corinthians", chapter: 13, verse: "4", version: "NIV"
        },
        {
          reference: "1 Corinthians 13:13",
          text: "And now these three remain: faith, hope and love. But the greatest of these is love.",
          book: "1 Corinthians", chapter: 13, verse: "13", version: "NIV"
        },
        {
          reference: "1 John 4:19",
          text: "We love because he first loved us.",
          book: "1 John", chapter: 4, verse: "19", version: "NIV"
        },
        {
          reference: "1 John 4:8",
          text: "Whoever does not love does not know God, because God is love.",
          book: "1 John", chapter: 4, verse: "8", version: "NIV"
        },
        
        // Wisdom and Guidance
        {
          reference: "Proverbs 3:5-6",
          text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
          book: "Proverbs", chapter: 3, verse: "5-6", version: "NIV"
        },
        {
          reference: "James 1:5",
          text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
          book: "James", chapter: 1, verse: "5", version: "NIV"
        },
        {
          reference: "Psalm 119:105",
          text: "Your word is a lamp for my feet, a light on my path.",
          book: "Psalm", chapter: 119, verse: "105", version: "NIV"
        },
        {
          reference: "Proverbs 27:17",
          text: "As iron sharpens iron, so one person sharpens another.",
          book: "Proverbs", chapter: 27, verse: "17", version: "NIV"
        },
        
        // Faith and Trust
        {
          reference: "Hebrews 11:1",
          text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
          book: "Hebrews", chapter: 11, verse: "1", version: "NIV"
        },
        {
          reference: "Matthew 17:20",
          text: "Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, 'Move from here to there,' and it will move. Nothing will be impossible for you.",
          book: "Matthew", chapter: 17, verse: "20", version: "NIV"
        },
        {
          reference: "Mark 11:24",
          text: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.",
          book: "Mark", chapter: 11, verse: "24", version: "NIV"
        },
        
        // Prayer and Worship
        {
          reference: "1 Thessalonians 5:16-18",
          text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
          book: "1 Thessalonians", chapter: 5, verse: "16-18", version: "NIV"
        },
        {
          reference: "Philippians 4:6-7",
          text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
          book: "Philippians", chapter: 4, verse: "6-7", version: "NIV"
        },
        {
          reference: "Matthew 6:9-13",
          text: "This, then, is how you should pray: 'Our Father in heaven, hallowed be your name, your kingdom come, your will be done, on earth as it is in heaven. Give us today our daily bread. And forgive us our debts, as we also have forgiven our debtors. And lead us not into temptation, but deliver us from the evil one.'",
          book: "Matthew", chapter: 6, verse: "9-13", version: "NIV"
        },
        
        // Great Commission and Ministry
        {
          reference: "Matthew 28:19",
          text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
          book: "Matthew", chapter: 28, verse: "19", version: "NIV"
        },
        {
          reference: "Mark 16:15",
          text: "He said to them, 'Go into all the world and preach the gospel to all creation.'",
          book: "Mark", chapter: 16, verse: "15", version: "NIV"
        },
        
        // Fruit of the Spirit
        {
          reference: "Galatians 5:22-23",
          text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
          book: "Galatians", chapter: 5, verse: "22-23", version: "NIV"
        },
        
        // Peace and Anxiety
        {
          reference: "John 14:27",
          text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
          book: "John", chapter: 14, verse: "27", version: "NIV"
        },
        {
          reference: "Matthew 6:26",
          text: "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?",
          book: "Matthew", chapter: 6, verse: "26", version: "NIV"
        },
        {
          reference: "1 Peter 5:7",
          text: "Cast all your anxiety on him because he cares for you.",
          book: "1 Peter", chapter: 5, verse: "7", version: "NIV"
        },
        
        // Forgiveness
        {
          reference: "Matthew 6:14-15",
          text: "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
          book: "Matthew", chapter: 6, verse: "14-15", version: "NIV"
        },
        {
          reference: "Ephesians 4:32",
          text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
          book: "Ephesians", chapter: 4, verse: "32", version: "NIV"
        },
        
        // Hope and Future
        {
          reference: "Romans 8:18",
          text: "I consider that our present sufferings are not worth comparing with the glory that will be revealed in us.",
          book: "Romans", chapter: 8, verse: "18", version: "NIV"
        },
        {
          reference: "Revelation 21:4",
          text: "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.",
          book: "Revelation", chapter: 21, verse: "4", version: "NIV"
        },
        
        // Light and Darkness
        {
          reference: "John 8:12",
          text: "When Jesus spoke again to the people, he said, 'I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.'",
          book: "John", chapter: 8, verse: "12", version: "NIV"
        },
        {
          reference: "Matthew 5:14-16",
          text: "You are the light of the world. A town built on a hill cannot be hidden. Neither do people light a lamp and put it under a bowl. Instead they put it on its stand, and it gives light to everyone in the house. In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
          book: "Matthew", chapter: 5, verse: "14-16", version: "NIV"
        },
        
        // Additional Popular Verses
        {
          reference: "Romans 12:2",
          text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.",
          book: "Romans", chapter: 12, verse: "2", version: "NIV"
        },
        {
          reference: "2 Timothy 3:16",
          text: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.",
          book: "2 Timothy", chapter: 3, verse: "16", version: "NIV"
        },
        {
          reference: "Ecclesiastes 3:1",
          text: "To every thing there is a season, and a time to every purpose under the heaven.",
          book: "Ecclesiastes", chapter: 3, verse: "1", version: "KJV"
        },
        {
          reference: "Micah 6:8",
          text: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
          book: "Micah", chapter: 6, verse: "8", version: "NIV"
        }
      ];

      // Perform case-insensitive search through verse texts
      const queryLower = query.toLowerCase();
      const matchingVerses = popularVerses.filter(verse => 
        verse.text.toLowerCase().includes(queryLower) ||
        verse.reference.toLowerCase().includes(queryLower)
      );

      // Return limited results
      return matchingVerses.slice(0, limit).map(verse => ({
        ...verse,
        version: version.toUpperCase()
      }));
    } catch (error) {
      console.error('Bible search error:', error);
      return [];
    }
  }
  private apiKey: string;
  private baseUrl = 'https://api.scripture.api.bible/v1';
  
  // Map client version codes to API.Bible version IDs (using available versions)
  private versionMap: Record<string, string> = {
    'kjv': 'de4e12af7f28f599-02', // King James Version (KJV) - Public Domain
    'web': '9879dbb7cfe39e4d-01', // World English Bible - Public Domain  
    'asv': '06125adad2d5898a-01', // American Standard Version - Public Domain
  };

  // Map API codes back to display names  
  private displayNames: Record<string, string> = {
    'de4e12af7f28f599-02': 'King James Version',
    '9879dbb7cfe39e4d-01': 'World English Bible',
    '06125adad2d5898a-01': 'American Standard Version',
  };

  constructor() {
    this.apiKey = process.env.BIBLE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('BIBLE_API_KEY not found - falling back to free API');
    }
  }

  async getVerse(reference: string, version?: string): Promise<BibleVerse | null> {
    // Use API.Bible if we have an API key, otherwise fallback to free API
    if (this.apiKey) {
      return this.getVerseFromAPIBible(reference, version);
    } else {
      return this.getVerseFromFreeAPI(reference, version);
    }
  }

  private async getVerseFromAPIBible(reference: string, version?: string): Promise<BibleVerse | null> {
    try {
      const bibleId = version ? this.versionMap[version] || this.versionMap['kjv'] : this.versionMap['kjv'];
      
      // Parse reference and convert to API.Bible format
      const parsed = this.parseReference(reference);
      if (!parsed) {
        return this.getFallbackVerse(reference, version);
      }

      // Try direct verse ID lookup first (more reliable)
      const verseId = this.buildVerseId(parsed.book, parsed.chapter, parsed.verse);
      
      if (verseId) {
        const verseResult = await this.fetchVerseById(bibleId, verseId, reference, parsed);
        if (verseResult) return verseResult;
      }

      // Fallback to search endpoint
      const searchQuery = `${parsed.book} ${parsed.chapter}:${parsed.verse}`;
      const searchUrl = `${this.baseUrl}/bibles/${bibleId}/search?query=${encodeURIComponent(searchQuery)}&limit=5`;
      
      const searchResponse = await fetch(searchUrl, {
        headers: {
          'api-key': this.apiKey,
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!searchResponse.ok) {
        console.warn(`API.Bible search error: ${searchResponse.status} for ${reference}`);
        return this.getFallbackVerse(reference, version);
      }

      const searchData = await searchResponse.json();
      
      // Handle both passages and verses in search results
      let content = null;
      let resultId = null;

      if (searchData.data?.passages && searchData.data.passages.length > 0) {
        // Search returned passages
        const passage = searchData.data.passages[0];
        content = this.stripHtmlTags(passage.content);
        resultId = passage.id;
      } else if (searchData.data?.verses && searchData.data.verses.length > 0) {
        // Search returned verses - fetch the verse content
        const verseResult = searchData.data.verses[0];
        const verseData = await this.fetchVerseById(bibleId, verseResult.id, reference, parsed);
        if (verseData) return verseData;
      }

      if (!content) {
        return this.getFallbackVerse(reference, version);
      }

      return {
        reference: reference,
        text: content.trim(),
        book: parsed.book,
        chapter: parsed.chapter,
        verse: parsed.verse.toString(),
        version: this.displayNames[bibleId] || 'King James Version'
      };

    } catch (error) {
      console.warn(`API.Bible error for ${reference}:`, error);
      return this.getFallbackVerse(reference, version);
    }
  }

  private async fetchVerseById(bibleId: string, verseId: string, reference: string, parsed: { book: string; chapter: number; verse: number }): Promise<BibleVerse | null> {
    try {
      const verseUrl = `${this.baseUrl}/bibles/${bibleId}/verses/${verseId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`;
      
      const verseResponse = await fetch(verseUrl, {
        headers: {
          'api-key': this.apiKey,
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!verseResponse.ok) {
        return null;
      }

      const verseData = await verseResponse.json();
      
      if (!verseData.data?.content) {
        return null;
      }

      return {
        reference: reference,
        text: verseData.data.content.trim(),
        book: parsed.book,
        chapter: parsed.chapter,
        verse: parsed.verse.toString(),
        version: this.displayNames[bibleId] || 'King James Version'
      };
    } catch (error) {
      return null;
    }
  }

  private buildVerseId(book: string, chapter: number, verse: number): string | null {
    // Map common book names to API.Bible book IDs
    const bookMap: Record<string, string> = {
      'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
      'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
      '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
      'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalm': 'PSA', 'Psalms': 'PSA',
      'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
      'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
      'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
      'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP', 'Haggai': 'HAG',
      'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK',
      'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
      'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
      '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
      'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE',
      '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD',
      'Revelation': 'REV'
    };

    const bookCode = bookMap[book];
    if (!bookCode) return null;

    return `${bookCode}.${chapter}.${verse}`;
  }

  private stripHtmlTags(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  private async getVerseFromFreeAPI(reference: string, version?: string): Promise<BibleVerse | null> {
    try {
      // Fallback to the previous free API implementation
      const apiReference = this.formatReferenceForAPI(reference);
      const apiVersion = version === 'kjv' ? 'kjv' : 'web';
      const url = `https://bible-api.com/${apiReference}?translation=${apiVersion}`;
      
      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        return this.getFallbackVerse(reference, version);
      }

      const data: SimpleBibleResponse = await response.json();
      
      if (!data.verses || data.verses.length === 0) {
        return this.getFallbackVerse(reference, version);
      }

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
        version: data.translation_name || (apiVersion === 'kjv' ? 'King James Version' : 'World English Bible')
      };

    } catch (error) {
      console.warn(`Free API error for ${reference}:`, error);
      return this.getFallbackVerse(reference, version);
    }
  }

  private parseReference(reference: string): { book: string; chapter: number; verse: number } | null {
    try {
      // Handle references like "John 3:16", "2 Corinthians 5:9", "1 Kings 2:3"
      const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-\d+)?$/);
      if (!match) return null;

      const book = match[1].trim();
      const chapter = parseInt(match[2]);
      const verse = parseInt(match[3]); // Take first verse if range

      return { book, chapter, verse };
    } catch (error) {
      console.warn('Error parsing reference:', reference, error);
      return null;
    }
  }

  private formatReferenceForAPI(reference: string): string {
    // Convert "John 3:16" to "john+3:16" for free API
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
      if (version && this.apiKey) {
        const bibleId = this.versionMap[version] || this.versionMap['kjv'];
        verse.version = this.displayNames[bibleId] || 'King James Version';
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