import { ReactNode } from "react";
import BibleLink from "./bible-link";

interface MarkdownRendererProps {
  content: string;
  enableBibleLinks?: boolean;
}

// Enhanced regex patterns for Bible verse detection
const BIBLE_LINK_REGEX = /\[([^\]]+)\]\(bible:\/\/([^)]+)\)/g;
const AUTO_BIBLE_REGEX = /\b((?:1|2|3\s+)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s+Samuel|2\s+Samuel|1\s+Kings|2\s+Kings|1\s+Chronicles|2\s+Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song\s+of\s+Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\s+Corinthians|2\s+Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s+Thessalonians|2\s+Thessalonians|1\s+Timothy|2\s+Timothy|Titus|Philemon|Hebrews|James|1\s+Peter|2\s+Peter|1\s+John|2\s+John|3\s+John|Jude|Revelation)\s+\d+:\d+(?:-\d+)?)\b/gi;

// Common Bible book abbreviations
const BIBLE_ABBREVIATIONS: Record<string, string> = {
  "Gen": "Genesis",
  "Ex": "Exodus", "Exod": "Exodus",
  "Lev": "Leviticus",
  "Num": "Numbers",
  "Deut": "Deuteronomy",
  "Josh": "Joshua",
  "Judg": "Judges",
  "1 Sam": "1 Samuel", "2 Sam": "2 Samuel",
  "1 Kgs": "1 Kings", "2 Kgs": "2 Kings",
  "1 Chr": "1 Chronicles", "2 Chr": "2 Chronicles",
  "Ps": "Psalm", "Pss": "Psalms",
  "Prov": "Proverbs",
  "Eccl": "Ecclesiastes",
  "Song": "Song of Solomon",
  "Isa": "Isaiah",
  "Jer": "Jeremiah",
  "Lam": "Lamentations",
  "Ezek": "Ezekiel",
  "Dan": "Daniel",
  "Matt": "Matthew",
  "Rom": "Romans",
  "1 Cor": "1 Corinthians", "2 Cor": "2 Corinthians",
  "Gal": "Galatians",
  "Eph": "Ephesians",
  "Phil": "Philippians",
  "Col": "Colossians",
  "1 Thess": "1 Thessalonians", "2 Thess": "2 Thessalonians",
  "1 Tim": "1 Timothy", "2 Tim": "2 Timothy",
  "Heb": "Hebrews",
  "Jas": "James",
  "1 Pet": "1 Peter", "2 Pet": "2 Peter",
  "1 John": "1 John", "2 John": "2 John", "3 John": "3 John",
  "Rev": "Revelation"
};

function expandAbbreviation(reference: string): string {
  for (const [abbrev, full] of Object.entries(BIBLE_ABBREVIATIONS)) {
    if (reference.startsWith(abbrev + " ")) {
      return reference.replace(abbrev, full);
    }
  }
  return reference;
}

function renderTextWithBibleLinks(text: string, enableBibleLinks: boolean): ReactNode[] {
  if (!enableBibleLinks) {
    return [text];
  }

  const result: ReactNode[] = [];
  let lastIndex = 0;
  let globalIndex = 0;

  // First, process explicit markdown Bible links [text](bible://reference)
  const markdownMatches = Array.from(text.matchAll(BIBLE_LINK_REGEX));
  
  markdownMatches.forEach((match) => {
    const [fullMatch, linkText, reference] = match;
    const matchStart = match.index!;
    
    // Add text before the match
    if (matchStart > lastIndex) {
      const beforeText = text.slice(lastIndex, matchStart);
      result.push(...processAutoLinks(beforeText, enableBibleLinks, globalIndex));
      globalIndex += beforeText.length;
    }
    
    // Add the Bible link
    const expandedRef = expandAbbreviation(reference);
    result.push(
      <BibleLink key={`bible-link-${globalIndex}`} reference={expandedRef}>
        {linkText}
      </BibleLink>
    );
    
    lastIndex = matchStart + fullMatch.length;
    globalIndex += fullMatch.length;
  });

  // Process remaining text for auto-detection
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    result.push(...processAutoLinks(remainingText, enableBibleLinks, globalIndex));
  }

  return result;
}

function processAutoLinks(text: string, enableBibleLinks: boolean, startIndex: number): ReactNode[] {
  if (!enableBibleLinks) {
    return [text];
  }

  const result: ReactNode[] = [];
  let lastIndex = 0;
  
  // Auto-detect Bible references in remaining text
  const autoMatches = Array.from(text.matchAll(AUTO_BIBLE_REGEX));
  
  autoMatches.forEach((match) => {
    const [fullMatch] = match;
    const matchStart = match.index!;
    
    // Add text before the match
    if (matchStart > lastIndex) {
      result.push(text.slice(lastIndex, matchStart));
    }
    
    // Add the auto-detected Bible link
    const expandedRef = expandAbbreviation(fullMatch.trim());
    result.push(
      <BibleLink key={`auto-bible-${startIndex + matchStart}`} reference={expandedRef}>
        {fullMatch}
      </BibleLink>
    );
    
    lastIndex = matchStart + fullMatch.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

export default function MarkdownRenderer({ content, enableBibleLinks = false }: MarkdownRendererProps) {
  // Split content by line breaks to preserve formatting
  const lines = content.split('\n');
  
  return (
    <div className="whitespace-pre-wrap break-words">
      {lines.map((line, lineIndex) => (
        <div key={lineIndex}>
          {renderTextWithBibleLinks(line, enableBibleLinks)}
          {lineIndex < lines.length - 1 && <br />}
        </div>
      ))}
    </div>
  );
}