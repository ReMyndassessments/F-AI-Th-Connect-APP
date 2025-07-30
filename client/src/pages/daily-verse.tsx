import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, ArrowLeft, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface DailyVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: string;
  version: string;
}

export default function DailyVerse() {
  const [, setLocation] = useLocation();
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Daily verses collection
  const dailyVerses = [
    "John 3:16", "Philippians 4:13", "Romans 8:28", "Psalm 23:1", 
    "Isaiah 40:31", "Matthew 28:19", "1 Corinthians 13:4", "Jeremiah 29:11",
    "Proverbs 3:5-6", "2 Corinthians 5:17", "Ephesians 2:8-9", "Psalm 46:1",
    "Matthew 11:28", "Romans 12:2", "1 John 4:19", "Psalm 139:14",
    "Joshua 1:9", "Galatians 2:20", "Psalm 27:1", "1 Peter 5:7",
    "Romans 15:13", "Isaiah 26:3", "Matthew 6:26", "Psalm 37:4",
    "1 Thessalonians 5:16-18", "Colossians 3:23", "Hebrews 11:1", "James 1:17",
    "Psalm 118:24", "Romans 5:8", "Matthew 5:16"
  ];

  const getTodaysVerse = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return dailyVerses[dayOfYear % dailyVerses.length];
  };

  const fetchDailyVerse = async () => {
    setIsLoading(true);
    try {
      const todaysReference = getTodaysVerse();
      const response = await fetch(`/api/bible/verse/${encodeURIComponent(todaysReference)}?version=kjv`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch verse');
      }
      
      const verse = await response.json();
      setDailyVerse(verse);
    } catch (error) {
      console.error('Error fetching daily verse:', error);
      toast({
        title: "Error",
        description: "Failed to load today's verse. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyVerse();
  }, []);

  const copyVerse = async () => {
    if (!dailyVerse) return;
    
    const text = `"${dailyVerse.text}" - ${dailyVerse.reference} (${dailyVerse.version})`;
    
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Verse copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy verse",
        variant: "destructive",
      });
    }
  };

  const shareVerse = async () => {
    if (!dailyVerse) return;
    
    const text = `"${dailyVerse.text}" - ${dailyVerse.reference} (${dailyVerse.version})\n\nShared from F-AI-TH-Connect`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Bible Verse",
          text: text,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied for sharing!",
          description: "Verse copied to clipboard for sharing",
        });
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-2xl font-bold faith-gradient-text text-center">
            Daily Verse
          </h1>
          
          <Button
            variant="ghost"
            onClick={fetchDailyVerse}
            className="text-gray-600 hover:text-blue-500"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Date Display */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            {getCurrentDate()}
          </p>
        </div>

        {/* Daily Verse Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="faith-card shadow-xl">
            <CardContent className="p-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                  <p className="text-gray-600 dark:text-gray-300">Loading today's verse...</p>
                </div>
              ) : dailyVerse ? (
                <div className="text-center space-y-6">
                  {/* Verse Text */}
                  <blockquote className="text-2xl md:text-3xl leading-relaxed text-gray-800 dark:text-gray-200 italic font-serif">
                    "{dailyVerse.text}"
                  </blockquote>
                  
                  {/* Reference */}
                  <div className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                    {dailyVerse.reference}
                  </div>
                  
                  {/* Version */}
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {dailyVerse.version}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4 pt-6">
                    <Button
                      variant="outline"
                      onClick={copyVerse}
                      className="flex items-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={shareVerse}
                      className="flex items-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300">
                    Unable to load today's verse. Please try refreshing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Widget Instructions */}
        <Card className="max-w-2xl mx-auto mt-8 faith-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              📱 Add to Home Screen
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>iOS (iPhone/iPad):</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Open this page in Safari</li>
                <li>Tap the Share button (square with arrow)</li>
                <li>Select "Add to Home Screen"</li>
                <li>Tap "Add" to create your daily verse widget</li>
              </ol>
              
              <p><strong>Android:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Open this page in Chrome</li>
                <li>Tap the menu (3 dots)</li>
                <li>Select "Add to Home screen"</li>
                <li>Tap "Add" to install the widget</li>
              </ol>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-4">
                <p className="text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Once added to your home screen, you can access daily verses instantly with just one tap!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}