import type { BibleGame, GameScore, UserGameStats, InsertBibleGame, InsertGameScore } from '@shared/bible-games-schema';

// Sample Bible Games Data - In production, this would be in a database
export const sampleBibleGames: InsertBibleGame[] = [
  // Scripture Scramble Games
  {
    type: 'scramble',
    title: 'Unscramble this Bible Verse',
    question: 'Unscramble these words to reveal John 3:16: "God so For world loved the gave he his one and only Son"',
    correctAnswer: 'For God so loved the world that he gave his one and only Son',
    hints: JSON.stringify([
      'This is one of the most famous verses in the Bible',
      'It talks about God\'s love for humanity',
      'It mentions God\'s Son'
    ]),
    difficulty: 'easy',
    category: 'verses',
    scripture: 'John 3:16',
    points: 15
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: SESMO',
    correctAnswer: 'Moses',
    hints: JSON.stringify([
      'This person led the Israelites out of Egypt',
      'He received the Ten Commandments',
      'He parted the Red Sea'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  
  // Fill in the Blank Games
  {
    type: 'fill_blank',
    title: 'Complete the Verse',
    question: 'Complete this famous verse: "I can do all things through _____ who strengthens me."',
    correctAnswer: 'Christ',
    hints: JSON.stringify([
      'This verse is from Philippians 4:13',
      'It refers to Jesus',
      'Another name for the Messiah'
    ]),
    difficulty: 'easy',
    category: 'verses',
    scripture: 'Philippians 4:13',
    points: 12
  },
  {
    type: 'fill_blank',
    title: 'Complete the Verse',
    question: 'Fill in the blank: "The LORD is my _____, I shall not want."',
    correctAnswer: 'shepherd',
    hints: JSON.stringify([
      'This is from Psalm 23',
      'It\'s someone who takes care of sheep',
      'Jesus called himself the good _____'
    ]),
    difficulty: 'easy',
    category: 'verses',
    scripture: 'Psalm 23:1',
    points: 10
  },
  
  // Character Guessing Games
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was swallowed by a great fish for three days after trying to run away from God\'s command to preach to Nineveh.',
    correctAnswer: 'Jonah',
    hints: JSON.stringify([
      'I was a prophet',
      'I tried to sail to Tarshish instead',
      'My name starts with J'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 15
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was the strongest man in the Bible, but my strength came from my hair. I was betrayed by Delilah.',
    correctAnswer: 'Samson',
    hints: JSON.stringify([
      'I was a judge of Israel',
      'I killed a lion with my bare hands',
      'I pushed down the pillars of a temple'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 18
  },
  
  // Memory Verse Games
  {
    type: 'memory_verse',
    title: 'Complete the Memory Verse',
    question: 'Finish this verse: "Trust in the LORD with all your heart and lean not on your own ___..."',
    correctAnswer: 'understanding',
    hints: JSON.stringify([
      'This verse is from Proverbs 3:5',
      'It\'s the opposite of trusting yourself',
      'Synonym for knowledge or wisdom'
    ]),
    difficulty: 'medium',
    category: 'verses',
    scripture: 'Proverbs 3:5',
    points: 16
  },
  
  // Bible Places
  {
    type: 'fill_blank',
    title: 'Bible Geography',
    question: 'In which city was Jesus born?',
    correctAnswer: 'Bethlehem',
    hints: JSON.stringify([
      'It\'s in Judea',
      'It\'s also called the City of David',
      'It starts with the letter B'
    ]),
    difficulty: 'easy',
    category: 'places',
    points: 10
  },
  {
    type: 'character_guess',
    title: 'Bible Location',
    question: 'What mountain did Moses receive the Ten Commandments on?',
    correctAnswer: 'Mount Sinai',
    hints: JSON.stringify([
      'It\'s in the wilderness',
      'Also called Mount Horeb',
      'God appeared in fire and smoke here'
    ]),
    difficulty: 'medium',
    category: 'places',
    points: 14
  },
  
  // Hard Level Games
  {
    type: 'character_guess',
    title: 'Challenging Bible Character',
    question: 'Who am I? I was a queen who saved my people from destruction by revealing my identity to the king. I said "If I perish, I perish."',
    correctAnswer: 'Esther',
    hints: JSON.stringify([
      'I was married to King Ahasuerus',
      'I was Jewish but hid my identity',
      'Haman plotted against my people'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 25
  },
  {
    type: 'fill_blank',
    title: 'Advanced Scripture',
    question: 'Complete this verse: "Be strong and courageous! Do not be afraid or _____, for the LORD your God is with you wherever you go."',
    correctAnswer: 'discouraged',
    hints: JSON.stringify([
      'This is from Joshua 1:9',
      'It\'s the opposite of encouraged',
      'Another word for disheartened'
    ]),
    difficulty: 'hard',
    category: 'verses',
    scripture: 'Joshua 1:9',
    points: 20
  },

  // Additional Memory Verse Games
  {
    type: 'memory_verse',
    title: 'Easy Memory Verse',
    question: 'Complete this beloved verse: "For God so loved the world that he gave his one and only _____, that whoever believes in him shall not perish but have eternal life."',
    correctAnswer: 'Son',
    hints: JSON.stringify([
      'This is John 3:16',
      'It refers to Jesus',
      'God\'s only begotten'
    ]),
    difficulty: 'easy',
    category: 'verses',
    scripture: 'John 3:16',
    points: 10
  },
  {
    type: 'memory_verse',
    title: 'Hard Memory Verse',
    question: 'Complete this challenging verse: "And we know that in all things God works for the _____ of those who love him, who have been called according to his purpose."',
    correctAnswer: 'good',
    hints: JSON.stringify([
      'This is Romans 8:28',
      'It\'s the opposite of bad',
      'God brings positive outcomes'
    ]),
    difficulty: 'hard',
    category: 'verses',
    scripture: 'Romans 8:28',
    points: 25
  },

  // More Scripture Scramble Games
  {
    type: 'scramble',
    title: 'Medium Scripture Scramble',
    question: 'Unscramble this verse: "Peace be with you still and know that I am God"',
    correctAnswer: 'Be still and know that I am God',
    hints: JSON.stringify([
      'This is from Psalm 46:10',
      'It\'s about being calm and quiet',
      'It\'s about recognizing God\'s authority'
    ]),
    difficulty: 'medium',
    category: 'verses',
    scripture: 'Psalm 46:10',
    points: 18
  },
  {
    type: 'scramble',
    title: 'Hard Character Scramble',
    question: 'Unscramble this biblical name: HEZARIANBUCH',
    correctAnswer: 'Nebuchadnezzar',
    hints: JSON.stringify([
      'He was a Babylonian king',
      'He conquered Jerusalem',
      'Daniel interpreted his dreams'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 30
  },

  // Bible Books Games
  {
    type: 'fill_blank',
    title: 'Bible Books Easy',
    question: 'Which book comes after Matthew in the New Testament?',
    correctAnswer: 'Mark',
    hints: JSON.stringify([
      'It\'s one of the four Gospels',
      'Written by a companion of Peter',
      'Shortest Gospel'
    ]),
    difficulty: 'easy',
    category: 'books',
    points: 10
  },
  {
    type: 'scramble',
    title: 'Scrambled Bible Book',
    question: 'Unscramble this Bible book: SISENGE',
    correctAnswer: 'Genesis',
    hints: JSON.stringify([
      'First book of the Bible',
      'Tells the story of creation',
      'Contains stories of Adam, Noah, Abraham'
    ]),
    difficulty: 'medium',
    category: 'books',
    points: 15
  },
  {
    type: 'character_guess',
    title: 'Bible Book Challenge',
    question: 'In which book would you find the story of the walls of Jericho falling down?',
    correctAnswer: 'Joshua',
    hints: JSON.stringify([
      'It\'s named after Moses\' successor',
      'Contains stories of conquering the Promised Land',
      'The trumpets played a key role'
    ]),
    difficulty: 'hard',
    category: 'books',
    points: 22
  },

  // Bible Events Games
  {
    type: 'fill_blank',
    title: 'Biblical Events Easy',
    question: 'What did God create on the first day?',
    correctAnswer: 'light',
    hints: JSON.stringify([
      'It\'s the opposite of darkness',
      'God said "Let there be..."',
      'It was good'
    ]),
    difficulty: 'easy',
    category: 'events',
    points: 8
  },
  {
    type: 'character_guess',
    title: 'Biblical Events Medium',
    question: 'What miracle did Jesus perform at the wedding in Cana?',
    correctAnswer: 'turned water into wine',
    hints: JSON.stringify([
      'It was his first recorded miracle',
      'It happened at a celebration',
      'He transformed one liquid into another'
    ]),
    difficulty: 'medium',
    category: 'events',
    points: 16
  },
  {
    type: 'memory_verse',
    title: 'Creation Memory Verse',
    question: 'Complete: "In the beginning God created the _____ and the earth."',
    correctAnswer: 'heavens',
    hints: JSON.stringify([
      'This is Genesis 1:1',
      'It\'s above the earth',
      'Where the stars are'
    ]),
    difficulty: 'easy',
    category: 'events',
    scripture: 'Genesis 1:1',
    points: 10
  },

  // More Places Games
  {
    type: 'scramble',
    title: 'Biblical Places',
    question: 'Unscramble this biblical city: MESHLUREJA',
    correctAnswer: 'Jerusalem',
    hints: JSON.stringify([
      'The holy city',
      'David made it his capital',
      'Site of the Temple'
    ]),
    difficulty: 'medium',
    category: 'places',
    points: 18
  },
  {
    type: 'memory_verse',
    title: 'Places Memory Verse',
    question: 'Complete: "Pray for the peace of _____: May those who love you be secure."',
    correctAnswer: 'Jerusalem',
    hints: JSON.stringify([
      'This is Psalm 122:6',
      'It\'s the holy city',
      'Center of Jewish worship'
    ]),
    difficulty: 'medium',
    category: 'places',
    scripture: 'Psalm 122:6',
    points: 16
  }
];

export class BibleGamesService {
  private games: BibleGame[];
  private scores: GameScore[];
  private userStats: Map<string, UserGameStats>;

  constructor() {
    // In production, this would connect to a database
    this.games = sampleBibleGames.map((game, index) => ({
      id: index + 1,
      ...game,
      options: game.options || null,
      hints: game.hints || null,
      scripture: game.scripture || null,
      points: game.points || 10,
      isActive: true,
      createdAt: new Date()
    }));
    this.scores = [];
    this.userStats = new Map();
  }

  async getGames(category?: string, difficulty?: string): Promise<BibleGame[]> {
    let filteredGames = this.games.filter(game => game.isActive);
    
    if (category) {
      filteredGames = filteredGames.filter(game => game.category === category);
    }
    
    if (difficulty) {
      filteredGames = filteredGames.filter(game => game.difficulty === difficulty);
    }
    
    return filteredGames;
  }

  async getGameById(id: number): Promise<BibleGame | undefined> {
    return this.games.find(game => game.id === id && game.isActive);
  }

  async submitScore(userId: string, scoreData: InsertGameScore): Promise<GameScore> {
    const score: GameScore = {
      id: this.scores.length + 1,
      userId,
      gameId: scoreData.gameId || null,
      score: scoreData.score,
      timeCompleted: scoreData.timeCompleted || null,
      attempts: scoreData.attempts || 1,
      completedAt: new Date()
    };
    
    this.scores.push(score);
    await this.updateUserStats(userId, score);
    
    return score;
  }

  async getUserStats(userId: string): Promise<UserGameStats> {
    let stats = this.userStats.get(userId);
    
    if (!stats) {
      stats = {
        id: Array.from(this.userStats.keys()).length + 1,
        userId,
        totalGamesPlayed: 0,
        totalScore: 0,
        bestStreak: 0,
        currentStreak: 0,
        favoriteCategory: null,
        averageTime: null,
        lastPlayedAt: null,
        updatedAt: new Date()
      };
      this.userStats.set(userId, stats);
    }
    
    return stats;
  }

  private async updateUserStats(userId: string, newScore: GameScore): Promise<void> {
    const stats = await this.getUserStats(userId);
    const userScores = this.scores.filter(s => s.userId === userId);
    
    // Update basic stats
    stats.totalGamesPlayed = userScores.length;
    stats.totalScore = userScores.reduce((sum, score) => sum + score.score, 0);
    stats.lastPlayedAt = new Date();
    
    // Calculate average time
    const validTimes = userScores.filter(s => s.timeCompleted !== null).map(s => s.timeCompleted!);
    if (validTimes.length > 0) {
      stats.averageTime = Math.round(validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length);
    }
    
    // Find favorite category
    const categoryCount = new Map<string, number>();
    userScores.forEach(score => {
      const game = this.games.find(g => g.id === score.gameId);
      if (game) {
        categoryCount.set(game.category, (categoryCount.get(game.category) || 0) + 1);
      }
    });
    
    if (categoryCount.size > 0) {
      stats.favoriteCategory = Array.from(categoryCount.entries())
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }
    
    // Calculate streaks (simplified - consecutive correct answers)
    let currentStreak = 0;
    let bestStreak = 0;
    
    // Get recent scores in order
    const recentScores = userScores
      .filter(s => s.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 20); // Check last 20 games
    
    for (const score of recentScores.reverse()) {
      if (score.score > 0 && score.attempts === 1) { // Consider first-try success as streak
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    stats.currentStreak = currentStreak;
    stats.bestStreak = Math.max(stats.bestStreak, bestStreak);
    stats.updatedAt = new Date();
    
    this.userStats.set(userId, stats);
  }

  async getLeaderboard(category?: string, timeframe: 'all' | 'week' | 'month' = 'all'): Promise<Array<{
    userId: string;
    totalScore: number;
    gamesPlayed: number;
    averageScore: number;
  }>> {
    let filteredScores = this.scores;
    
    if (timeframe !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      if (timeframe === 'week') {
        cutoff.setDate(now.getDate() - 7);
      } else if (timeframe === 'month') {
        cutoff.setMonth(now.getMonth() - 1);
      }
      filteredScores = this.scores.filter(score => 
        score.completedAt && new Date(score.completedAt) >= cutoff
      );
    }
    
    if (category) {
      const categoryGameIds = this.games
        .filter(game => game.category === category)
        .map(game => game.id);
      filteredScores = filteredScores.filter(score => 
        score.gameId && categoryGameIds.includes(score.gameId)
      );
    }
    
    const userScores = new Map<string, { total: number; count: number }>();
    
    filteredScores.forEach(score => {
      const current = userScores.get(score.userId) || { total: 0, count: 0 };
      current.total += score.score;
      current.count += 1;
      userScores.set(score.userId, current);
    });
    
    return Array.from(userScores.entries())
      .map(([userId, data]) => ({
        userId,
        totalScore: data.total,
        gamesPlayed: data.count,
        averageScore: Math.round(data.total / data.count)
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  }
}