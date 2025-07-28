import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Book, Copy, Search, ArrowLeft, History, Clock, Bookmark, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface BibleVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: string;
  version: string;
}

// Bible books for autocomplete
const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah',
  'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
  'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

// Bible versions available
const BIBLE_VERSIONS = [
  { value: 'kjv', label: 'King James Version (KJV)' },
  { value: 'niv', label: 'New International Version (NIV)' },
  { value: 'esv', label: 'English Standard Version (ESV)' },
  { value: 'nlt', label: 'New Living Translation (NLT)' },
  { value: 'nasb', label: 'New American Standard Bible (NASB)' }
];

export default function BibleLookup() {
  const [reference, setReference] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Dropdown states
  const [selectedVersion, setSelectedVersion] = useState('kjv');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('bible-recent-searches');
    if (saved) setRecentSearches(JSON.parse(saved));
    
    const savedFavorites = localStorage.getItem('bible-favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!reference || reference.length < 2) return [];
    
    const input = reference.toLowerCase();
    const bookSuggestions = BIBLE_BOOKS.filter(book => 
      book.toLowerCase().includes(input)
    ).slice(0, 8);
    
    // Add common chapter:verse patterns for matched books
    const withChapters = bookSuggestions.flatMap(book => {
      const suggestions = [book];
      if (book.toLowerCase().startsWith(input)) {
        suggestions.push(`${book} 1:1`, `${book} 1`);
      }
      return suggestions;
    }).slice(0, 6);
    
    return withChapters;
  }, [reference]);

  // Query for Bible verse
  const { data: verse, isLoading, error } = useQuery({
    queryKey: ['/api/bible/verse', searchTrigger],
    queryFn: async () => {
      if (!searchTrigger) throw new Error('No search trigger');
      const response = await apiRequest(`/api/bible/verse/${encodeURIComponent(searchTrigger)}`);
      return response as BibleVerse;
    },
    enabled: !!searchTrigger,
    retry: false
  });

  const handleSearch = (searchRef?: string) => {
    const refToSearch = searchRef || reference;
    if (refToSearch.trim()) {
      const cleanRef = refToSearch.trim();
      setSearchTrigger(cleanRef);
      setReference(cleanRef);
      setShowSuggestions(false);
      
      // Add to recent searches
      const newRecent = [cleanRef, ...recentSearches.filter(r => r !== cleanRef)].slice(0, 10);
      setRecentSearches(newRecent);
      localStorage.setItem('bible-recent-searches', JSON.stringify(newRecent));
    }
  };

  const toggleFavorite = (ref: string) => {
    const newFavorites = favorites.includes(ref) 
      ? favorites.filter(f => f !== ref)
      : [ref, ...favorites].slice(0, 20);
    
    setFavorites(newFavorites);
    localStorage.setItem('bible-favorites', JSON.stringify(newFavorites));
    
    toast({
      description: favorites.includes(ref) 
        ? "Removed from favorites" 
        : "Added to favorites"
    });
  };

  const selectSuggestion = (suggestion: string) => {
    setReference(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  // Generate chapter numbers based on selected book
  const availableChapters = useMemo(() => {
    if (!selectedBook) return [];
    
    // Common chapter counts for Bible books (simplified version)
    const chapterCounts: { [key: string]: number } = {
      'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
      'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
      '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36, 'Ezra': 10,
      'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150, 'Proverbs': 31,
      'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66, 'Jeremiah': 52, 'Lamentations': 5,
      'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14, 'Joel': 3, 'Amos': 9, 'Obadiah': 1,
      'Jonah': 4, 'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2,
      'Zechariah': 14, 'Malachi': 4, 'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21,
      'Acts': 28, 'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6,
      'Ephesians': 6, 'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
      '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13, 'James': 5,
      '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22
    };
    
    const count = chapterCounts[selectedBook] || 1;
    return Array.from({ length: count }, (_, i) => (i + 1).toString());
  }, [selectedBook]);

  // Generate verse numbers (simplified - using max 50 for most chapters)
  const availableVerses = useMemo(() => {
    if (!selectedChapter) return [];
    // Simplified verse count - in real implementation, this would be more accurate
    const maxVerses = selectedBook === 'Psalms' && selectedChapter === '119' ? 176 : 50;
    return Array.from({ length: maxVerses }, (_, i) => (i + 1).toString());
  }, [selectedBook, selectedChapter]);

  // Handle dropdown-based search
  const handleDropdownSearch = () => {
    if (selectedBook && selectedChapter) {
      const reference = selectedVerse && selectedVerse !== 'all'
        ? `${selectedBook} ${selectedChapter}:${selectedVerse}`
        : `${selectedBook} ${selectedChapter}`;
      handleSearch(reference);
    }
  };

  // Reset dependent dropdowns when parent changes
  const handleBookChange = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter('');
    setSelectedVerse('');
  };

  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(chapter);
    setSelectedVerse('all');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const copyVerse = () => {
    if (verse) {
      const textToCopy = `${verse.reference}\n"${verse.text}"\n- ${verse.version}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Bible verse copied successfully",
        });
      });
    }
  };

  const quickVerses = [
    'John 3:16', 'Romans 8:28', 'Philippians 4:13', 'Jeremiah 29:11',
    'Psalm 23:1', 'Matthew 28:19', '1 Corinthians 13:4', 'Joshua 1:9',
    'Proverbs 3:5-6', 'Isaiah 40:31', '2 Corinthians 5:17', 'Ephesians 2:8-9'
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-4xl mx-auto">
          
          {/* Back to Home Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="text-gray-900 dark:text-white">Quick </span>
              <span className="faith-gradient-text">Bible Lookup</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 px-2">
              Fast verse lookup for Bible studies and ministry
            </p>
          </div>

          {/* Search Input with Autocomplete */}
          <Card className="mb-6 faith-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Book className="h-5 w-5 text-blue-600" />
                Enter Bible Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      placeholder="e.g., John 3:16, Psalm 23:1-3, Romans 8:28"
                      value={reference}
                      onChange={(e) => {
                        setReference(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      className="text-lg"
                      autoFocus
                    />
                    
                    {/* Autocomplete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => selectSuggestion(suggestion)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <span className="text-sm text-gray-900 dark:text-white">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleSearch()} 
                    disabled={isLoading || !reference.trim()}
                    className="faith-button-primary w-full sm:w-auto px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Searches and Favorites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <Card className="faith-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <History className="h-4 w-4 text-blue-600" />
                      Recent Searches
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        localStorage.removeItem('bible-recent-searches');
                        setRecentSearches([]);
                      }}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Clear recent searches"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentSearches.slice(0, 5).map((recent, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSearch(recent)}
                        className="w-full justify-start text-xs"
                      >
                        <Clock className="h-3 w-3 mr-2" />
                        {recent}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Favorites */}
            {favorites.length > 0 && (
              <Card className="faith-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                    <Bookmark className="h-4 w-4 text-amber-600" />
                    Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {favorites.slice(0, 5).map((favorite, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSearch(favorite)}
                        className="w-full justify-start text-xs"
                      >
                        <Bookmark className="h-3 w-3 mr-2 fill-current" />
                        {favorite}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Dropdown Selection System */}
          <Card className="mb-6 faith-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Book className="h-5 w-5 text-blue-600" />
                Quick Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                {/* Version Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Version</label>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      {BIBLE_VERSIONS.map((version) => (
                        <SelectItem key={version.value} value={version.value}>
                          {version.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Book Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Book</label>
                  <Select value={selectedBook} onValueChange={handleBookChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select book" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {BIBLE_BOOKS.map((book) => (
                        <SelectItem key={book} value={book}>
                          {book}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Chapter Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Chapter</label>
                  <Select 
                    value={selectedChapter} 
                    onValueChange={handleChapterChange}
                    disabled={!selectedBook}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {availableChapters.map((chapter) => (
                        <SelectItem key={chapter} value={chapter}>
                          Chapter {chapter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Verse Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Verse (Optional)</label>
                  <Select 
                    value={selectedVerse} 
                    onValueChange={setSelectedVerse}
                    disabled={!selectedChapter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select verse" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="all">Entire Chapter</SelectItem>
                      {availableVerses.map((verse) => (
                        <SelectItem key={verse} value={verse}>
                          Verse {verse}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lookup Button */}
              <Button 
                onClick={handleDropdownSearch}
                disabled={!selectedBook || !selectedChapter || isLoading}
                className="faith-button-primary w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Look Up Verse
              </Button>
              
              {/* Popular Verses Quick Access */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Popular Verses (Quick Access)</h4>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {quickVerses.map((quickRef) => (
                    <Button
                      key={quickRef}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(quickRef)}
                      className="text-xs justify-start h-8"
                    >
                      {quickRef}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {isLoading && (
            <Card className="faith-card">
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">Looking up verse...</span>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="faith-card border-red-200 dark:border-red-800">
              <CardContent className="py-6">
                <div className="text-center text-red-600 dark:text-red-400">
                  <p className="font-semibold">Verse not found</p>
                  <p className="text-sm mt-1">Please check the reference format and try again</p>
                </div>
              </CardContent>
            </Card>
          )}

          {verse && !isLoading && (
            <Card className="faith-card border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
                    {verse.reference}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{verse.version}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(verse.reference)}
                      className="flex items-center gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Bookmark className={`h-3 w-3 ${favorites.includes(verse.reference) ? 'fill-current' : ''}`} />
                      {favorites.includes(verse.reference) ? 'Favorited' : 'Favorite'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyVerse}
                      className="flex items-center gap-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                  <blockquote className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 italic font-serif border-l-4 border-blue-500 pl-4 mb-4">
                    "{verse.text}"
                  </blockquote>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {verse.book} {verse.chapter}:{verse.verse} - {verse.version}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Tips */}
          <Card className="mt-6 sm:mt-8 faith-card">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Supported Formats:</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Single verses: "John 3:16"</li>
                    <li>• Verse ranges: "Psalm 23:1-3"</li>
                    <li>• Numbered books: "1 Corinthians 13:4"</li>
                    <li>• Multiple formats: "1Cor 13:4" or "1 Cor 13:4"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Bible Study Tips:</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Use Enter key for quick search</li>
                    <li>• Click popular verses for instant access</li>
                    <li>• Copy button includes reference and translation</li>
                    <li>• Works with all 66 books of the Bible</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}