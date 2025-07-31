import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2, Trophy, Clock, Target, Shuffle, BookOpen, 
  Users, MapPin, Star, Play, RotateCcw, CheckCircle, 
  XCircle, Lightbulb, Award, TrendingUp 
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
      return await apiRequest('/api/bible-games/score', scoreData);
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

  const submitAnswer = () => {
    if (!gameState.currentGame || !gameState.userAnswer.trim()) return;

    const attempts = gameState.attempts + 1;
    const isCorrect = gameState.userAnswer.toLowerCase().trim() === 
                     gameState.currentGame.correctAnswer.toLowerCase().trim();
    
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Bible Word Games
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test your biblical knowledge with fun, interactive games
          </p>
        </div>

        {/* User Stats */}
        {userStats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalGamesPlayed}</div>
                  <div className="text-sm text-gray-500">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.totalScore}</div>
                  <div className="text-sm text-gray-500">Total Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.bestStreak}</div>
                  <div className="text-sm text-gray-500">Best Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</div>
                  <div className="text-sm text-gray-500">Current Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Game Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
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
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={startNewGame} 
                  disabled={!games || games.length === 0 || isLoading}
                  className="w-full"
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
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  {getGameIcon(gameState.currentGame.type)}
                  <span className="ml-2">{gameState.currentGame.title}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {gameState.currentGame.category}
                  </Badge>
                  <Badge className={`text-white ${getDifficultyColor(gameState.currentGame.difficulty)}`}>
                    {gameState.currentGame.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1" />
                    {gameState.currentGame.points} pts
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  Question:
                </h3>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {gameState.currentGame.question}
                </p>
                {gameState.currentGame.scripture && (
                  <div className="mt-3">
                    <Badge variant="outline" className="text-blue-600">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {gameState.currentGame.scripture}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Hints */}
              {gameState.showHint && gameState.currentGame.hints && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Hint:</span>
                  </div>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    {JSON.parse(gameState.currentGame.hints)[gameState.hintIndex]}
                  </p>
                </div>
              )}

              {/* Answer Input */}
              {!gameState.isAnswered && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Answer:</label>
                    <Input
                      value={gameState.userAnswer}
                      onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                      placeholder="Type your answer here..."
                      onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                      className="text-lg"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={submitAnswer} disabled={!gameState.userAnswer.trim()}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Answer
                    </Button>
                    
                    {gameState.currentGame.hints && (
                      <Button 
                        variant="outline" 
                        onClick={showNextHint}
                        disabled={gameState.showHint && gameState.hintIndex >= JSON.parse(gameState.currentGame.hints).length - 1}
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        {gameState.showHint ? 'Next Hint' : 'Show Hint'}
                      </Button>
                    )}
                    
                    <Button variant="outline" onClick={resetGame}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Skip Game
                    </Button>
                  </div>

                  {gameState.attempts > 0 && (
                    <div className="text-sm text-gray-500">
                      Attempts: {gameState.attempts}
                    </div>
                  )}
                </div>
              )}

              {/* Correct Answer Display */}
              {gameState.isAnswered && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${gameState.isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <div className="flex items-center mb-2">
                      {gameState.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mr-2" />
                      )}
                      <span className={`font-medium ${gameState.isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                        {gameState.isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    <p className={`${gameState.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                      The correct answer is: <strong>{gameState.currentGame.correctAnswer}</strong>
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={startNewGame}>
                      <Play className="w-4 h-4 mr-2" />
                      Next Game
                    </Button>
                    <Button variant="outline" onClick={resetGame}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Back to Menu
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Available Games Info */}
        {!gameState.currentGame && games && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                Available Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Play?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {games.length} games available in your selected category and difficulty level.
                </p>
                <Button onClick={startNewGame} size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Your First Game
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}