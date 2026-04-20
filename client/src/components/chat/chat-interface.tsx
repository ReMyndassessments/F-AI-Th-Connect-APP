import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, BookOpen, AlertTriangle, GraduationCap } from "lucide-react";
import { trackFeature } from "@/hooks/useAnalytics";
import MessageBubble from "@/components/chat/message-bubble";
import TypingIndicator from "@/components/chat/typing-indicator";
import { PromptLibrary } from "@/components/chat/prompt-library";
import FileUpload from "@/components/chat/file-upload";
import type { Message } from "@/lib/chat-api";

const PROMPT_CATEGORIES = [
  { id: 'ministry-leadership', icon: '👥', name: 'Ministry Leadership', label: 'Pastors & church leaders', color: 'from-blue-500 to-indigo-600' },
  { id: 'mens-ministry', icon: '💪', name: "Men's Ministry", label: "Faith & men's issues", color: 'from-slate-500 to-blue-700' },
  { id: 'womens-ministry', icon: '🌸', name: "Women's Ministry", label: 'Encouragement & calling', color: 'from-rose-400 to-pink-600' },
  { id: 'missions-outreach', icon: '🌍', name: 'Missions & Outreach', label: 'Evangelism & community', color: 'from-teal-500 to-cyan-700' },
  { id: 'church-planting', icon: '🏛️', name: 'Church Planting', label: 'Starting & growing churches', color: 'from-amber-500 to-orange-600' },
  { id: 'health-wellness', icon: '🙏', name: 'Health & Wellness', label: 'Body, mind & spirit', color: 'from-emerald-500 to-green-700' },
  { id: 'personal-growth', icon: '📖', name: 'Personal Growth', label: 'Deeper faith & study', color: 'from-purple-500 to-violet-700' },
  { id: 'youth-ministry', icon: '🎯', name: 'Youth Ministry', label: 'Teens & young adults', color: 'from-violet-400 to-purple-600' },
];

