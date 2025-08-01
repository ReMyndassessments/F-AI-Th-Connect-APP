import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface SpellCheckResult {
  word: string;
  isCorrect: boolean;
  suggestions: string[];
  confidence: number;
}

interface PredictiveTextResult {
  suggestions: string[];
  source: 'biblical' | 'common' | 'mixed';
}

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (value: string) => void;
  enableSpellCheck?: boolean;
  enablePredictiveText?: boolean;
  className?: string;
  placeholder?: string;
}

export function EnhancedInput({
  value,
  onValueChange,
  enableSpellCheck = true,
  enablePredictiveText = true,
  className,
  placeholder,
  ...props
}: EnhancedInputProps) {
  const [spellCheckResults, setSpellCheckResults] = useState<SpellCheckResult[]>([]);
  const [predictiveOptions, setPredictiveOptions] = useState<string[]>([]);
  const [showPredictive, setShowPredictive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced spell check
  useEffect(() => {
    if (!enableSpellCheck || !value.trim()) {
      setSpellCheckResults([]);
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsChecking(true);
      try {
        const results = await apiRequest('/api/spell-check', {
          method: 'POST',
          body: { text: value }
        });
        setSpellCheckResults(results.filter((r: SpellCheckResult) => !r.isCorrect));
      } catch (error) {
        console.error('Spell check error:', error);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [value, enableSpellCheck]);

  // Predictive text on input change
  useEffect(() => {
    if (!enablePredictiveText || !value.trim()) {
      setPredictiveOptions([]);
      setShowPredictive(false);
      return;
    }

    const words = value.split(' ');
    const currentWord = words[words.length - 1];

    if (currentWord.length < 2) {
      setPredictiveOptions([]);
      setShowPredictive(false);
      return;
    }

    const getPredictiveText = async () => {
      try {
        const result = await apiRequest('/api/predictive-text', {
          method: 'POST',
          body: { input: currentWord, limit: 5 }
        });
        setPredictiveOptions(result.suggestions);
        setShowPredictive(result.suggestions.length > 0);
      } catch (error) {
        console.error('Predictive text error:', error);
      }
    };

    getPredictiveText();
  }, [value, enablePredictiveText]);

  const applySuggestion = (suggestion: string) => {
    const words = value.split(' ');
    words[words.length - 1] = suggestion;
    const newValue = words.join(' ') + ' ';
    onValueChange(newValue);
    setShowPredictive(false);
    inputRef.current?.focus();
  };

  const applySpellCorrection = (originalWord: string, correction: string) => {
    const newValue = value.replace(new RegExp(`\\b${originalWord}\\b`, 'gi'), correction);
    onValueChange(newValue);
    setSpellCheckResults(prev => prev.filter(r => r.word !== originalWord));
  };

  const dismissSpellSuggestion = (word: string) => {
    setSpellCheckResults(prev => prev.filter(r => r.word !== word));
  };

  const hasSpellErrors = spellCheckResults.length > 0;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={cn(
            className,
            hasSpellErrors && "border-yellow-500 focus:border-yellow-600",
            isChecking && "border-blue-500"
          )}
          placeholder={placeholder}
          {...props}
        />
        
        {isChecking && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Predictive text dropdown */}
      {showPredictive && predictiveOptions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-auto">
          <CardContent className="p-2">
            <div className="space-y-1">
              {predictiveOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-8"
                  onClick={() => applySuggestion(option)}
                >
                  <span className="text-sm">{option}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spell check suggestions */}
      {hasSpellErrors && (
        <div className="mt-2 space-y-2">
          {spellCheckResults.map((result, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                "{result.word}"
              </span>
              {result.suggestions.length > 0 && (
                <>
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">→</span>
                  <div className="flex gap-1 flex-wrap">
                    {result.suggestions.slice(0, 3).map((suggestion, suggIndex) => (
                      <Badge
                        key={suggIndex}
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        onClick={() => applySpellCorrection(result.word, suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0"
                onClick={() => dismissSpellSuggestion(result.word)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}