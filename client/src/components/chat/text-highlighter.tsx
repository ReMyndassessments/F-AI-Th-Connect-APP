import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Highlighter, Palette, Bookmark, Heart, Star, MessageCircle, Download, Printer } from "lucide-react";

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
    let htmlContent = content;
    
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
        'bg-yellow-200': 'highlight-yellow',
        'bg-blue-200': 'highlight-blue',
        'bg-green-200': 'highlight-green',
        'bg-purple-200': 'highlight-purple',
        'bg-orange-200': 'highlight-orange'
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
        @page { 
            margin: 1in; 
            size: letter;
        }
        body { 
            font-family: Georgia, serif; 
            line-height: 1.6; 
            color: #333;
            max-width: 100%;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .header { 
            text-align: center; 
            border-bottom: 2px solid #3b82f6; 
            padding-bottom: 10px; 
            margin-bottom: 20px;
        }
        .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-weight: bold; 
            font-size: 16px; 
            margin-bottom: 10px; 
            color: #1e40af;
            border-left: 4px solid #3b82f6;
            padding-left: 10px;
        }
        .highlight-yellow { color: #eab308; font-weight: 900; text-decoration: underline; }
        .highlight-blue { color: #3b82f6; font-weight: 900; text-decoration: underline; }
        .highlight-green { color: #22c55e; font-weight: 900; text-decoration: underline; }
        .highlight-purple { color: #a855f7; font-weight: 900; text-decoration: underline; }
        .highlight-orange { color: #f97316; font-weight: 900; text-decoration: underline; }
        .content { 
            white-space: pre-wrap; 
            line-height: 1.8;
            margin-bottom: 15px;
        }
        .legend { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 15px; 
            margin: 20px 0;
            padding: 15px;
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 8px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .legend-item { 
            display: flex; 
            align-items: center; 
            gap: 8px;
        }
        .legend-color { 
            width: 20px; 
            height: 15px; 
            border-radius: 4px;
            border: 3px solid #333 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-weight: bold;
        }
        .summary { 
            background: #f8fafc !important; 
            padding: 15px; 
            border-radius: 8px;
            border: 1px solid #e2e8f0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin-top: 20px;
        }
        .summary ul { 
            margin: 10px 0; 
            padding-left: 20px;
        }
        .highlight-stats {
            text-align: center;
            font-style: italic;
            color: #6b7280;
            margin: 15px 0;
        }
        @media print {
            body { 
                font-size: 12pt; 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            .no-print { display: none; }
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                filter: opacity(1) !important;
            }
            /* Let the highlights use their natural styling like the print tip box */
            /* Browser-specific print color forcing */
            @media print and (-webkit-min-device-pixel-ratio: 0) {
                * { -webkit-print-color-adjust: exact !important; }
            }
            @media print and (min-resolution: .001dpcm) {
                * { print-color-adjust: exact !important; }
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="color: #1e40af; margin: 0;">F-AI-TH-Connect Bible Study Notes</h1>
        <p style="margin: 5px 0; color: #6b7280;">Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <div class="highlight-stats">Total Highlights: ${highlights.length}</div>
        <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 10px; margin: 10px 0; border-radius: 8px; font-size: 12px;">
            <strong>📄 Print Tip:</strong> To see colored highlights, enable "Background graphics" in your browser's print settings.
        </div>
    </div>

    <div class="legend">
        <strong>Highlight Categories:</strong>
        ${HIGHLIGHT_CATEGORIES.map(cat => {
          const colorMap = {
            'bg-yellow-200': '#eab308',
            'bg-blue-200': '#3b82f6', 
            'bg-green-200': '#22c55e',
            'bg-purple-200': '#a855f7',
            'bg-orange-200': '#f97316'
          };
          const color = colorMap[cat.color as keyof typeof colorMap] || '#6b7280';
          return `<div class="legend-item">
            <div class="legend-color" style="background-color: ${color} !important; border: 2px solid ${color} !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;"></div>
            <span style="color: ${color}; font-weight: 900;"><strong>[${cat.name.toUpperCase()}]</strong> ${cat.name}</span>
          </div>`;
        }).join('')}
    </div>

    <div class="section">
        <div class="section-title">AI Response with Highlights</div>
        <div class="content" style="padding: 15px; background: #fafafa !important; border-radius: 8px; border: 1px solid #e5e7eb !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">${htmlContent}</div>
    </div>

    <div class="section">
        <div class="section-title">Highlight Summary by Category</div>
        <div class="summary">
            ${HIGHLIGHT_CATEGORIES.map(cat => {
              const catHighlights = highlights.filter(h => h.color === cat.color);
              if (catHighlights.length === 0) return '';
              return `<div style="margin-bottom: 15px;">
                <strong>${cat.name} (${catHighlights.length} items):</strong>
                <ul>${catHighlights.map(h => `<li>"${h.text}"</li>`).join('')}</ul>
              </div>`;
            }).filter(section => section !== '').join('')}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Complete Highlight List</div>
        <div class="summary">
            <ol>
                ${highlights.map(h => `<li><strong>[${h.category}]</strong> "${h.text}"</li>`).join('')}
            </ol>
        </div>
    </div>

    <div class="no-print" style="text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px;">
        <p style="margin: 0; color: #64748b;">Use your browser's Print function (Ctrl+P or Cmd+P) to print this document</p>
    </div>
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
        {renderHighlightedContent()}
      </div>
      
      {/* Show highlighting toolbar when text is selected */}
      {selectedText && showPopover && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Highlighter className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Highlight for Bible Study</span>
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