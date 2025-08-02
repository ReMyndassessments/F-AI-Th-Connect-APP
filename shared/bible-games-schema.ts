import { pgTable, serial, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Bible Games Schema
export const bibleGames = pgTable("bible_games", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'scramble', 'fill_blank', 'character_guess', 'memory_verse'
  title: varchar("title", { length: 200 }).notNull(),
  question: text("question").notNull(),
  correctAnswer: varchar("correct_answer", { length: 500 }).notNull(),
  options: text("options"), // JSON array for multiple choice
  hints: text("hints"), // JSON array of progressive hints
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // 'easy', 'medium', 'hard'
  category: varchar("category", { length: 50 }).notNull(), // 'characters', 'places', 'verses', 'books'
  scripture: varchar("scripture", { length: 100 }), // Bible reference if applicable
  points: integer("points").default(10),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  gameId: integer("game_id").references(() => bibleGames.id),
  score: integer("score").notNull(),
  timeCompleted: integer("time_completed"), // seconds
  attempts: integer("attempts").default(1),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const userGameStats = pgTable("user_game_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  totalGamesPlayed: integer("total_games_played").default(0),
  totalScore: integer("total_score").default(0),
  bestStreak: integer("best_streak").default(0),
  currentStreak: integer("current_streak").default(0),
  favoriteCategory: varchar("favorite_category", { length: 50 }),
  averageTime: integer("average_time"), // seconds
  lastPlayedAt: timestamp("last_played_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas
export const insertBibleGameSchema = createInsertSchema(bibleGames).omit({
  id: true,
  createdAt: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  completedAt: true,
});

export const insertUserGameStatsSchema = createInsertSchema(userGameStats).omit({
  id: true,
  updatedAt: true,
});

// Types
export type BibleGame = typeof bibleGames.$inferSelect & {
  multipleChoiceOptions?: string[];
};
export type InsertBibleGame = z.infer<typeof insertBibleGameSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type UserGameStats = typeof userGameStats.$inferSelect;
export type InsertUserGameStats = z.infer<typeof insertUserGameStatsSchema>;

// Game types enum
export const GAME_TYPES = {
  SCRAMBLE: 'scramble',
  FILL_BLANK: 'fill_blank',
  CHARACTER_GUESS: 'character_guess',
  MEMORY_VERSE: 'memory_verse'
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const;

export const GAME_CATEGORIES = {
  CHARACTERS: 'characters',
  PLACES: 'places',
  VERSES: 'verses',
  BOOKS: 'books',
  EVENTS: 'events'
} as const;