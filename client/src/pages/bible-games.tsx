import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2, Trophy, Clock, Target, Shuffle, BookOpen, 
  Users, MapPin, Star, Play, RotateCcw, CheckCircle, 
  XCircle, Lightbulb, Award, TrendingUp, ArrowLeft, X, AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { BibleGame, GameScore, UserGameStats } from '@shared/bible-games-schema';

interface GameState {
  currentGame: BibleGame | null;
  userAnswer: string;
  showHint: boolean;
  hintIndex: number;
  timeStarted: number;
  isAnswered: boolean;
  isCorrect: boolean;
  attempts: number;
}

interface SpellCheckSuggestion {
  word: string;
  suggestions: string[];
  isCorrect: boolean;
}

interface GameSession {
  games: BibleGame[];
  currentQuestionIndex: number;
  totalQuestions: number;
  sessionScore: number;
  sessionStarted: number;
  questionsAnswered: number;
  correctAnswers: number;
  isSessionActive: boolean;
}

export default function BibleGames() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    userAnswer: '',
    showHint: false,
    hintIndex: 0,
    timeStarted: 0,
    isAnswered: false,
    isCorrect: false,
    attempts: 0
  });

  const [gameSession, setGameSession] = useState<GameSession>({
    games: [],
    currentQuestionIndex: 0,
    totalQuestions: 5, // Default 5 questions per session
    sessionScore: 0,
    sessionStarted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    isSessionActive: false
  });

  const [spellCheckSuggestions, setSpellCheckSuggestions] = useState<SpellCheckSuggestion[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Biblical terms dictionary for spell check
  const biblicalTerms = [
    // People
    'moses', 'jesus', 'david', 'abraham', 'isaac', 'jacob', 'joseph', 'noah', 'adam', 'eve', 'mary', 'peter', 'paul', 'john', 'matthew', 'mark', 'luke', 'solomon', 'daniel', 'jonah', 'esther', 'ruth', 'samuel', 'joshua', 'caleb', 'aaron', 'miriam', 'sarah', 'rebecca', 'rachel', 'leah', 'benjamin', 'judah', 'levi', 'reuben', 'simeon', 'zebulun', 'issachar', 'dan', 'naphtali', 'gad', 'asher', 'ephraim', 'manasseh', 'samson', 'gideon', 'deborah', 'eli', 'hannah', 'saul', 'jonathan', 'bathsheba', 'nathan', 'elijah', 'elisha', 'isaiah', 'jeremiah', 'ezekiel', 'hosea', 'joel', 'amos', 'obadiah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi', 'elizabeth', 'zacharias', 'simeon', 'anna', 'andrew', 'james', 'philip', 'bartholomew', 'thomas', 'thaddeus', 'simon', 'matthias', 'stephen', 'barnabas', 'timothy', 'titus', 'philemon', 'lydia', 'priscilla', 'aquila', 'apollos', 'silas', 'cornelius', 'felix', 'festus', 'agrippa', 'herod', 'pilate', 'caesar', 'pharaoh', 'nebuchadnezzar', 'belshazzar', 'darius', 'cyrus', 'artaxerxes', 'ahasuerus', 'mordecai', 'haman',
    // Places  
    'jerusalem', 'bethlehem', 'nazareth', 'galilee', 'judea', 'samaria', 'egypt', 'babylon', 'assyria', 'persia', 'rome', 'antioch', 'damascus', 'jericho', 'gaza', 'beersheba', 'hebron', 'shechem', 'shiloh', 'bethel', 'gilgal', 'ramah', 'mizpah', 'gibeah', 'tekoa', 'bethany', 'emmaus', 'cana', 'capernaum', 'chorazin', 'bethsaida', 'tyre', 'sidon', 'caesarea', 'joppa', 'lydda', 'ephesus', 'corinth', 'thessalonica', 'philippi', 'athens', 'berea', 'crete', 'cyprus', 'malta', 'sinai', 'horeb', 'carmel', 'tabor', 'hermon', 'olivet', 'calvary', 'golgotha', 'gethsemane', 'jordan', 'euphrates', 'tigris', 'nile', 'mediterranean', 'galilee', 'gennesaret', 'dead', 'red', 'canaan', 'promised', 'eden', 'ararat', 'moriah', 'zion', 'temple', 'solomon', 'herod', 'synagogue', 'tabernacle', 'ark', 'covenant', 'mercy', 'seat', 'altar', 'bronze', 'gold', 'holy', 'holies', 'veil', 'curtain',
    // Books
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth', 'samuel', 'kings', 'chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'psalms', 'proverbs', 'ecclesiastes', 'song', 'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi', 'matthew', 'mark', 'luke', 'john', 'acts', 'romans', 'corinthians', 'galatians', 'ephesians', 'philippians', 'colossians', 'thessalonians', 'timothy', 'titus', 'philemon', 'hebrews', 'james', 'peter', 'revelation',
    // Religious terms
    'god', 'lord', 'christ', 'jesus', 'holy', 'spirit', 'father', 'son', 'trinity', 'messiah', 'savior', 'redeemer', 'creator', 'almighty', 'yahweh', 'jehovah', 'elohim', 'adonai', 'emmanuel', 'immanuel', 'alpha', 'omega', 'lamb', 'shepherd', 'king', 'priest', 'prophet', 'apostle', 'disciple', 'angel', 'archangel', 'cherub', 'seraph', 'gabriel', 'michael', 'satan', 'devil', 'demon', 'heaven', 'paradise', 'hell', 'hades', 'sheol', 'resurrection', 'ascension', 'crucifixion', 'cross', 'crown', 'thorns', 'blood', 'sacrifice', 'atonement', 'redemption', 'salvation', 'grace', 'mercy', 'love', 'faith', 'hope', 'charity', 'peace', 'joy', 'righteousness', 'holiness', 'sanctification', 'justification', 'forgiveness', 'repentance', 'baptism', 'communion', 'eucharist', 'passover', 'pentecost', 'sabbath', 'worship', 'praise', 'prayer', 'blessing', 'miracle', 'parable', 'covenant', 'testament', 'scripture', 'word', 'gospel', 'law', 'commandment', 'prophecy', 'revelation', 'vision', 'dream', 'voice', 'glory', 'majesty', 'power', 'might', 'strength', 'wisdom', 'knowledge', 'understanding', 'truth', 'light', 'darkness', 'sin', 'evil', 'good', 'pure', 'clean', 'unclean', 'blessed', 'cursed', 'chosen', 'elect', 'church', 'congregation', 'assembly', 'bride', 'body', 'vine', 'branch', 'sheep', 'flock', 'harvest', 'kingdom', 'throne', 'crown', 'scepter', 'robe', 'garment', 'wedding', 'feast', 'banquet', 'bread', 'wine', 'water', 'oil', 'anointing', 'incense', 'fire', 'cloud', 'pillar', 'rock', 'stone', 'mountain', 'valley', 'desert', 'wilderness', 'garden', 'tree', 'fruit', 'seed', 'grain', 'wheat', 'barley', 'vine', 'fig', 'olive', 'palm', 'cedar', 'lily', 'rose', 'lion', 'lamb', 'dove', 'eagle', 'serpent', 'fish', 'loaves', 'fishes', 'manna', 'quail', 'honey', 'milk', 'gold', 'silver', 'bronze', 'iron', 'wood', 'stone', 'precious', 'pearl', 'treasure', 'talent', 'shekel', 'denarius', 'widow', 'mite', 'poor', 'rich', 'beggar', 'leper', 'blind', 'deaf', 'lame', 'sick', 'healing', 'health', 'life', 'death', 'birth', 'child', 'virgin', 'mother', 'father', 'son', 'daughter', 'brother', 'sister', 'husband', 'wife', 'family', 'tribe', 'nation', 'people', 'generation', 'lineage', 'genealogy', 'covenant', 'promise', 'oath', 'vow', 'pledge', 'witness', 'testimony', 'judge', 'judgment', 'justice', 'righteousness', 'wrath', 'anger', 'jealousy', 'vengeance', 'punishment', 'reward', 'blessing', 'curse', 'prosperity', 'abundance', 'famine', 'drought', 'flood', 'earthquake', 'storm', 'thunder', 'lightning', 'rainbow', 'sunrise', 'sunset', 'morning', 'evening', 'night', 'day', 'week', 'month', 'year', 'generation', 'eternity', 'forever', 'everlasting', 'eternal', 'immortal', 'mortal', 'flesh', 'spirit', 'soul', 'heart', 'mind', 'conscience', 'will', 'desire', 'emotion', 'feeling', 'thought', 'memory', 'dream', 'vision', 'revelation', 'prophecy', 'oracle', 'message', 'word', 'voice', 'sound', 'noise', 'silence', 'stillness', 'peace', 'war', 'battle', 'victory', 'defeat', 'enemy', 'friend', 'stranger', 'neighbor', 'servant', 'master', 'lord', 'king', 'queen', 'prince', 'princess', 'ruler', 'leader', 'follower', 'teacher', 'student', 'wise', 'foolish', 'simple', 'understanding', 'knowledge', 'wisdom', 'counsel', 'advice', 'instruction', 'discipline', 'correction', 'rebuke', 'encouragement', 'comfort', 'consolation', 'support', 'help', 'aid', 'assistance', 'rescue', 'deliverance', 'salvation', 'redemption', 'ransom', 'price', 'cost', 'value', 'worth', 'precious', 'valuable', 'treasure', 'jewel', 'crown', 'diadem', 'glory', 'honor', 'praise', 'worship', 'adoration', 'reverence', 'fear', 'awe', 'wonder', 'amazement', 'surprise', 'shock', 'terror', 'dread', 'anxiety', 'worry', 'concern', 'care', 'burden', 'load', 'weight', 'heavy', 'light', 'easy', 'difficult', 'hard', 'soft', 'gentle', 'harsh', 'severe', 'mild', 'kind', 'cruel', 'merciful', 'merciless', 'compassionate', 'caring', 'loving', 'hateful', 'angry', 'peaceful', 'violent', 'calm', 'stormy', 'turbulent', 'serene', 'tranquil', 'quiet', 'loud', 'noisy', 'silent', 'mute', 'speechless', 'eloquent', 'articulate', 'clear', 'unclear', 'confused', 'certain', 'uncertain', 'sure', 'unsure', 'confident', 'doubtful', 'faithful', 'unfaithful', 'loyal', 'disloyal', 'true', 'false', 'honest', 'dishonest', 'sincere', 'insincere', 'genuine', 'fake', 'real', 'imaginary', 'actual', 'potential', 'possible', 'impossible', 'probable', 'improbable', 'likely', 'unlikely', 'certain', 'uncertain', 'definite', 'indefinite', 'specific', 'general', 'particular', 'universal', 'individual', 'collective', 'personal', 'public', 'private', 'secret', 'hidden', 'revealed', 'exposed', 'covered', 'uncovered', 'open', 'closed', 'locked', 'unlocked', 'bound', 'free', 'captive', 'prisoner', 'slave', 'master', 'servant', 'lord', 'subject', 'citizen', 'foreigner', 'alien', 'stranger', 'guest', 'host', 'visitor', 'resident', 'inhabitant', 'dweller', 'sojourner', 'pilgrim', 'traveler', 'journey', 'trip', 'voyage', 'expedition', 'mission', 'quest', 'search', 'seek', 'find', 'discover', 'uncover', 'reveal', 'hide', 'conceal', 'cover', 'protect', 'defend', 'guard', 'watch', 'observe', 'see', 'look', 'gaze', 'stare', 'glance', 'peek', 'glimpse', 'view', 'sight', 'vision', 'appearance', 'look', 'seem', 'appear', 'show', 'display', 'exhibit', 'demonstrate', 'prove', 'evidence', 'sign', 'symbol', 'mark', 'token', 'indication', 'signal', 'warning', 'alarm', 'alert', 'notice', 'announcement', 'declaration', 'proclamation', 'statement', 'assertion', 'claim', 'promise', 'vow', 'oath', 'pledge', 'covenant', 'agreement', 'contract', 'treaty', 'pact', 'alliance', 'union', 'marriage', 'wedding', 'divorce', 'separation', 'division', 'unity', 'harmony', 'discord', 'conflict', 'struggle', 'fight', 'battle', 'war', 'peace', 'truce', 'ceasefire', 'armistice', 'victory', 'triumph', 'success', 'achievement', 'accomplishment', 'failure', 'defeat', 'loss', 'gain', 'profit', 'benefit', 'advantage', 'disadvantage', 'handicap', 'obstacle', 'barrier', 'hindrance', 'impediment', 'difficulty', 'problem', 'trouble', 'issue', 'matter', 'concern', 'worry', 'anxiety', 'fear', 'terror', 'horror', 'dread', 'panic', 'alarm', 'shock', 'surprise', 'amazement', 'wonder', 'awe', 'reverence', 'respect', 'honor', 'dignity', 'pride', 'humility', 'modesty', 'arrogance', 'conceit', 'vanity', 'selfishness', 'selflessness', 'generosity', 'kindness', 'goodness', 'evil', 'wickedness', 'sin', 'righteousness', 'holiness', 'purity', 'cleanliness', 'dirt', 'filth', 'corruption', 'decay', 'rot', 'destruction', 'ruin', 'devastation', 'calamity', 'disaster', 'catastrophe', 'tragedy', 'misfortune', 'bad', 'luck', 'fortune', 'chance', 'opportunity', 'possibility', 'probability', 'certainty', 'uncertainty', 'doubt', 'faith', 'belief', 'trust', 'confidence', 'assurance', 'security', 'safety', 'danger', 'risk', 'hazard', 'peril', 'threat', 'menace', 'warning', 'caution', 'care', 'carefulness', 'carelessness', 'negligence', 'neglect', 'ignore', 'overlook', 'disregard', 'pay', 'attention', 'focus', 'concentrate', 'meditate', 'contemplate', 'consider', 'think', 'ponder', 'reflect', 'remember', 'recall', 'recollect', 'forget', 'forgive', 'pardon', 'excuse', 'absolve', 'acquit', 'condemn', 'blame', 'accuse', 'charge', 'prosecute', 'defend', 'protect', 'save', 'rescue', 'deliver', 'free', 'liberate', 'release', 'let', 'go', 'send', 'away', 'dismiss', 'discharge', 'fire', 'hire', 'employ', 'work', 'labor', 'toil', 'effort', 'try', 'attempt', 'endeavor', 'strive', 'struggle', 'fight', 'resist', 'oppose', 'support', 'help', 'assist', 'aid', 'serve', 'minister', 'care', 'tend', 'nurse', 'heal', 'cure', 'treat', 'medicine', 'remedy', 'solution', 'answer', 'response', 'reply', 'question', 'ask', 'inquire', 'request', 'demand', 'require', 'need', 'want', 'desire', 'wish', 'hope', 'expect', 'anticipate', 'await', 'wait', 'delay', 'postpone', 'defer', 'hurry', 'rush', 'speed', 'fast', 'quick', 'rapid', 'swift', 'slow', 'gradual', 'steady', 'constant', 'continuous', 'intermittent', 'occasional', 'frequent', 'rare', 'common', 'usual', 'normal', 'ordinary', 'regular', 'irregular', 'abnormal', 'unusual', 'strange', 'odd', 'peculiar', 'curious', 'interesting', 'boring', 'dull', 'exciting', 'thrilling', 'amazing', 'wonderful', 'marvelous', 'magnificent', 'glorious', 'beautiful', 'lovely', 'pretty', 'handsome', 'attractive', 'ugly', 'hideous', 'repulsive', 'disgusting', 'pleasant', 'unpleasant', 'agreeable', 'disagreeable', 'nice', 'nasty', 'good', 'bad', 'excellent', 'poor', 'great', 'small', 'large', 'big', 'little', 'tiny', 'huge', 'enormous', 'gigantic', 'massive', 'immense', 'vast', 'infinite', 'finite', 'limited', 'unlimited', 'boundless', 'endless', 'eternal', 'temporary', 'permanent', 'lasting', 'durable', 'fragile', 'weak', 'strong', 'powerful', 'mighty', 'feeble', 'robust', 'healthy', 'sick', 'ill', 'diseased', 'well', 'fit', 'unfit', 'suitable', 'unsuitable', 'appropriate', 'inappropriate', 'proper', 'improper', 'correct', 'incorrect', 'right', 'wrong', 'true', 'false', 'accurate', 'inaccurate', 'precise', 'imprecise', 'exact', 'inexact', 'perfect', 'imperfect', 'flawless', 'flawed', 'complete', 'incomplete', 'whole', 'partial', 'full', 'empty', 'vacant', 'occupied', 'busy', 'free', 'available', 'unavailable', 'present', 'absent', 'here', 'there', 'near', 'far', 'close', 'distant', 'remote', 'local', 'foreign', 'domestic', 'international', 'global', 'universal', 'particular', 'specific', 'general', 'broad', 'narrow', 'wide', 'thin', 'thick', 'fat', 'skinny', 'lean', 'plump', 'round', 'square', 'rectangular', 'triangular', 'circular', 'oval', 'straight', 'curved', 'bent', 'crooked', 'twisted', 'smooth', 'rough', 'bumpy', 'flat', 'steep', 'sloped', 'level', 'high', 'low', 'tall', 'short', 'long', 'brief', 'extended', 'prolonged', 'short-lived', 'long-lasting', 'enduring', 'transient', 'fleeting', 'momentary', 'instant', 'immediate', 'delayed', 'late', 'early', 'timely', 'untimely', 'premature', 'mature', 'ripe', 'unripe', 'green', 'fresh', 'stale', 'old', 'new', 'recent', 'ancient', 'modern', 'contemporary', 'current', 'past', 'future', 'present', 'now', 'then', 'when', 'where', 'why', 'how', 'what', 'who', 'which', 'whose', 'whom'
  ];

  // Spell check function
  const spellCheck = (text: string): SpellCheckSuggestion[] => {
    if (!text.trim()) return [];
    
    const words = text.toLowerCase().trim().split(/\s+/);
    const suggestions: SpellCheckSuggestion[] = [];
    
    // Common words to ignore in spell check
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'into', 'from', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'his', 'her', 'him', 'she', 'he', 'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'my', 'your', 'our', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'first', 'second', 'third', 'last', 'next', 'new', 'old', 'great', 'little', 'big', 'small', 'good', 'bad', 'long', 'short', 'high', 'low', 'right', 'left', 'white', 'black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'brown', 'pink', 'gray'];
    
    words.forEach(word => {
      // Remove punctuation
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length < 2) return;
      
      // Skip common words
      if (commonWords.includes(cleanWord)) return;
      
      // Check if word is in biblical terms dictionary
      const isCorrect = biblicalTerms.includes(cleanWord);
      
      if (!isCorrect) {
        // Find similar words using simple edit distance
        const similarWords = biblicalTerms.filter(term => {
          // More lenient matching for shorter words
          const maxDistance = cleanWord.length <= 4 ? 1 : 2;
          const maxLengthDiff = cleanWord.length <= 4 ? 1 : 2;
          
          return getEditDistance(cleanWord, term) <= maxDistance && 
                 (Math.abs(cleanWord.length - term.length) <= maxLengthDiff);
        })
        .sort((a, b) => {
          // Sort by edit distance, then by length similarity
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
    const newAnswer = gameState.userAnswer.replace(
      new RegExp(`\\b${originalWord}\\b`, 'gi'), 
      suggestion
    );
    setGameState(prev => ({ ...prev, userAnswer: newAnswer }));
    
    // Re-check spelling after applying suggestion
    const newSuggestions = spellCheck(newAnswer);
    setSpellCheckSuggestions(newSuggestions);
  };

  // Check spelling when user types
  useEffect(() => {
    if (gameState.userAnswer && !gameState.isAnswered) {
      const suggestions = spellCheck(gameState.userAnswer);
      setSpellCheckSuggestions(suggestions);
    } else {
      setSpellCheckSuggestions([]);
    }
  }, [gameState.userAnswer, gameState.isAnswered]);

  // Fetch available games
  const { data: games, isLoading } = useQuery({
    queryKey: ['/api/bible-games', selectedCategory, selectedDifficulty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      
      const response = await apiRequest(`/api/bible-games?${params.toString()}`);
      return response as BibleGame[];
    }
  });

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ['/api/bible-games/stats'],
    queryFn: async () => {
      const response = await apiRequest('/api/bible-games/stats');
      return response as UserGameStats;
    }
  });

  // Submit score mutation
  const submitScoreMutation = useMutation({
    mutationFn: async (scoreData: { gameId: number; score: number; timeCompleted: number; attempts: number }) => {
      return await apiRequest('POST', '/api/bible-games/score', scoreData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bible-games/stats'] });
      toast({
        title: "Score Recorded!",
        description: "Your progress has been saved.",
      });
    }
  });

  const startNewGameSession = (questionsCount: number = 5) => {
    if (!games || games.length === 0) return;
    
    // Ensure we have enough unique games for the session
    const maxQuestions = Math.min(questionsCount, games.length);
    
    // Select unique random games for the session
    const uniqueGames = new Set<number>(); // Track game IDs to ensure uniqueness
    const sessionGames: BibleGame[] = [];
    
    // Create a shuffled copy of games array for random selection
    const shuffledGames = [...games].sort(() => Math.random() - 0.5);
    
    // Select unique games for the session
    for (const game of shuffledGames) {
      if (sessionGames.length >= maxQuestions) break;
      
      // Check if we already have this game (by ID and content)
      const isDuplicate = sessionGames.some(existing => 
        existing.id === game.id || 
        (existing.question === game.question && existing.correctAnswer === game.correctAnswer)
      );
      
      if (!isDuplicate) {
        sessionGames.push(game);
        uniqueGames.add(game.id);
      }
    }
    
    // If we don't have enough unique games, warn user
    if (sessionGames.length < questionsCount) {
      toast({
        title: "Limited Questions Available",
        description: `Only ${sessionGames.length} unique questions available for this quiz.`,
        variant: "default"
      });
    }
    
    setGameSession({
      games: sessionGames,
      currentQuestionIndex: 0,
      totalQuestions: sessionGames.length,
      sessionScore: 0,
      sessionStarted: Date.now(),
      questionsAnswered: 0,
      correctAnswers: 0,
      isSessionActive: true
    });

    // Start first question
    if (sessionGames.length > 0) {
      setGameState({
        currentGame: sessionGames[0],
        userAnswer: '',
        showHint: false,
        hintIndex: 0,
        timeStarted: Date.now(),
        isAnswered: false,
        isCorrect: false,
        attempts: 0
      });
    }
  };

  const startSingleGame = () => {
    if (!games || games.length === 0) return;
    
    // For single games, still ensure we don't pick the same game as the current one
    let availableGames = games;
    if (gameState.currentGame) {
      availableGames = games.filter(game => 
        game.id !== gameState.currentGame!.id && 
        !(game.question === gameState.currentGame!.question && game.correctAnswer === gameState.currentGame!.correctAnswer)
      );
    }
    
    // If no different games available, use all games
    if (availableGames.length === 0) {
      availableGames = games;
    }
    
    const randomGame = availableGames[Math.floor(Math.random() * availableGames.length)];
    setGameState({
      currentGame: randomGame,
      userAnswer: '',
      showHint: false,
      hintIndex: 0,
      timeStarted: Date.now(),
      isAnswered: false,
      isCorrect: false,
      attempts: 0
    });

    // Reset session for single game
    setGameSession({
      games: [randomGame],
      currentQuestionIndex: 0,
      totalQuestions: 1,
      sessionScore: 0,
      sessionStarted: Date.now(),
      questionsAnswered: 0,
      correctAnswers: 0,
      isSessionActive: true
    });
  };

  // Flexible answer validation that handles multiple correct formats
  const isAnswerCorrect = (userAnswer: string, correctAnswer: string): boolean => {
    const normalize = (str: string) => str.toLowerCase().trim().replace(/[^\w\s]/g, '');
    const userNorm = normalize(userAnswer);
    const correctNorm = normalize(correctAnswer);
    
    // Exact match
    if (userNorm === correctNorm) return true;
    
    // Special handling for John 3:16 - very flexible validation
    if (correctNorm.includes('for god so loved the world')) {
      // Check for key phrases in any order
      const hasGodLoved = userNorm.includes('god') && (userNorm.includes('loved') || userNorm.includes('love'));
      const hasWorld = userNorm.includes('world');
      const hasGave = userNorm.includes('gave') || userNorm.includes('give');
      const hasSon = userNorm.includes('son') || userNorm.includes('jesus');
      const hasFor = userNorm.includes('for') || userNorm.includes('so');
      
      // If it has most key elements, consider it correct
      if (hasGodLoved && hasWorld && hasGave && hasSon) {
        return true;
      }
    }
    
    // Handle common variations for biblical answers
    const userWords = userNorm.split(/\s+/).filter(w => w.length > 0);
    const correctWords = correctNorm.split(/\s+/).filter(w => w.length > 0);
    
    // Check if user answer contains all key words from correct answer (ignoring common words)
    const skipWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'his', 'he', 'that'];
    const keyCorrectWords = correctWords.filter(w => !skipWords.includes(w));
    const keyUserWords = userWords.filter(w => !skipWords.includes(w));
    
    // Check if user has all the key words (in any order)
    const hasAllKeyWords = keyCorrectWords.every(word => 
      keyUserWords.some(userWord => 
        userWord.includes(word) || word.includes(userWord) || 
        // Handle common synonyms for biblical content
        (word === 'turned' && (userWord.includes('chang') || userWord.includes('transform'))) ||
        (word === 'wine' && userWord === 'wine') ||
        (word === 'water' && userWord === 'water') ||
        (word === 'loved' && (userWord.includes('love') || userWord.includes('loved'))) ||
        (word === 'gave' && (userWord.includes('give') || userWord.includes('gave') || userWord.includes('sent')))
      )
    );
    
    // Special case for "water to wine" vs "turned water into wine"
    if (correctNorm.includes('turned water into wine') || correctNorm.includes('water into wine')) {
      if (userNorm.includes('water') && userNorm.includes('wine') && 
          (userNorm.includes('to') || userNorm.includes('into') || userNorm.includes('turned'))) {
        return true;
      }
    }
    
    return hasAllKeyWords && keyCorrectWords.length > 0;
  };

  const submitAnswer = () => {
    if (!gameState.currentGame || !gameState.userAnswer.trim()) return;

    const attempts = gameState.attempts + 1;
    const isCorrect = isAnswerCorrect(gameState.userAnswer, gameState.currentGame.correctAnswer);
    
    // Debug logging for troubleshooting
    console.log('Answer validation:', {
      userAnswer: gameState.userAnswer,
      correctAnswer: gameState.currentGame.correctAnswer,
      isCorrect,
      normalized: {
        user: gameState.userAnswer.toLowerCase().trim().replace(/[^\w\s]/g, ''),
        correct: gameState.currentGame.correctAnswer.toLowerCase().trim().replace(/[^\w\s]/g, '')
      }
    });
    
    if (isCorrect) {
      const timeCompleted = Math.floor((Date.now() - gameState.timeStarted) / 1000);
      const basePoints = gameState.currentGame.points || 10;
      const score = Math.max(1, basePoints - (attempts - 1) * 2); // Penalty for wrong attempts
      
      submitScoreMutation.mutate({
        gameId: gameState.currentGame.id,
        score,
        timeCompleted,
        attempts
      });

      // Update session progress
      setGameSession(prev => ({
        ...prev,
        sessionScore: prev.sessionScore + score,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: prev.correctAnswers + 1
      }));

      setGameState(prev => ({ ...prev, isAnswered: true, isCorrect: true }));
      
      toast({
        title: "Correct! 🎉",
        description: `You earned ${score} points!`,
      });
    } else {
      setGameState(prev => ({ ...prev, attempts }));
      
      // After 3 wrong attempts, update session for incorrect answer
      if (attempts >= 3) {
        setGameSession(prev => ({
          ...prev,
          questionsAnswered: prev.questionsAnswered + 1
        }));
        setGameState(prev => ({ ...prev, isAnswered: true, isCorrect: false }));
        toast({
          title: "Answer revealed",
          description: `The correct answer was: ${gameState.currentGame.correctAnswer}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Not quite right",
          description: "Try again! Use a hint if you need help.",
          variant: "destructive",
        });
      }
    }
  };

  const showNextHint = () => {
    if (!gameState.currentGame) return;
    
    const hints = gameState.currentGame.hints ? JSON.parse(gameState.currentGame.hints) : [];
    if (gameState.hintIndex < hints.length - 1) {
      setGameState(prev => ({
        ...prev,
        showHint: true,
        hintIndex: prev.hintIndex + 1
      }));
    }
  };

  const nextQuestion = () => {
    if (!gameSession.isSessionActive || gameSession.currentQuestionIndex >= gameSession.totalQuestions - 1) {
      // Session complete
      setGameSession(prev => ({ ...prev, isSessionActive: false }));
      const accuracy = Math.round((gameSession.correctAnswers / gameSession.questionsAnswered) * 100);
      toast({
        title: "Session Complete! 🏆",
        description: `Final Score: ${gameSession.sessionScore} points (${accuracy}% accuracy)`,
      });
      return;
    }

    // Move to next question
    const nextIndex = gameSession.currentQuestionIndex + 1;
    const nextGame = gameSession.games[nextIndex];
    
    setGameSession(prev => ({ ...prev, currentQuestionIndex: nextIndex }));
    setGameState({
      currentGame: nextGame,
      userAnswer: '',
      showHint: false,
      hintIndex: 0,
      timeStarted: Date.now(),
      isAnswered: false,
      isCorrect: false,
      attempts: 0
    });
  };

  const resetGame = () => {
    setGameState({
      currentGame: null,
      userAnswer: '',
      showHint: false,
      hintIndex: 0,
      timeStarted: 0,
      isAnswered: false,
      isCorrect: false,
      attempts: 0
    });
    setGameSession({
      games: [],
      currentQuestionIndex: 0,
      totalQuestions: 5,
      sessionScore: 0,
      sessionStarted: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      isSessionActive: false
    });
  };

  const getGameIcon = (type: string) => {
    switch (type) {
      case 'scramble': return <Shuffle className="w-5 h-5" />;
      case 'fill_blank': return <BookOpen className="w-5 h-5" />;
      case 'character_guess': return <Users className="w-5 h-5" />;
      case 'memory_verse': return <Target className="w-5 h-5" />;
      default: return <Gamepad2 className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(207, 90%, 54%) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(43, 96%, 56%) 0%, transparent 50%)`
          }}
        />
      </div>

      <div className="relative min-h-screen">
        {/* Header - Mobile Optimized */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/")}
                  className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Back to Home</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold faith-gradient-text hidden xs:inline">Bible Games</span>
                <span className="text-sm font-bold faith-gradient-text xs:hidden">Games</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="text-gray-900">Test Your</span>
              <span className="faith-gradient-text"> Biblical Knowledge</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Challenge yourself with interactive Bible games covering Scripture, characters, places, and events. 
              Perfect for Bible study groups and personal spiritual growth!
            </p>
          </div>

          {/* User Stats */}
          {userStats && (
            <Card className="mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-500" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center p-3 sm:p-4 rounded-lg bg-blue-50">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{userStats.totalGamesPlayed}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Games Played</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-lg bg-green-50">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{userStats.totalScore}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Score</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-lg bg-purple-50">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">{userStats.bestStreak}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Best Streak</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-lg bg-orange-50">
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">{userStats.currentStreak}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Current Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Filters */}
          <Card className="mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                Choose Your Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="characters">Bible Characters</SelectItem>
                      <SelectItem value="places">Bible Places</SelectItem>
                      <SelectItem value="verses">Scripture Verses</SelectItem>
                      <SelectItem value="books">Bible Books</SelectItem>
                      <SelectItem value="events">Bible Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy (10 pts)</SelectItem>
                      <SelectItem value="medium">Medium (20 pts)</SelectItem>
                      <SelectItem value="hard">Hard (30 pts)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => startNewGameSession(5)} 
                      disabled={!games || games.length === 0 || isLoading}
                      className="w-full faith-button-primary touch-target mobile-tap"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start 5-Question Quiz
                    </Button>
                    <Button 
                      onClick={startSingleGame} 
                      disabled={!games || games.length === 0 || isLoading}
                      variant="outline"
                      className="w-full touch-target mobile-tap"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Single Question
                    </Button>
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>

          {/* Session Progress */}
          {gameSession.isSessionActive && gameSession.totalQuestions > 1 && (
            <Card className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-sm">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question {gameSession.currentQuestionIndex + 1} of {gameSession.totalQuestions}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    Score: {gameSession.sessionScore} pts
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress 
                    value={(gameSession.questionsAnswered / gameSession.totalQuestions) * 100} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {gameSession.correctAnswers}/{gameSession.questionsAnswered} correct
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Game */}
          {gameState.currentGame && (
            <Card className="mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      {getGameIcon(gameState.currentGame.type)}
                      <span className="ml-2 faith-gradient-text">{gameState.currentGame.title}</span>
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-200">
                        {gameState.currentGame.category}
                      </Badge>
                      <Badge className={`text-white ${getDifficultyColor(gameState.currentGame.difficulty)}`}>
                        {gameState.currentGame.difficulty}
                      </Badge>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        <Star className="w-3 h-3 mr-1" />
                        {gameState.currentGame.points} pts
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetGame}
                    className="ml-2 hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0 flex-shrink-0"
                    title="Close Game"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question */}
                <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-4 sm:p-6 rounded-lg border border-blue-100">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 text-blue-900 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Question:
                  </h3>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                    {gameState.currentGame.question}
                  </p>
                  {gameState.currentGame.scripture && (
                    <div className="mt-3">
                      <Badge variant="outline" className="text-blue-600 bg-white border-blue-200">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {gameState.currentGame.scripture}
                      </Badge>
                    </div>
                )}
              </div>

                {/* Hints */}
                {gameState.showHint && gameState.currentGame.hints && (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 mr-2" />
                      <span className="font-medium text-amber-800">Helpful Hint:</span>
                    </div>
                    <p className="text-amber-700 text-sm sm:text-base">
                      {JSON.parse(gameState.currentGame.hints)[gameState.hintIndex]}
                    </p>
                  </div>
                )}

                {/* Answer Input */}
                {!gameState.isAnswered && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">Your Answer:</label>
                      <Input
                        value={gameState.userAnswer}
                        onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                        placeholder="Type your answer here..."
                        onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                        className="text-base sm:text-lg border-gray-200 focus:border-blue-400 touch-target mobile-tap"
                        spellCheck={true}
                        autoComplete="off"
                        autoCorrect="on"
                      />
                    </div>

                    {/* Spell Check Suggestions */}
                    {spellCheckSuggestions.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
                          <span className="text-sm font-medium text-amber-800">Spelling Suggestions:</span>
                        </div>
                        <div className="space-y-2">
                          {spellCheckSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex flex-wrap items-center gap-2">
                              <span className="text-sm text-amber-700">
                                "<span className="font-medium">{suggestion.word}</span>" might be:
                              </span>
                              {suggestion.suggestions.map((word, wordIndex) => (
                                <Button
                                  key={wordIndex}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => applySuggestion(suggestion.word, word)}
                                  className="text-xs px-2 py-1 h-auto border-amber-300 text-amber-700 hover:bg-amber-100"
                                >
                                  {word}
                                </Button>
                              ))}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-amber-600 mt-2">
                          Click a suggestion to replace the word in your answer.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={submitAnswer} 
                        disabled={!gameState.userAnswer.trim()}
                        className="faith-button-primary touch-target mobile-tap"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Answer
                      </Button>
                      
                      {gameState.currentGame.hints && (
                        <Button 
                          variant="outline" 
                          onClick={showNextHint}
                          disabled={gameState.showHint && gameState.hintIndex >= JSON.parse(gameState.currentGame.hints).length - 1}
                          className="border-amber-300 text-amber-700 hover:bg-amber-50 touch-target mobile-tap"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          {gameState.showHint ? 'Next Hint' : 'Show Hint'}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={resetGame}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 touch-target mobile-tap"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Skip Game
                      </Button>
                    </div>

                    {gameState.attempts > 0 && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        Attempts: {gameState.attempts}
                      </div>
                    )}
                  </div>
                )}

                {/* Answer Results */}
                {gameState.isAnswered && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${gameState.isCorrect ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'}`}>
                      <div className="flex items-center mb-2">
                        {gameState.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mr-2" />
                        )}
                        <span className={`font-semibold text-base ${gameState.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          {gameState.isCorrect ? 'Excellent! Correct Answer!' : 'Not Quite Right'}
                        </span>
                      </div>
                      <p className={`text-sm sm:text-base ${gameState.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        The correct answer is: <strong>{gameState.currentGame.correctAnswer}</strong>
                      </p>
                      {gameState.isCorrect && (
                        <div className="mt-2 text-sm text-green-600">
                          +{gameState.currentGame.points} points earned!
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      {gameSession.isSessionActive && gameSession.currentQuestionIndex < gameSession.totalQuestions - 1 ? (
                        <Button 
                          onClick={nextQuestion}
                          className="faith-button-primary touch-target mobile-tap"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Next Question ({gameSession.currentQuestionIndex + 2}/{gameSession.totalQuestions})
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => startNewGameSession(5)}
                          className="faith-button-primary touch-target mobile-tap"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          New Quiz
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={resetGame}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 touch-target mobile-tap"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Back to Menu
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Bible games...</p>
              </CardContent>
            </Card>
          )}



          {/* Games Available */}
          {!gameState.currentGame && !isLoading && games && games.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              {/* Quick Start Section */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center text-lg sm:text-xl text-center justify-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                    Ready for Bible Study Fun?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 sm:py-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 faith-gradient-text">Let's Begin!</h3>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                      {games.length} engaging Bible games are ready for you. Test your knowledge and grow in faith!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => startNewGameSession(5)} 
                        size="lg"
                        className="faith-button-primary text-base sm:text-lg px-6 sm:px-8 py-3 touch-target mobile-tap"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start 5-Question Quiz
                      </Button>
                      <Button 
                        onClick={startSingleGame} 
                        size="lg"
                        variant="outline"
                        className="text-base sm:text-lg px-6 sm:px-8 py-3 touch-target mobile-tap"
                      >
                        <Shuffle className="w-5 h-5 mr-2" />
                        Random Single Game
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Browse All Games */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                    Browse All Games ({games.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {games.map((game) => (
                      <div
                        key={game.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-gray-50 to-white"
                        onClick={() => {
                          setGameState({
                            currentGame: game,
                            userAnswer: '',
                            showHint: false,
                            hintIndex: 0,
                            timeStarted: Date.now(),
                            isAnswered: false,
                            isCorrect: false,
                            attempts: 0
                          });
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getGameIcon(game.type)}
                            <span className="font-medium text-sm text-gray-900">{game.title}</span>
                          </div>
                          <Badge className={`text-white text-xs ${getDifficultyColor(game.difficulty)}`}>
                            {game.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {game.category}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-600">
                            <Star className="w-3 h-3 mr-1" />
                            {game.points} pts
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {game.question.substring(0, 80)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No Games Found */}
          {!gameState.currentGame && (!games || games.length === 0) && !isLoading && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Games Found</h3>
                <p className="text-gray-600 mb-4">
                  Try selecting different category and difficulty options above.
                </p>
                <Button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                  }}
                  variant="outline"
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}