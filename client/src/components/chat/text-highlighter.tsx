import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Highlighter, Palette, Bookmark, Heart, Star, MessageCircle } from "lucide-react";

interface HighlightData {
  id: string;
  start: number;
  end: number;
  color: string;
  category: string;
  text: string;
}

interface TextHighlighterProps {
  content: string;
  messageId: number;
}

const HIGHLIGHT_CATEGORIES = [
  { name: "Key Verse", color: "bg-yellow-200 border-yellow-300", icon: Star, description: "Important Scripture" },
  { name: "Prayer Point", color: "bg-blue-200 border-blue-300", icon: Heart, description: "Prayer requests/topics" },
  { name: "Study Note", color: "bg-green-200 border-green-300", icon: Bookmark, description: "Study insights" },
  { name: "Action Item", color: "bg-orange-200 border-orange-300", icon: MessageCircle, description: "Things to do/apply" },
  { name: "Discussion", color: "bg-purple-200 border-purple-300", icon: Palette, description: "Group discussion points" },
];

export default function TextHighlighter({ content, messageId }: TextHighlighterProps) {
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load highlights from localStorage on component mount
  useEffect(() => {
    const savedHighlights = localStorage.getItem(`highlights-${messageId}`);
    if (savedHighlights) {
      setHighlights(JSON.parse(savedHighlights));
    }
  }, [messageId]);

  // Save highlights to localStorage whenever highlights change
  useEffect(() => {
    if (highlights.length > 0) {
      localStorage.setItem(`highlights-${messageId}`, JSON.stringify(highlights));
    }
  }, [highlights, messageId]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const contentElement = contentRef.current;
      
      if (contentElement && contentElement.contains(range.commonAncestorContainer)) {
        // Calculate text positions relative to the content
        const tempElement = document.createElement('div');
        tempElement.innerHTML = content;
        const textContent = tempElement.textContent || '';
        
        const selectedText = selection.toString();
        const startPos = textContent.indexOf(selectedText);
        
        if (startPos !== -1) {
          setSelectedText(selectedText);
          setSelectionRange({ start: startPos, end: startPos + selectedText.length });
          setShowPopover(true);
        }
      }
    }
  };

  const addHighlight = (category: string, color: string) => {
    if (selectionRange && selectedText) {
      const newHighlight: HighlightData = {
        id: Date.now().toString(),
        start: selectionRange.start,
        end: selectionRange.end,
        color,
        category,
        text: selectedText,
      };
      
      setHighlights(prev => [...prev, newHighlight]);
      setShowPopover(false);
      setSelectedText("");
      setSelectionRange(null);
      
      // Clear selection
      window.getSelection()?.removeAllRanges();
    }
  };

  const removeHighlight = (highlightId: string) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
  };

  const renderHighlightedContent = () => {
    if (highlights.length === 0) {
      return content;
    }

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    
    let result = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        result.push(content.slice(lastIndex, highlight.start));
      }
      
      // Add highlighted text
      const category = HIGHLIGHT_CATEGORIES.find(cat => cat.color === highlight.color);
      result.push(
        <span
          key={highlight.id}
          className={`${highlight.color} px-1 rounded border cursor-pointer relative group`}
          title={`${highlight.category}: ${highlight.text}`}
          onClick={() => removeHighlight(highlight.id)}
        >
          {highlight.text}
          <span className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            {highlight.category} (click to remove)
          </span>
        </span>
      );
      
      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      result.push(content.slice(lastIndex));
    }

    return result;
  };

  const exportHighlights = () => {
    if (highlights.length === 0) return;
    
    const exportData = {
      messageId,
      content,
      highlights: highlights.map(h => ({
        text: h.text,
        category: h.category,
        note: `${h.category}: "${h.text}"`
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bible-study-highlights-${messageId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <div 
        ref={contentRef}
        className="text-sm text-gray-900 whitespace-pre-wrap mb-2 select-text cursor-text leading-relaxed"
        onMouseUp={handleTextSelection}
      >
        {renderHighlightedContent()}
      </div>
      
      {highlights.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Study Highlights ({highlights.length})</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={exportHighlights}
              className="text-xs"
            >
              Export Study Notes
            </Button>
          </div>
          <div className="space-y-1">
            {HIGHLIGHT_CATEGORIES.map(category => {
              const categoryHighlights = highlights.filter(h => h.color === category.color);
              if (categoryHighlights.length === 0) return null;
              
              const Icon = category.icon;
              return (
                <div key={category.name} className="flex items-center text-xs text-gray-600">
                  <Icon className="w-3 h-3 mr-1" />
                  <span className={`px-2 py-0.5 rounded ${category.color} mr-2`}>
                    {category.name}
                  </span>
                  <span>{categoryHighlights.length} item(s)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
          <div className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Highlighter className="w-4 h-4 text-blue-500" />
              <h3 className="font-medium text-sm">Highlight for Bible Study</h3>
            </div>
            <p className="text-xs text-gray-600">
              Selected: "{selectedText.slice(0, 50)}{selectedText.length > 50 ? '...' : ''}"
            </p>
            <div className="grid grid-cols-1 gap-2">
              {HIGHLIGHT_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.name}
                    variant="outline"
                    size="sm"
                    onClick={() => addHighlight(category.name, category.color)}
                    className="justify-start text-left h-auto p-2"
                  >
                    <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-xs">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}