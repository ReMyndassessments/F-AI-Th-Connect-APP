import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email"),
  role: text("role", { enum: ["owner", "admin"] }).notNull().default("admin"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  adminUserId: integer("admin_user_id").notNull().references(() => adminUsers.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  scriptureReferences: text("scripture_references"), // JSON string of scripture references
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  sessionId: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sessionId: true,
  role: true,
  content: true,
  scriptureReferences: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Feature Flags Schema
export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  enabled: boolean("enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Advertisements Schema
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  type: text("type", { enum: ["book", "course", "event", "ministry", "other"] }).notNull(),
  placement: text("placement", { enum: ["chat_sidebar", "between_messages", "home_banner", "footer"] }).notNull(),
  active: boolean("active").default(false).notNull(),
  priority: integer("priority").default(0).notNull(),
  targetAudience: text("target_audience"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  clickCount: integer("click_count").default(0).notNull(),
  impressionCount: integer("impression_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Monthly Hero Photos Schema
export const monthlyPhotos = pgTable("monthly_photos", {
  id: serial("id").primaryKey(),
  month: integer("month").notNull(), // 1-12 for Jan-Dec
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text").notNull(),
  theme: text("theme").notNull(), // e.g., "New Beginnings", "Spring Renewal", etc.
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).pick({
  name: true,
  description: true,
  enabled: true,
});

export const insertAdvertisementSchema = createInsertSchema(advertisements).pick({
  title: true,
  description: true,
  imageUrl: true,
  linkUrl: true,
  type: true,
  placement: true,
  active: true,
  priority: true,
  targetAudience: true,
  startDate: true,
  endDate: true,
});

export const insertMonthlyPhotoSchema = createInsertSchema(monthlyPhotos).pick({
  month: true,
  title: true,
  description: true,
  imageUrl: true,
  altText: true,
  theme: true,
  isActive: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  passwordHash: true,
  email: true,
  role: true,
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
export type Advertisement = typeof advertisements.$inferSelect;
export type InsertMonthlyPhoto = z.infer<typeof insertMonthlyPhotoSchema>;
export type MonthlyPhoto = typeof monthlyPhotos.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type AdminLoginRequest = z.infer<typeof adminLoginSchema>;