const LEARNING_TOPICS = [
  {
    icon: '⛰️', title: 'Sermon on the Mount', subtitle: 'Matthew 5–7',
    color: 'bg-blue-50 border-blue-200 text-blue-800', iconBg: 'bg-blue-100',
    prompt: 'Please teach me about the Sermon on the Mount (Matthew 5–7) in a clear, educational way. Cover the Beatitudes and what each one means, key teachings like "You are the light of the world" and "Turn the other cheek", the Lord\'s Prayer in its original context, and how this sermon applies to life today. Quote key verses in full.',
  },
  {
    icon: '🔥', title: 'The Holy Spirit', subtitle: 'Who He is & what He does',
    color: 'bg-orange-50 border-orange-200 text-orange-800', iconBg: 'bg-orange-100',
    prompt: 'Please teach me about the Holy Spirit in a clear, educational way. Who is the Holy Spirit? What is His role in the Trinity? What does He do in the life of a believer — conviction, comfort, guidance, empowerment? What does it mean to be filled with the Spirit? Quote key Scripture passages in full.',
  },
  {
    icon: '🌿', title: 'Fruits of the Spirit', subtitle: 'Galatians 5:22–23',
    color: 'bg-green-50 border-green-200 text-green-800', iconBg: 'bg-green-100',
    prompt: 'Please teach me about the Fruits of the Spirit from Galatians 5:22-23 in a clear, educational way. What is each fruit — love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control? What does each mean practically and how do we grow in them? Quote the passage in full with supporting Scriptures.',
  },
  {
    icon: '✝️', title: 'The Gospel', subtitle: 'The Good News of Jesus Christ',
    color: 'bg-amber-50 border-amber-200 text-amber-800', iconBg: 'bg-amber-100',
    prompt: 'Please teach me the Gospel — the Good News of Jesus Christ — in a clear, educational way. Cover: creation, the fall, God\'s redemptive plan, the life, death and resurrection of Jesus, what it means to be saved by grace through faith, and what a life of following Jesus looks like. Quote John 3:16, Romans 3:23, Romans 6:23, Ephesians 2:8-9 and Romans 10:9-10 in full.',
  },
  {
    icon: '📜', title: 'How to Study the Bible', subtitle: 'Methods & practical tools',
    color: 'bg-purple-50 border-purple-200 text-purple-800', iconBg: 'bg-purple-100',
    prompt: 'Please teach me how to study the Bible effectively. Cover: why Bible study matters, different approaches (devotional, inductive, topical, book study), the S.O.A.P. method, how to understand context and literary genre, useful tools and resources, and how to build a daily habit. Quote 2 Timothy 3:16-17 and Joshua 1:8 in full.',
  },
  {
    icon: '🙏', title: 'Prayer & Fasting', subtitle: 'How Jesus taught us to pray',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-800', iconBg: 'bg-indigo-100',
    prompt: 'Please teach me about prayer and fasting from a biblical perspective. Cover the Lord\'s Prayer and what each part means, types of prayer (adoration, confession, thanksgiving, supplication), what fasting is and how Jesus practised it, and practical guidance for developing a consistent prayer life. Quote Matthew 6:9-13 and other key passages in full.',
  },
  {
    icon: '⚖️', title: 'Grace & Salvation', subtitle: "Understanding God's gift",
    color: 'bg-rose-50 border-rose-200 text-rose-800', iconBg: 'bg-rose-100',
    prompt: "Please teach me about grace and salvation from a biblical perspective. What is grace? How are we saved — faith or works or both? What is justification, sanctification, and glorification? What is the difference between grace and law? Quote Ephesians 2:8-9, Romans 5:1-2, Titus 3:5-7 and other key passages in full.",
  },
  {
    icon: '🌍', title: 'The Great Commission', subtitle: 'Our calling as believers',
    color: 'bg-teal-50 border-teal-200 text-teal-800', iconBg: 'bg-teal-100',
    prompt: "Please teach me about the Great Commission in a clear, educational way. What did Jesus command in Matthew 28:18-20? What does 'making disciples' look like in practice? What is the difference between evangelism and discipleship? How can I personally be part of the Great Commission in everyday life? Quote Matthew 28:18-20 and Acts 1:8 in full.",
  },
];

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
  const [isSystemPrompt, setIsSystemPrompt] = useState(false);
  const [libOpen, setLibOpen] = useState(false);
  const [libCategory, setLibCategory] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const openLibrary = (categoryId: string) => { setLibCategory(categoryId); setLibOpen(true); };

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
    // Don't automatically set a prompt - let user choose their own prompt or click a button
    // The file content will be combined with whatever prompt they select
  };

  const handlePromptSelect = (promptText: string) => {
    setIsSystemPrompt(true);
    setInputValue(promptText);
  };

  const handleSystemPrompt = (promptText: string) => {
    setIsSystemPrompt(true);
    setInputValue(promptText);
  };

  const handleBibleStudyPrompt = (promptText: string, studyType: 'men' | 'women') => {
    const groupName = window.prompt(
      `Enter the name of your ${studyType === 'men' ? "men's" : "women's"} Bible study group:`,
      studyType === 'men' ? 'Fishers of Men' : 'Daughters of the King'
    );
    
    if (groupName === null) {
      // User cancelled
      return;
    }
    
    const finalGroupName = groupName.trim() || (studyType === 'men' ? 'Fishers of Men' : 'Daughters of the King');
    
    // Add group name heading instruction to the prompt
    const promptWithGroupName = `GROUP NAME: ${finalGroupName}

${promptText}

IMPORTANT: Start your response with a prominent heading that displays the group name "${finalGroupName}" at the very top of the study guide.`;
    
    setIsSystemPrompt(true);
    setInputValue(promptWithGroupName);
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

  // Check spelling when user types (exclude file content and system prompts from spell check)
  useEffect(() => {
    if (inputValue && !isSending && !fileContent && !isSystemPrompt) {
      const suggestions = spellCheck(inputValue);
      setSpellCheckSuggestions(suggestions);
    } else {
      setSpellCheckSuggestions([]);
    }
  }, [inputValue, isSending, fileContent, isSystemPrompt]);

  // Reset system prompt flag when user starts typing
  const handleInputChange = (value: string) => {
    if (isSystemPrompt) {
      setIsSystemPrompt(false);
    }
    setInputValue(value);
  };

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
            <p className="text-white text-opacity-80 text-xs sm:text-sm">Your Biblical Ministry Companion</p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="h-[480px] sm:h-[520px] overflow-y-auto mobile-scroll mobile-keyboard-safe p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="py-4 sm:py-6 px-2">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg sm:text-xl">✝</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Welcome to F-AI-TH-Connect</h3>
              <p className="text-gray-500 text-xs sm:text-sm px-2">
                Biblical guidance, learning, and spiritual encouragement — explore the Word or ask anything below.
              </p>
            </div>

            {/* Quick topic chips */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <button onClick={() => handleSystemPrompt("I'm feeling anxious about my future. What does the Bible say about worry?")} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">Anxiety & worry</button>
              <button onClick={() => handleSystemPrompt("How can I deepen my relationship with God?")} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">Spiritual growth</button>
              <button onClick={() => handleSystemPrompt("Can you help me with a prayer for my family?")} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">Prayer requests</button>
              <button onClick={() => handleSystemPrompt("When someone has hurt my feelings or made an inappropriate comment in person or during Bible study, how can I respond in a Christ-like manner? Please provide biblical guidance for gracious, wise responses that honor God. Here is my situation:")} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">Godly responses</button>
            </div>

            {/* Prompt Library section */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">Prompt Library</h4>
                    <p className="text-xs text-gray-500 leading-tight">35 ready-made prompts</p>
                  </div>
                </div>
                <button
                  onClick={() => openLibrary('all')}
                  className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex-shrink-0"
                >
                  Browse all →
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3 mt-2">Not sure what to ask? Pick a ministry category below to see ready-made prompts:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PROMPT_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { trackFeature('prompt_library', cat.id); openLibrary(cat.id); }}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-white text-center shadow-sm hover:shadow-md transition-all active:scale-95 bg-gradient-to-br ${cat.color}`}
                  >
                    <span className="text-lg leading-none">{cat.icon}</span>
                    <span className="font-semibold text-xs leading-tight">{cat.name}</span>
                    <span className="text-white/70 text-[10px] leading-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Explore & Learn section */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 text-sm leading-tight">Explore & Learn</h4>
                  <p className="text-xs text-gray-500 leading-tight">Deepen your knowledge of the Word</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">Choose a topic and receive a rich, educational biblical teaching:</p>
              <div className="grid grid-cols-2 gap-2">
                {LEARNING_TOPICS.map(topic => (
                  <button
                    key={topic.title}
                    onClick={() => { trackFeature('explore_learn', topic.title); handleSystemPrompt(topic.prompt); }}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-left hover:shadow-sm transition-all active:scale-95 ${topic.color}`}
                  >
                    <span className={`w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-sm ${topic.iconBg}`}>{topic.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs leading-tight">{topic.title}</div>
                      <div className="text-[10px] leading-tight opacity-60 mt-0.5">{topic.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
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
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 min-h-[44px] sm:min-h-[48px] max-h-32 resize-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSending}
                rows={1}
                spellCheck={false}
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
            <PromptLibrary
              onSelectPrompt={handlePromptSelect}
              open={libOpen}
              onOpenChange={setLibOpen}
              defaultCategory={libCategory}
            >
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
