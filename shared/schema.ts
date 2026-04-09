import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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

// Mission Groups Schema
export const missionGroups = pgTable("mission_groups", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  groupName: text("group_name").notNull(),
  leaderName: text("leader_name").notNull(),
  email: text("email").notNull(),
  church: text("church").notNull(),
  destination: text("destination").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  missionType: text("mission_type", { enum: ["short-term", "long-term", "local", "ongoing"] }).notNull(),
  description: text("description").notNull(),
  prayerNeeds: text("prayer_needs"),
  goalAmount: integer("goal_amount"),
  donationLink: text("donation_link"),
  websiteUrl: text("website_url"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMissionGroupSchema = createInsertSchema(missionGroups).omit({
  id: true,
  slug: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  groupName: z.string().min(2, "Group name must be at least 2 characters").max(100),
  leaderName: z.string().min(2, "Leader name is required").max(100),
  email: z.string().email("Valid email is required"),
  church: z.string().min(2, "Church/organization name is required").max(100),
  destination: z.string().min(2, "Destination is required").max(100),
  description: z.string().min(20, "Please provide at least 20 characters describing your mission").max(2000),
  prayerNeeds: z.string().max(1000).optional(),
  goalAmount: z.number().int().positive().optional().nullable(),
  donationLink: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  websiteUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
});

export const updateMissionGroupSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  groupName: z.string().min(2).max(100).optional(),
  leaderName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  church: z.string().min(2).max(100).optional(),
  destination: z.string().min(2).max(100).optional(),
  description: z.string().min(20).max(2000).optional(),
  prayerNeeds: z.string().max(1000).optional().nullable(),
  goalAmount: z.number().int().positive().optional().nullable(),
  donationLink: z.string().url().optional().nullable().or(z.literal("")),
  websiteUrl: z.string().url().optional().nullable().or(z.literal("")),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export type InsertMissionGroup = z.infer<typeof insertMissionGroupSchema>;
export type MissionGroup = typeof missionGroups.$inferSelect;

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
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type AdminLoginRequest = z.infer<typeof adminLoginSchema>;
