import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Highlighter, Palette, Bookmark, Heart, Star, MessageCircle, Download, Printer, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MarkdownRenderer from "./markdown-renderer";

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
  sessionId: string;
}

const HIGHLIGHT_CATEGORIES = [
  { name: "Key Verse", color: "bg-yellow-200 border-yellow-300", icon: Star, description: "Important Scripture" },
  { name: "Prayer Point", color: "bg-blue-200 border-blue-300", icon: Heart, description: "Prayer requests/topics" },
  { name: "Study Note", color: "bg-green-200 border-green-300", icon: Bookmark, description: "Study insights" },
  { name: "Action Item", color: "bg-orange-200 border-orange-300", icon: MessageCircle, description: "Things to do/apply" },
  { name: "Discussion", color: "bg-purple-200 border-purple-300", icon: Palette, description: "Group discussion points" },
];

export default function TextHighlighter({ content, messageId, sessionId }: TextHighlighterProps) {
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if clickable Bible links feature is enabled
  const { data: featureFlags } = useQuery({
    queryKey: ["/api/feature-flags/public"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  const bibleLinkEnabled = (featureFlags as any)?.flags?.find((flag: any) => flag.name === 'clickable_bible_links')?.enabled || false;
  
  // console.log('Bible Links Debug:', bibleLinkEnabled);

  // Load highlights from localStorage on component mount (session-specific)
  useEffect(() => {
    const savedHighlights = localStorage.getItem(`highlights-${sessionId}-${messageId}`);
    if (savedHighlights) {
      setHighlights(JSON.parse(savedHighlights));
    }
  }, [sessionId, messageId]);

  // Save highlights to localStorage whenever highlights change (session-specific)
  useEffect(() => {
    if (highlights.length > 0) {
      localStorage.setItem(`highlights-${sessionId}-${messageId}`, JSON.stringify(highlights));
    } else {
      // Clean up localStorage when no highlights remain
      localStorage.removeItem(`highlights-${sessionId}-${messageId}`);
    }
  }, [highlights, sessionId, messageId]);

  const handleTextSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0);
        const contentElement = contentRef.current;
        
        if (contentElement && contentElement.contains(range.commonAncestorContainer)) {
          const selectedText = selection.toString().trim();
          const startPos = content.indexOf(selectedText);
          
          if (startPos !== -1) {
            setSelectedText(selectedText);
            setSelectionRange({ start: startPos, end: startPos + selectedText.length });
            setShowPopover(true);
          }
        }
      }
    }, 10);
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
    if (highlights.length === 0) {
      alert('No highlights found to export. Please highlight some text first.');
      return;
    }
    
    console.log('Exporting highlights:', highlights); // Debug log
    
    // Create formatted text with highlights marked
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    let formattedContent = "";
    let lastIndex = 0;

    sortedHighlights.forEach((highlight) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        formattedContent += content.slice(lastIndex, highlight.start);
      }
      
      // Add highlighted text with category marker
      formattedContent += `**[${highlight.category.toUpperCase()}]** ${highlight.text} **[/${highlight.category.toUpperCase()}]**`;
      
      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      formattedContent += content.slice(lastIndex);
    }
    
    // Create a readable text format
    const readableContent = `
F-AI-TH-CONNECT BIBLE STUDY NOTES
==================================
Export Date: ${new Date().toLocaleDateString()}
Message ID: ${messageId}
Total Highlights: ${highlights.length}

ORIGINAL AI RESPONSE:
${content}

HIGHLIGHTED VERSION:
${formattedContent}

HIGHLIGHT SUMMARY:
${HIGHLIGHT_CATEGORIES.map(cat => {
  const catHighlights = highlights.filter(h => h.color === cat.color);
  if (catHighlights.length === 0) return '';
  return `
