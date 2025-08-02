import { useState, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
// Removed EnhancedInput import - using standard input and dropdown selections
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2, Trophy, Clock, Target, Shuffle, BookOpen, 
  Users, MapPin, Star, Play, RotateCcw, CheckCircle, 
  XCircle, Lightbulb, Award, TrendingUp, ArrowLeft, X, SkipForward,
  Coffee, UserCheck, Zap, MessageCircle, Settings
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

// Removed spell check interface - using dropdown selections instead

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

interface IcebreakerChallenge {
  questions: BibleGame[];
  format: string;
  instructions: string;
  teamMode: boolean;
}

interface TeamBuildingChallenge {
  warmUp: BibleGame[];
  collaboration: BibleGame[];
  discussion: BibleGame[];
}

function BibleGamesComponent() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeMode, setActiveMode] = useState<'individual' | 'icebreaker' | 'quickfire' | 'team-building'>('individual');
  const [icebreakerChallenge, setIcebreakerChallenge] = useState<IcebreakerChallenge | null>(null);
  const [teamBuildingChallenge, setTeamBuildingChallenge] = useState<TeamBuildingChallenge | null>(null);
  const [icebreakerSettings, setIcebreakerSettings] = useState({
    participants: 6,
    timeLimit: 15
  });
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

  // Removed spell check - using dropdown selections instead

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Removed biblical terms dictionary - using dropdown selections instead

  // Removed all spell check functions - using dropdown selections instead

  // Removed spell check useEffect - using dropdown selections instead

  // Fetch available games with error handling
  const { data: games, isLoading, error } = useQuery({
    queryKey: ['/api/bible-games', selectedCategory, selectedDifficulty],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
        
        const response = await apiRequest(`/api/bible-games?${params.toString()}`);
        return response as BibleGame[];
      } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

  // Icebreaker mutations
  const createIcebreakerMutation = useMutation({
    mutationFn: async (settings: { participants: number; timeLimit: number }): Promise<IcebreakerChallenge> => {
      const response = await apiRequest('POST', '/api/bible-games/icebreaker', settings);
      const data = await response.json();
      return data as IcebreakerChallenge;
    },
    onSuccess: (data: IcebreakerChallenge) => {
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        toast({
          title: "Error",
          description: "Invalid icebreaker data received. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setIcebreakerChallenge(data);
      setActiveMode('icebreaker');
      toast({
        title: "Icebreaker Challenge Created!",
        description: `Generated ${data.questions.length} questions for ${data.format || 'group'} format.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create icebreaker challenge. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getQuickFireMutation = useMutation({
    mutationFn: async (count: number = 10) => {
      return apiRequest(`/api/bible-games/quickfire?count=${count}`);
    },
    onSuccess: (questions) => {
      setGameSession({
        games: questions,
        currentQuestionIndex: 0,
        totalQuestions: questions.length,
        sessionScore: 0,
        sessionStarted: Date.now(),
        questionsAnswered: 0,
        correctAnswers: 0,
        isSessionActive: true
      });
      setActiveMode('quickfire');
    }
  });

  const getTeamBuildingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/bible-games/team-building');
    },
    onSuccess: (data) => {
      setTeamBuildingChallenge(data);
      setActiveMode('team-building');
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
    try {
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
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const showNextHint = () => {
    if (!gameState.currentGame) return;
    
    try {
      const hints = gameState.currentGame.hints ? JSON.parse(gameState.currentGame.hints) : [];
      if (gameState.hintIndex < hints.length - 1) {
        setGameState(prev => ({
          ...prev,
          showHint: true,
          hintIndex: prev.hintIndex + 1
        }));
      } else {
        setGameState(prev => ({ ...prev, showHint: true }));
      }
    } catch (error) {
      console.error('Error parsing hints:', error);
      setGameState(prev => ({ ...prev, showHint: true }));
    }
  };

  const skipQuestion = () => {
    if (!gameState.currentGame || !gameSession.isSessionActive) return;
    
    // Mark question as answered (but incorrect) and move to next
    setGameSession(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1
    }));
    
    setGameState(prev => ({ ...prev, isAnswered: true, isCorrect: false }));
    
    toast({
      title: "Question Skipped",
      description: `The answer was: ${gameState.currentGame.correctAnswer}`,
      variant: "default",
    });
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Hero Section - Mobile Optimized */}
          <div className="text-center mb-6 sm:mb-10 lg:mb-12 px-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              <span className="text-gray-900">Test Your</span>
              <span className="faith-gradient-text"> Biblical Knowledge</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
              Challenge yourself with interactive Bible games covering Scripture, characters, places, and events. 
              Perfect for Bible study groups and personal spiritual growth!
            </p>
          </div>

          {/* User Stats - Mobile Optimized */}
          {userStats && (
            <Card className="mb-5 sm:mb-7 lg:mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg bible-games-card">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="flex items-center text-base sm:text-lg lg:text-xl">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-500" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{userStats.totalGamesPlayed}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Games Played</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{userStats.totalScore}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Score</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{userStats.bestStreak}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Best Streak</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{userStats.currentStreak}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Current Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Mode Selection - Mobile Optimized */}
          <Card className="mb-5 sm:mb-7 lg:mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg bible-games-card">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="flex items-center text-base sm:text-lg lg:text-xl">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                Choose Your Game Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {/* Mode Selection - Mobile Optimized */}
              <div className="space-y-3 mb-8">
                {/* Primary Mode - Individual Play */}
                <div 
                  onClick={() => setActiveMode('individual')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all touch-target game-mode-card mobile-tap ${
                    activeMode === 'individual' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activeMode === 'individual' ? 'bg-blue-500' : 'bg-gray-100'
                      }`}>
                        <Target className={`w-5 h-5 ${
                          activeMode === 'individual' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          activeMode === 'individual' ? 'text-blue-900' : 'text-gray-900'
                        }`}>Individual Play</h3>
                        <p className="text-sm text-gray-600">Test your knowledge solo</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      activeMode === 'individual' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {activeMode === 'individual' && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secondary Modes - Compact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    onClick={() => setActiveMode('icebreaker')}
                    className={`p-3 rounded-lg border cursor-pointer transition-all touch-target game-mode-card mobile-tap ${
                      activeMode === 'icebreaker' 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Coffee className={`w-4 h-4 ${
                        activeMode === 'icebreaker' ? 'text-purple-600' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        activeMode === 'icebreaker' ? 'text-purple-900' : 'text-gray-700'
                      }`}>Bible Study Icebreaker</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setActiveMode('quickfire')}
                    className={`p-3 rounded-lg border cursor-pointer transition-all touch-target game-mode-card mobile-tap ${
                      activeMode === 'quickfire' 
                        ? 'border-orange-400 bg-orange-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Zap className={`w-4 h-4 ${
                        activeMode === 'quickfire' ? 'text-orange-600' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        activeMode === 'quickfire' ? 'text-orange-900' : 'text-gray-700'
                      }`}>Quick Fire</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setActiveMode('team-building')}
                    className={`p-3 rounded-lg border cursor-pointer transition-all touch-target game-mode-card mobile-tap ${
                      activeMode === 'team-building' 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className={`w-4 h-4 ${
                        activeMode === 'team-building' ? 'text-green-600' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        activeMode === 'team-building' ? 'text-green-900' : 'text-gray-700'
                      }`}>Team Building</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Play Mode - Mobile Optimized */}
              {activeMode === 'individual' && (
                <div className="space-y-6">
                  {/* Category & Difficulty Selection */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-3 block text-gray-800">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-400 rounded-xl touch-target">
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
                      <label className="text-sm font-semibold mb-3 block text-gray-800">Difficulty</label>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-400 rounded-xl touch-target">
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
                  </div>

                  {/* Action Buttons - Mobile Optimized */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => startNewGameSession(5)} 
                      disabled={!games || games.length === 0 || isLoading}
                      className="w-full h-14 text-base font-semibold faith-button-primary touch-target rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Play className="w-5 h-5 mr-3" />
                      Start 5-Question Quiz
                    </Button>
                    
                    <Button 
                      onClick={startSingleGame} 
                      disabled={!games || games.length === 0 || isLoading}
                      variant="outline"
                      className="w-full h-12 text-base font-medium touch-target rounded-xl border-2 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Single Question
                    </Button>
                  </div>
                </div>
              )}

              {/* Icebreaker Mode */}
              {activeMode === 'icebreaker' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Perfect for Bible Study Groups!</h3>
                    <p className="text-blue-700 text-sm">
                      Create customized challenges to get your group talking and learning together. 
                      Questions are automatically balanced across difficulty levels.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">Number of Participants</label>
                      <Select 
                        value={icebreakerSettings.participants.toString()} 
                        onValueChange={(value) => setIcebreakerSettings(prev => ({ ...prev, participants: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 people</SelectItem>
                          <SelectItem value="4">4 people</SelectItem>
                          <SelectItem value="5">5 people</SelectItem>
                          <SelectItem value="6">6 people</SelectItem>
                          <SelectItem value="8">8 people</SelectItem>
                          <SelectItem value="10">10 people</SelectItem>
                          <SelectItem value="12">12 people</SelectItem>
                          <SelectItem value="15">15 people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">Time Limit (minutes)</label>
                      <Select 
                        value={icebreakerSettings.timeLimit.toString()} 
                        onValueChange={(value) => setIcebreakerSettings(prev => ({ ...prev, timeLimit: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="20">20 minutes</SelectItem>
                          <SelectItem value="25">25 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    onClick={() => createIcebreakerMutation.mutate(icebreakerSettings)}
                    disabled={createIcebreakerMutation.isPending}
                    className="w-full faith-button-primary"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    {createIcebreakerMutation.isPending ? 'Creating Challenge...' : 'Create Icebreaker Challenge'}
                  </Button>
                </div>
              )}

              {/* Quick Fire Mode */}
              {activeMode === 'quickfire' && (
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-orange-800 mb-2">Rapid-Fire Biblical Knowledge!</h3>
                    <p className="text-orange-700 text-sm">
                      Quick questions perfect for energizing your group with fast-paced biblical challenges.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button onClick={() => getQuickFireMutation.mutate(10)} className="faith-button-primary">
                      <Zap className="w-4 h-4 mr-2" />
                      10 Questions
                    </Button>
                    <Button onClick={() => getQuickFireMutation.mutate(15)} className="faith-button-primary">
                      <Zap className="w-4 h-4 mr-2" />
                      15 Questions
                    </Button>
                    <Button onClick={() => getQuickFireMutation.mutate(20)} className="faith-button-primary">
                      <Zap className="w-4 h-4 mr-2" />
                      20 Questions
                    </Button>
                  </div>
                </div>
              )}

              {/* Team Building Mode */}
              {activeMode === 'team-building' && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Structured Team Challenges!</h3>
                    <p className="text-green-700 text-sm">
                      Progressive challenges with warm-up, collaboration, and discussion phases designed to build connections.
                    </p>
                  </div>
                  <Button 
                    onClick={() => getTeamBuildingMutation.mutate()}
                    disabled={getTeamBuildingMutation.isPending}
                    className="w-full faith-button-primary"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {getTeamBuildingMutation.isPending ? 'Preparing Challenge...' : 'Start Team Building Challenge'}
                  </Button>
                </div>
              )}
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
                      {(() => {
                        try {
                          const hints = JSON.parse(gameState.currentGame.hints);
                          return hints[gameState.hintIndex] || 'No hint available';
                        } catch (error) {
                          console.error('Error parsing hints:', error);
                          return 'Hint not available';
                        }
                      })()}
                    </p>
                  </div>
                )}

                {/* Answer Input */}
                {!gameState.isAnswered && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">Your Answer:</label>
                      {gameState.currentGame?.multipleChoiceOptions && Array.isArray(gameState.currentGame.multipleChoiceOptions) && gameState.currentGame.multipleChoiceOptions.length > 0 ? (
                        <Select
                          value={gameState.userAnswer}
                          onValueChange={(value) => {
                            try {
                              setGameState(prev => ({ ...prev, userAnswer: value }));
                            } catch (error) {
                              console.error('Error setting user answer:', error);
                            }
                          }}
                        >
                          <SelectTrigger className="text-base sm:text-lg border-gray-200 focus:border-blue-400 touch-target mobile-tap min-h-12">
                            <SelectValue placeholder="Choose your answer..." />
                          </SelectTrigger>
                          <SelectContent>
                            {gameState.currentGame.multipleChoiceOptions.filter(option => option && typeof option === 'string').map((option, index) => (
                              <SelectItem 
                                key={`mc-option-${index}-${option.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '')}`}
                                value={option}
                                className="text-base sm:text-lg py-3 touch-target"
                              >
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <input
                          type="text"
                          value={gameState.userAnswer}
                          onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                          placeholder="Type your answer here..."
                          onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                          className="w-full text-base sm:text-lg border border-gray-200 focus:border-blue-400 touch-target mobile-tap rounded-md px-3 py-2"
                          autoComplete="off"
                        />
                      )}
                    </div>

                    {/* Removed spell check suggestions - using dropdown selections */}
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => {
                          try {
                            submitAnswer();
                          } catch (error) {
                            console.error('Error in submit button click:', error);
                          }
                        }} 
                        disabled={!gameState.userAnswer?.trim()}
                        className="faith-button-primary touch-target mobile-tap"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Answer
                      </Button>
                      
                      {gameState.currentGame.hints && (
                        <Button 
                          variant="outline" 
                          onClick={showNextHint}
                          disabled={gameState.showHint && (() => {
                            try {
                              const hints = JSON.parse(gameState.currentGame.hints);
                              return gameState.hintIndex >= hints.length - 1;
                            } catch (error) {
                              return true;
                            }
                          })()}
                          className="border-amber-300 text-amber-700 hover:bg-amber-50 touch-target mobile-tap"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          {gameState.showHint ? 'Next Hint' : 'Show Hint'}
                        </Button>
                      )}
                      
                      {/* Skip Question button - only show in multi-question sessions */}
                      {gameSession.isSessionActive && gameSession.totalQuestions > 1 && (
                        <Button 
                          variant="outline" 
                          onClick={skipQuestion}
                          className="border-orange-300 text-orange-700 hover:bg-orange-50 touch-target mobile-tap"
                        >
                          <SkipForward className="w-4 h-4 mr-2" />
                          Skip Question
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

export default function BibleGames() {
  return (
    <ErrorBoundary>
      <BibleGamesComponent />
    </ErrorBoundary>
  );
}