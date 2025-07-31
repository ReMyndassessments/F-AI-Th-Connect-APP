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
  XCircle, Lightbulb, Award, TrendingUp, ArrowLeft, X
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

  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const startNewGame = () => {
    if (!games || games.length === 0) return;
    
    const randomGame = games[Math.floor(Math.random() * games.length)];
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
  };

  // Flexible answer validation that handles multiple correct formats
  const isAnswerCorrect = (userAnswer: string, correctAnswer: string): boolean => {
    const normalize = (str: string) => str.toLowerCase().trim().replace(/[^\w\s]/g, '');
    const userNorm = normalize(userAnswer);
    const correctNorm = normalize(correctAnswer);
    
    // Exact match
    if (userNorm === correctNorm) return true;
    
    // Handle common variations for biblical answers
    const userWords = userNorm.split(/\s+/).filter(w => w.length > 0);
    const correctWords = correctNorm.split(/\s+/).filter(w => w.length > 0);
    
    // Check if user answer contains all key words from correct answer (ignoring common words)
    const skipWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'];
    const keyCorrectWords = correctWords.filter(w => !skipWords.includes(w));
    const keyUserWords = userWords.filter(w => !skipWords.includes(w));
    
    // Check if user has all the key words (in any order)
    const hasAllKeyWords = keyCorrectWords.every(word => 
      keyUserWords.some(userWord => 
        userWord.includes(word) || word.includes(userWord) || 
        // Handle common synonyms for biblical content
        (word === 'turned' && (userWord.includes('chang') || userWord.includes('transform'))) ||
        (word === 'wine' && userWord === 'wine') ||
        (word === 'water' && userWord === 'water')
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

      setGameState(prev => ({ ...prev, isAnswered: true, isCorrect: true }));
      
      toast({
        title: "Correct! 🎉",
        description: `You earned ${score} points!`,
      });
    } else {
      setGameState(prev => ({ ...prev, attempts }));
      toast({
        title: "Not quite right",
        description: "Try again! Use a hint if you need help.",
        variant: "destructive",
      });
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
                  <Button 
                    onClick={startNewGame} 
                    disabled={!games || games.length === 0 || isLoading}
                    className="w-full faith-button-primary touch-target mobile-tap"
                  >
                  <Play className="w-4 h-4 mr-2" />
                  Start New Game
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
                      />
                    </div>
                    
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
                      <Button 
                        onClick={startNewGame}
                        className="faith-button-primary touch-target mobile-tap"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Next Game
                      </Button>
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
                    <Button 
                      onClick={startNewGame} 
                      size="lg"
                      className="faith-button-primary text-base sm:text-lg px-6 sm:px-8 py-3 touch-target mobile-tap"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Random Game
                    </Button>
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