${cat.name.toUpperCase()} (${catHighlights.length} items):
${catHighlights.map(h => `  • ${h.text}`).join('\n')}`;
}).filter(section => section !== '').join('\n')}

DETAILED HIGHLIGHTS:
${highlights.map((h, index) => `${index + 1}. [${h.category}] "${h.text}"`).join('\n')}
    `;
    
    // Export as text file for easier reading
    const blob = new Blob([readableContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bible-study-notes-${sessionId}-msg${messageId}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportForPrinting = () => {
    if (highlights.length === 0) {
      alert('No highlights found to print. Please highlight some text first.');
      return;
    }

    // Show instruction for enabling background colors
    alert('📄 For colored highlights in print:\n\n1. In the print dialog, click "More settings"\n2. Enable "Background graphics" or "Print backgrounds"\n3. This will show the highlight colors when printing');
    
    // Create HTML version with colored highlights for printing
    // Clean up excessive whitespace and normalize content
    let htmlContent = content.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
    
    // Sort highlights by start position (descending) to avoid index issues
    const sortedHighlights = [...highlights].sort((a, b) => b.start - a.start);
    
    // Add HTML spans with colored backgrounds
    sortedHighlights.forEach(highlight => {
      const category = HIGHLIGHT_CATEGORIES.find(c => c.color === highlight.color);
      const before = htmlContent.slice(0, highlight.start);
      const highlightedText = htmlContent.slice(highlight.start, highlight.end);
      const after = htmlContent.slice(highlight.end);
      
      // Use CSS classes like the working blue headings
      const colorClasses = {
        'bg-yellow-200 border-yellow-300': 'highlight-yellow',
        'bg-blue-200 border-blue-300': 'highlight-blue',
        'bg-green-200 border-green-300': 'highlight-green',
        'bg-purple-200 border-purple-300': 'highlight-purple',
        'bg-orange-200 border-orange-300': 'highlight-orange'
      };
      
      const cssClass = colorClasses[highlight.color as keyof typeof colorClasses] || 'highlight-blue';
      const categoryLabel = category ? `[${category.name.toUpperCase()}] ` : '[HIGHLIGHT] ';
      
      // Use CSS classes exactly like the working blue headings
      htmlContent = `${before}<span class="${cssClass}" title="${category?.name || 'Highlight'}">${categoryLabel}${highlightedText}</span>${after}`;
    });

    const printableHTML = `<!DOCTYPE html>
<html>
<head>
    <title>F-AI-TH-Connect Bible Study Notes</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.3; 
            color: #333;
            margin: 0;
            padding: 12px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .highlight-yellow { color: #eab308; font-weight: 900; }
        .highlight-blue { color: #3b82f6; font-weight: 900; }
        .highlight-green { color: #22c55e; font-weight: 900; }
        .highlight-purple { color: #a855f7; font-weight: 900; }
        .highlight-orange { color: #f97316; font-weight: 900; }
        h2 { color: #1e40af; margin: 8px 0; font-size: 16px; }
        h3 { color: #1e40af; margin: 6px 0; font-size: 14px; border-left: 3px solid #3b82f6; padding-left: 8px; }
        .content-box { 
            padding: 8px;
            background: #fafafa !important;
            border: 1px solid #ddd !important;
            margin: 6px 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .legend-box { 
            background: #f8fafc !important;
            border: 1px solid #ddd !important;
            padding: 6px;
            margin: 6px 0;
            font-size: 12px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        ul { margin: 4px 0; padding-left: 16px; }
        li { margin: 2px 0; }
        p { margin: 4px 0; }
    </style>
</head>
<body>
    <h2>F-AI-TH-Connect Bible Study Notes</h2>
    <p style="color: #6b7280; font-size: 12px;">Generated: ${new Date().toLocaleDateString()} • Highlights: ${highlights.length}</p>
    
    <div class="legend-box">
        <strong>Categories:</strong><br>
        ${HIGHLIGHT_CATEGORIES.map(cat => {
          const colorMap = {
            'bg-yellow-200 border-yellow-300': '#eab308',
            'bg-blue-200 border-blue-300': '#3b82f6', 
            'bg-green-200 border-green-300': '#22c55e',
            'bg-purple-200 border-purple-300': '#a855f7',
            'bg-orange-200 border-orange-300': '#f97316'
          };
          const color = colorMap[cat.color as keyof typeof colorMap] || '#6b7280';
          return `<span style="color: ${color}; font-weight: 900;">■ [${cat.name.toUpperCase()}] ${cat.name}</span><br>`;
        }).join('')}
    </div>

    <h3>AI Response with Highlights</h3>
    <div class="content-box">${htmlContent.replace(/\n/g, '<br>')}</div>

    ${HIGHLIGHT_CATEGORIES.map(cat => {
      const catHighlights = highlights.filter(h => h.color === cat.color);
      if (catHighlights.length === 0) return '';
      const colorMap = {
        'bg-yellow-200 border-yellow-300': '#eab308',
        'bg-blue-200 border-blue-300': '#3b82f6', 
        'bg-green-200 border-green-300': '#22c55e',
        'bg-purple-200 border-purple-300': '#a855f7',
        'bg-orange-200 border-orange-300': '#f97316'
      };
      const color = colorMap[cat.color as keyof typeof colorMap] || '#6b7280';
      return `<h3 style="color: ${color};">${cat.name} (${catHighlights.length})</h3>
        <div class="content-box">
          <ul>${catHighlights.map(h => `<li>"${h.text}"</li>`).join('')}</ul>
        </div>`;
    }).filter(section => section !== '').join('')}

</body>
</html>`;

    // Create and open HTML in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printableHTML);
      printWindow.document.close();
      
      // Auto-focus and show print dialog after a brief delay
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="relative">
      <div 
        ref={contentRef}
        className="text-sm text-gray-900 whitespace-pre-wrap mb-2 select-text cursor-text leading-relaxed"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      >
        {highlights.length === 0 ? (
          <MarkdownRenderer content={content} enableBibleLinks={bibleLinkEnabled} />
        ) : (
          renderHighlightedContent()
        )}
      </div>
      
      {/* Show highlighting toolbar when text is selected */}
      {selectedText && showPopover && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Highlighter className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Highlight for Bible Study</span>
            </div>
            <button
              onClick={() => setShowPopover(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
              data-testid="button-close-highlight-modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Selected: "{selectedText.slice(0, 40)}{selectedText.length > 40 ? '...' : ''}"
          </p>
          <div className="flex flex-wrap gap-2">
            {HIGHLIGHT_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant="outline"
                  size="sm"
                  onClick={() => addHighlight(category.name, category.color)}
                  className="text-xs h-8"
                  title={category.description}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      
      {highlights.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Study Highlights ({highlights.length})</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportHighlights}
                className="text-xs"
                title="Download as text file"
              >
                <Download className="w-3 h-3 mr-1" />
                Export Notes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportForPrinting}
                className="text-xs"
                title="Print with colored highlights"
              >
                <Printer className="w-3 h-3 mr-1" />
                Print
              </Button>
            </div>
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
    </div>
  );
}