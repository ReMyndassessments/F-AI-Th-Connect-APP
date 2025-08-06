import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, BookOpen, AlertTriangle } from "lucide-react";
import MessageBubble from "@/components/chat/message-bubble";
import TypingIndicator from "@/components/chat/typing-indicator";
import { PromptLibrary } from "@/components/chat/prompt-library";

import FileUpload from "@/components/chat/file-upload";
import type { Message } from "@/lib/chat-api";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isSending: boolean;
}

interface SpellCheckSuggestion {
  word: string;
  suggestions: string[];
  isCorrect: boolean;
}

const LARGE_CONTENT_THRESHOLD = 1000;

export default function ChatInterface({ messages, onSendMessage, isLoading, isSending }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [spellCheckSuggestions, setSpellCheckSuggestions] = useState<SpellCheckSuggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullMessage = fileContent ? `${fileContent}\n\n${inputValue.trim()}` : inputValue.trim();
    if (fullMessage && !isSending) {
      onSendMessage(fullMessage);
      setInputValue("");
      setFileContent("");
    }
  };



  const handleFileContent = (content: string, fileName: string) => {
    setFileContent(content);
    // Clear any existing input and set a helpful prompt
    setInputValue(`Please create a comprehensive Bible study based on this ${fileName.endsWith('.pdf') ? 'document' : fileName.endsWith('.docx') ? 'Word document' : 'content'}. Include discussion questions and practical applications.`);
  };

  const handlePromptSelect = (promptText: string) => {
    setInputValue(promptText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Biblical terms dictionary for spell check (same as Bible games)
  const biblicalTerms = [
    // People
    'moses', 'jesus', 'david', 'abraham', 'isaac', 'jacob', 'joseph', 'noah', 'adam', 'eve', 'mary', 'peter', 'paul', 'john', 'matthew', 'mark', 'luke', 'solomon', 'daniel', 'jonah', 'esther', 'ruth', 'samuel', 'joshua', 'caleb', 'aaron', 'miriam', 'sarah', 'rebecca', 'rachel', 'leah', 'benjamin', 'judah', 'levi', 'reuben', 'simeon', 'zebulun', 'issachar', 'dan', 'naphtali', 'gad', 'asher', 'ephraim', 'manasseh', 'samson', 'gideon', 'deborah', 'eli', 'hannah', 'saul', 'jonathan', 'bathsheba', 'nathan', 'elijah', 'elisha', 'isaiah', 'jeremiah', 'ezekiel', 'hosea', 'joel', 'amos', 'obadiah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi', 'elizabeth', 'zacharias', 'simeon', 'anna', 'andrew', 'james', 'philip', 'bartholomew', 'thomas', 'thaddeus', 'simon', 'matthias', 'stephen', 'barnabas', 'timothy', 'titus', 'philemon', 'lydia', 'priscilla', 'aquila', 'apollos', 'silas', 'cornelius', 'felix', 'festus', 'agrippa', 'herod', 'pilate', 'caesar', 'pharaoh', 'nebuchadnezzar', 'belshazzar', 'darius', 'cyrus', 'artaxerxes', 'ahasuerus', 'mordecai', 'haman',
    // Places  
    'jerusalem', 'bethlehem', 'nazareth', 'galilee', 'judea', 'samaria', 'egypt', 'babylon', 'assyria', 'persia', 'rome', 'antioch', 'damascus', 'jericho', 'gaza', 'beersheba', 'hebron', 'shechem', 'shiloh', 'bethel', 'gilgal', 'ramah', 'mizpah', 'gibeah', 'tekoa', 'bethany', 'emmaus', 'cana', 'capernaum', 'chorazin', 'bethsaida', 'tyre', 'sidon', 'caesarea', 'joppa', 'lydda', 'ephesus', 'corinth', 'thessalonica', 'philippi', 'athens', 'berea', 'crete', 'cyprus', 'malta', 'sinai', 'horeb', 'carmel', 'tabor', 'hermon', 'olivet', 'calvary', 'golgotha', 'gethsemane', 'jordan', 'euphrates', 'tigris', 'nile', 'mediterranean', 'galilee', 'gennesaret', 'dead', 'red', 'canaan', 'promised', 'eden', 'ararat', 'moriah', 'zion', 'temple', 'solomon', 'herod', 'synagogue', 'tabernacle', 'ark', 'covenant', 'mercy', 'seat', 'altar', 'bronze', 'gold', 'holy', 'holies', 'veil', 'curtain',
    // Books
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth', 'samuel', 'kings', 'chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'psalms', 'proverbs', 'ecclesiastes', 'song', 'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi', 'matthew', 'mark', 'luke', 'john', 'acts', 'romans', 'corinthians', 'galatians', 'ephesians', 'philippians', 'colossians', 'thessalonians', 'timothy', 'titus', 'philemon', 'hebrews', 'james', 'peter', 'revelation',
    // Religious terms
    'god', 'lord', 'christ', 'jesus', 'holy', 'spirit', 'father', 'son', 'trinity', 'messiah', 'savior', 'redeemer', 'creator', 'almighty', 'yahweh', 'jehovah', 'elohim', 'adonai', 'emmanuel', 'immanuel', 'alpha', 'omega', 'lamb', 'shepherd', 'king', 'priest', 'prophet', 'apostle', 'disciple', 'angel', 'archangel', 'cherub', 'seraph', 'gabriel', 'michael', 'satan', 'devil', 'demon', 'heaven', 'paradise', 'hell', 'hades', 'sheol', 'resurrection', 'ascension', 'crucifixion', 'cross', 'crown', 'thorns', 'blood', 'sacrifice', 'atonement', 'redemption', 'salvation', 'grace', 'mercy', 'love', 'faith', 'hope', 'charity', 'peace', 'joy', 'righteousness', 'holiness', 'sanctification', 'justification', 'forgiveness', 'repentance', 'baptism', 'communion', 'eucharist', 'passover', 'pentecost', 'sabbath', 'worship', 'praise', 'prayer', 'blessing', 'miracle', 'parable', 'covenant', 'testament', 'scripture', 'word', 'gospel', 'law', 'commandment', 'prophecy', 'revelation', 'vision', 'dream', 'voice', 'glory', 'majesty', 'power', 'might', 'strength', 'wisdom', 'knowledge', 'understanding', 'truth', 'light', 'darkness', 'sin', 'evil', 'good', 'pure', 'clean', 'unclean', 'blessed', 'cursed', 'chosen', 'elect', 'church', 'congregation', 'assembly', 'bride', 'body', 'vine', 'branch', 'sheep', 'flock', 'harvest', 'kingdom', 'throne', 'crown', 'scepter', 'robe', 'garment', 'wedding', 'feast', 'banquet', 'bread', 'wine', 'water', 'oil', 'anointing', 'incense', 'fire', 'cloud', 'pillar', 'rock', 'stone', 'mountain', 'valley', 'desert', 'wilderness', 'garden', 'tree', 'fruit', 'seed', 'grain', 'wheat', 'barley', 'vine', 'fig', 'olive', 'palm', 'cedar', 'lily', 'rose', 'lion', 'lamb', 'dove', 'eagle', 'serpent', 'fish', 'loaves', 'fishes', 'manna', 'quail', 'honey', 'milk', 'gold', 'silver', 'bronze', 'iron', 'wood', 'stone', 'precious', 'pearl', 'treasure', 'talent', 'shekel', 'denarius', 'widow', 'mite', 'poor', 'rich', 'beggar', 'leper', 'blind', 'deaf', 'lame', 'sick', 'healing', 'health', 'life', 'death', 'birth', 'child', 'virgin', 'mother', 'father', 'son', 'daughter', 'brother', 'sister', 'husband', 'wife', 'family', 'tribe', 'nation', 'people', 'generation'
  ];

  // Common words to ignore in spell check
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'into', 'from', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'his', 'her', 'him', 'she', 'he', 'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'my', 'your', 'our', 'about', 'please', 'help', 'me', 'understand', 'explain', 'tell', 'show', 'give', 'make', 'take', 'get', 'go', 'come', 'see', 'know', 'think', 'say', 'work', 'look', 'use', 'find', 'become', 'leave', 'put', 'mean', 'keep', 'let', 'begin', 'seem', 'help', 'talk', 'turn', 'start', 'show', 'hear', 'play', 'run', 'move', 'live', 'believe', 'hold', 'bring', 'happen', 'write', 'provide', 'sit', 'stand', 'lose', 'pay', 'meet', 'include', 'continue', 'set', 'learn', 'change', 'lead', 'understand', 'watch', 'follow', 'stop', 'create', 'speak', 'read', 'allow', 'add', 'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember', 'love', 'consider', 'appear', 'buy', 'wait', 'serve', 'die', 'send', 'expect', 'build', 'stay', 'fall', 'cut', 'reach', 'kill', 'remain'];

  // Spell check function
  const spellCheck = (text: string): SpellCheckSuggestion[] => {
    if (!text.trim()) return [];
    
    const words = text.toLowerCase().trim().split(/\s+/);
    const suggestions: SpellCheckSuggestion[] = [];
    
    words.forEach(word => {
      // Remove punctuation
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length < 3) return; // Only check words 3+ characters for chat
      
      // Skip common words
      if (commonWords.includes(cleanWord)) return;
      
      // Check if word is in biblical terms dictionary
      const isCorrect = biblicalTerms.includes(cleanWord);
      
      if (!isCorrect) {
        // Find similar words using simple edit distance
        const similarWords = biblicalTerms.filter(term => {
          const maxDistance = cleanWord.length <= 4 ? 1 : 2;
          const maxLengthDiff = cleanWord.length <= 4 ? 1 : 2;
          
          return getEditDistance(cleanWord, term) <= maxDistance && 
                 (Math.abs(cleanWord.length - term.length) <= maxLengthDiff);
        })
        .sort((a, b) => {
          const distA = getEditDistance(cleanWord, a);
          const distB = getEditDistance(cleanWord, b);
          if (distA !== distB) return distA - distB;
          return Math.abs(cleanWord.length - a.length) - Math.abs(cleanWord.length - b.length);
        })
        .slice(0, 3);
        
        if (similarWords.length > 0) {
          suggestions.push({
            word: cleanWord,
            suggestions: similarWords,
            isCorrect: false
          });
        }
      }
    });
    
    return suggestions;
  };

  // Simple edit distance calculation
  const getEditDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Apply spell check suggestion
  const applySuggestion = (originalWord: string, suggestion: string) => {
    const newAnswer = inputValue.replace(
      new RegExp(`\\b${originalWord}\\b`, 'gi'), 
      suggestion
    );
    setInputValue(newAnswer);
    
    // Re-check spelling after applying suggestion
    const newSuggestions = spellCheck(newAnswer);
    setSpellCheckSuggestions(newSuggestions);
  };

  // Check spelling when user types (exclude file content from spell check)
  useEffect(() => {
    if (inputValue && !isSending && !fileContent) {
      const suggestions = spellCheck(inputValue);
      setSpellCheckSuggestions(suggestions);
    } else {
      setSpellCheckSuggestions([]);
    }
  }, [inputValue, isSending, fileContent]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200 overflow-hidden">
        <div className="h-80 sm:h-96 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-500 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">Loading your conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-amber-500 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs sm:text-sm">AI</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">F-AI-TH-Connect</h3>
            <p className="text-white text-opacity-80 text-xs sm:text-sm">Your Christian AI Companion</p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="h-80 sm:h-96 overflow-y-auto mobile-scroll mobile-keyboard-safe p-3 sm:p-6 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-4 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-white font-bold text-lg sm:text-xl">✝</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Welcome to F-AI-TH-Connect</h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base px-2">
              I'm here to provide biblical guidance, prayer support, and spiritual encouragement. 
              How can I help you in your faith journey today?
            </p>
            <div className="flex flex-wrap gap-2 justify-center px-2">
              <button
                onClick={() => onSendMessage("I'm feeling anxious about my future. What does the Bible say about worry?")}
                className="bg-blue-50 text-blue-600 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-100 transition-colors touch-target mobile-tap"
              >
                Anxiety and worry
              </button>
              <button
                onClick={() => onSendMessage("How can I deepen my relationship with God?")}
                className="bg-blue-50 text-blue-600 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-100 transition-colors touch-target mobile-tap"
              >
                Spiritual growth
              </button>
              <button
                onClick={() => onSendMessage("Can you help me with a prayer for my family?")}
                className="bg-blue-50 text-blue-600 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-100 transition-colors touch-target mobile-tap"
              >
                Prayer requests
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        <TypingIndicator 
          isVisible={isSending}
          message={inputValue.length > LARGE_CONTENT_THRESHOLD ? "Processing extensive content" : "Seeking biblical guidance"}
        />
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2 sm:p-4 space-y-2 sm:space-y-3">
        {/* File Upload */}
        <FileUpload 
          onFileContent={handleFileContent}
          disabled={isSending}
        />
        
        <div className="flex items-end space-x-2 sm:space-x-3">
          <div className="flex-1 space-y-2">
            <div className="relative">
              <Textarea
                placeholder="Ask about faith, prayer, or guidance..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 min-h-[44px] sm:min-h-[48px] max-h-32 resize-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSending}
                rows={1}
                spellCheck={true}
              />
              
              {/* Spell Check Suggestions */}
              {spellCheckSuggestions.length > 0 && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-32 overflow-y-auto">
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex items-center space-x-1 text-xs text-amber-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Spelling suggestions for biblical terms:</span>
                    </div>
                  </div>
                  <div className="max-h-24 overflow-y-auto">
                    {spellCheckSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-2 border-b border-gray-100 last:border-b-0">
                        <div className="text-xs text-gray-600 mb-1">
                          Did you mean for "{suggestion.word}":
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.suggestions.map((word, wordIndex) => (
                            <button
                              key={wordIndex}
                              onClick={() => applySuggestion(suggestion.word, word)}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors"
                              type="button"
                            >
                              {word}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <PromptLibrary onSelectPrompt={handlePromptSelect}>
              <Button
                type="button"
                variant="outline"
                className="p-2 sm:p-3 rounded-xl border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors touch-target mobile-tap"
                size="sm"
                disabled={isSending}
                title="Prompt Library"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </Button>
            </PromptLibrary>
            
            <Button
              type="submit"
              disabled={(!inputValue.trim() && !fileContent) || isSending}
              className="bg-blue-500 text-white p-2 sm:p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target mobile-tap"
              size="sm"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
