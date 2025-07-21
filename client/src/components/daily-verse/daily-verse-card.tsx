import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Copy, Share2 } from "lucide-react";
import { getTodaysVerse, getFormattedDate } from "@/lib/daily-verses";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DailyVerseCardProps {
  variant?: "default" | "compact" | "banner";
  className?: string;
}

export default function DailyVerseCard({ variant = "default", className = "" }: DailyVerseCardProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const todaysVerse = getTodaysVerse();
  const todayDate = getFormattedDate();

  const handleCopyVerse = async () => {
    const verseText = `"${todaysVerse.text}" - ${todaysVerse.reference}`;
    try {
      await navigator.clipboard.writeText(verseText);
      toast({
        title: "Verse copied!",
        description: "Today's memory verse has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy verse to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleShareVerse = async () => {
    const verseText = `Today's Memory Verse: "${todaysVerse.text}" - ${todaysVerse.reference}`;
    
    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: "Daily Memory Verse",
          text: verseText,
          url: window.location.origin,
        });
      } catch (error) {
        // User cancelled sharing
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback to clipboard
      await handleCopyVerse();
    }
  };

  if (variant === "compact") {
    return (
      <Card className={`border-blue-100 bg-gradient-to-r from-blue-50 to-amber-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs bg-white border-blue-200 text-blue-700">
                  Today's Verse
                </Badge>
              </div>
              <blockquote className="text-sm text-gray-700 italic mb-2 line-clamp-2">
                "{todaysVerse.text}"
              </blockquote>
              <p className="text-xs font-medium text-blue-600">
                {todaysVerse.reference}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-amber-600 text-white py-8 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">{todayDate}</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Today's Memory Verse</h3>
          <blockquote className="text-lg md:text-xl italic mb-4 max-w-3xl mx-auto">
            "{todaysVerse.text}"
          </blockquote>
          <p className="text-base font-medium mb-4">
            {todaysVerse.reference}
          </p>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {todaysVerse.theme}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-blue-100 bg-gradient-to-br from-blue-50 via-white to-amber-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Memory Verse</h3>
              <p className="text-sm text-gray-600">{todayDate}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
            {todaysVerse.theme}
          </Badge>
        </div>

        <blockquote className="text-gray-700 text-lg italic mb-4 leading-relaxed">
          "{todaysVerse.text}"
        </blockquote>

        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-blue-600">
            {todaysVerse.reference}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyVerse}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareVerse}
              disabled={isSharing}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-100">
          <p className="text-xs text-gray-500 text-center">
            Memory verses change daily • Meditate on God's Word
          </p>
        </div>
      </CardContent>
    </Card>
  );
}