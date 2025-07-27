import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Book, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface BibleVerseResult {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: string;
  version: string;
}

export default function BibleDemo() {
  const [reference, setReference] = useState('John 3:16');
  const [results, setResults] = useState<{
    current?: BibleVerseResult | null;
    simple?: BibleVerseResult | null;
    external?: any;
    loading: boolean;
  }>({ loading: false });

  const testAllAPIs = async () => {
    setResults({ loading: true });
    
    try {
      // Test current API.Bible service
      const currentResponse = await fetch(`/api/bible/verse/${encodeURIComponent(reference)}`);
      const currentResult = currentResponse.ok ? await currentResponse.json() : null;

      // Test direct bible-api.com call
      const externalResponse = await fetch(`https://bible-api.com/${reference.toLowerCase().replace(/\s+/g, '+')}`);
      const externalResult = externalResponse.ok ? await externalResponse.json() : null;

      setResults({
        current: currentResult,
        simple: null, // We'll implement this after showing the comparison
        external: externalResult,
        loading: false
      });
    } catch (error) {
      console.error('Error testing APIs:', error);
      setResults({ loading: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bible API Comparison Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Compare different Bible verse lookup implementations for F-AI-TH-Connect
            </p>
            
            {/* Test Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Input
                placeholder="Enter verse reference..."
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={testAllAPIs} 
                disabled={results.loading}
                className="flex items-center gap-2"
              >
                {results.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Book className="h-4 w-4" />
                )}
                Test All APIs
              </Button>
            </div>
          </div>

          {/* API Comparison Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Current API.Bible Implementation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {results.current ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : results.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Current API.Bible
                </CardTitle>
                <CardDescription>
                  Your existing implementation with fallback system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Requires API Key</Badge>
                    <Badge variant="secondary">Has Fallback</Badge>
                    <Badge variant="destructive">API Key Missing</Badge>
                  </div>
                  
                  {results.current ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">{results.current.reference}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                        "{results.current.text}"
                      </p>
                      <p className="text-xs text-gray-500">
                        Version: {results.current.version}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {results.loading ? 'Testing...' : 'Using fallback verses (API key required)'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* bible-api.com Direct */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {results.external ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : results.loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  bible-api.com
                  <ExternalLink className="h-4 w-4" />
                </CardTitle>
                <CardDescription>
                  Free public API, no key required
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Free</Badge>
                    <Badge variant="secondary">No API Key</Badge>
                    <Badge variant="outline">Public Domain</Badge>
                  </div>
                  
                  {results.external ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">{results.external.reference}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                        "{results.external.text?.trim()}"
                      </p>
                      <p className="text-xs text-gray-500">
                        Version: {results.external.translation_name}
                      </p>
                      {results.external.verses?.length > 1 && (
                        <p className="text-xs text-blue-600">
                          Contains {results.external.verses.length} verses
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {results.loading ? 'Testing...' : 'Click test to see results'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Proposed Implementation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-500" />
                  Proposed Solution
                </CardTitle>
                <CardDescription>
                  Hybrid approach with multiple options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Best of Both</Badge>
                    <Badge variant="secondary">Reliable</Badge>
                    <Badge variant="outline">Future-Ready</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p>✅ <strong>Primary:</strong> bible-api.com (free, no key)</p>
                    <p>✅ <strong>Backup:</strong> API.Bible (with key)</p>
                    <p>✅ <strong>Fallback:</strong> Local verses</p>
                    <p>✅ <strong>Features:</strong> Verse ranges, multiple translations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Options */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Bible Verse Lookup Implementation Options</CardTitle>
              <CardDescription>
                Choose the best approach for your F-AI-TH-Connect application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Option 1 */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-green-600">Option 1: Switch to bible-api.com</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Pros:</strong></p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                      <li>No API key required - completely free</li>
                      <li>Simple URL format</li>
                      <li>Handles verse ranges automatically</li>
                      <li>Same World English Bible translation</li>
                      <li>Works immediately</li>
                    </ul>
                    <p><strong>Cons:</strong></p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                      <li>Single translation only</li>
                      <li>External dependency (but reliable)</li>
                    </ul>
                  </div>
                </div>

                {/* Option 2 */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-blue-600">Option 2: Hybrid Multi-API System</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Pros:</strong></p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                      <li>Maximum reliability with fallbacks</li>
                      <li>Multiple translation support</li>
                      <li>Works without any API keys</li>
                      <li>Graceful degradation</li>
                      <li>Future expansion ready</li>
                    </ul>
                    <p><strong>Cons:</strong></p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                      <li>More complex codebase</li>
                      <li>Slightly more maintenance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sample Verses to Test */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Try these sample verses:</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'John 3:16',
                    'Romans 8:28',
                    'Philippians 4:13',
                    'Psalm 23:1-3',
                    '2 Corinthians 5:9-10',
                    'Matthew 28:19-20',
                    'Jeremiah 29:11'
                  ].map((verse) => (
                    <Button
                      key={verse}
                      variant="outline"
                      size="sm"
                      onClick={() => setReference(verse)}
                      className="text-xs"
                    >
                      {verse}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}