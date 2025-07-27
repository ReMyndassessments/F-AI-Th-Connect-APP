import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Book, Copy, Search, ArrowLeft, Home } from 'lucide-react';
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

export default function BibleLookup() {
  const [reference, setReference] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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

  const handleSearch = () => {
    if (reference.trim()) {
      setSearchTrigger(reference.trim());
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Bible Lookup
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Fast verse lookup for Bible studies and ministry
            </p>
          </div>

          {/* Search Input */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Enter Bible Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g., John 3:16, Psalm 23:1-3, Romans 8:28"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-lg"
                  autoFocus
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading || !reference.trim()}
                  className="px-6"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Buttons */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Popular Verses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {quickVerses.map((quickRef) => (
                  <Button
                    key={quickRef}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReference(quickRef);
                      setSearchTrigger(quickRef);
                    }}
                    className="text-xs justify-start"
                  >
                    {quickRef}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {isLoading && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Looking up verse...</span>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="py-6">
                <div className="text-center text-red-600 dark:text-red-400">
                  <p className="font-semibold">Verse not found</p>
                  <p className="text-sm mt-1">Please check the reference format and try again</p>
                </div>
              </CardContent>
            </Card>
          )}

          {verse && !isLoading && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-green-700 dark:text-green-300">
                    {verse.reference}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{verse.version}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyVerse}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 italic border-l-4 border-green-500 pl-4 mb-4">
                  "{verse.text}"
                </blockquote>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {verse.book} {verse.chapter}:{verse.verse} - {verse.version}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
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