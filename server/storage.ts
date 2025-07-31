import { 
  users, chatSessions, messages, featureFlags, advertisements, adminUsers, adminSessions,
  type User, type InsertUser, type ChatSession, type InsertChatSession, 
  type Message, type InsertMessage, type FeatureFlag, type InsertFeatureFlag,
  type Advertisement, type InsertAdvertisement, type AdminUser, type InsertAdminUser,
  type AdminSession
} from "@shared/schema";
import fs from "fs";
import path from "path";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  deleteChatSession(sessionId: string): Promise<void>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySession(sessionId: string): Promise<Message[]>;
  deleteMessage(id: number): Promise<void>;
  
  // Feature Flags
  getFeatureFlags(): Promise<FeatureFlag[]>;
  getFeatureFlag(name: string): Promise<FeatureFlag | undefined>;
  createFeatureFlag(flag: InsertFeatureFlag): Promise<FeatureFlag>;
  updateFeatureFlag(id: number, updates: Partial<FeatureFlag>): Promise<FeatureFlag>;
  deleteFeatureFlag(id: number): Promise<void>;
  
  // Advertisements
  getAdvertisements(): Promise<Advertisement[]>;
  getActiveAdvertisements(placement?: string): Promise<Advertisement[]>;
  getAdvertisement(id: number): Promise<Advertisement | undefined>;
  createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement>;
  updateAdvertisement(id: number, updates: Partial<Advertisement>): Promise<Advertisement>;
  deleteAdvertisement(id: number): Promise<void>;
  incrementAdClicks(id: number): Promise<void>;
  incrementAdImpressions(id: number): Promise<void>;
  
  // Admin Authentication
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminSession(sessionId: string, adminUserId: number, expiresAt: Date): Promise<AdminSession>;
  getAdminSession(sessionId: string): Promise<(AdminSession & { user: AdminUser }) | undefined>;
  deleteAdminSession(sessionId: string): Promise<void>;
  updateAdminUserLastLogin(userId: number): Promise<void>;
  
  // Analytics for Advertisers
  getAnalytics(): Promise<{
    totalSessions: number;
    totalMessages: number;
    avgMessagesPerSession: number;
    activeSessionsToday: number;
    totalAdImpressions: number;
    totalAdClicks: number;
    avgCTR: number;
    topPlacements: Array<{placement: string; impressions: number; clicks: number; ctr: number}>;
    dailyStats: Array<{date: string; sessions: number; messages: number; impressions: number; clicks: number}>;
    sessionDurations: Array<number>;
    messageVolumeTrends: Array<{hour: number; count: number}>;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatSessions: Map<string, ChatSession>;
  private messages: Map<string, Message[]>;
  private featureFlags: Map<number, FeatureFlag>;
  private advertisements: Map<number, Advertisement>;
  private adminUsers: Map<number, AdminUser>;
  private adminSessions: Map<string, AdminSession>;
  private adminDataFile: string;
  private flagsDataFile: string;
  private currentUserId: number;
  private currentSessionId: number;
  private currentMessageId: number;
  private currentFeatureFlagId: number;
  private currentAdvertisementId: number;
  private currentAdminUserId: number;
  private currentAdminSessionId: number;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
    this.messages = new Map();
    this.featureFlags = new Map();
    this.advertisements = new Map();
    this.adminUsers = new Map();
    this.adminSessions = new Map();
    this.adminDataFile = path.join(process.cwd(), '.admin-data.json');
    this.flagsDataFile = path.join(process.cwd(), '.feature-flags.json');
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentMessageId = 1;
    this.currentFeatureFlagId = 1;
    this.currentAdvertisementId = 1;
    this.currentAdminUserId = 1;
    this.currentAdminSessionId = 1;
    
    // Load persisted admin data and feature flags, then initialize defaults
    this.loadAdminData();
    this.loadFeatureFlags();
    this.initializeDefaults();
    this.initializeAdvertisements();
  }

  private loadAdminData(): void {
    try {
      if (fs.existsSync(this.adminDataFile)) {
        const data = JSON.parse(fs.readFileSync(this.adminDataFile, 'utf8'));
        if (data.adminUser) {
          // Restore dates
          data.adminUser.createdAt = new Date(data.adminUser.createdAt);
          data.adminUser.updatedAt = new Date(data.adminUser.updatedAt);
          data.adminUser.lastLogin = data.adminUser.lastLogin ? new Date(data.adminUser.lastLogin) : null;
          
          this.adminUsers.set(data.adminUser.id, data.adminUser);
          this.currentAdminUserId = data.adminUser.id + 1;
          console.log('✓ Admin credentials loaded from persistent storage');
        }
      }
    } catch (error) {
      console.log('No persistent admin data found, will use defaults');
    }
  }

  private saveAdminData(): void {
    try {
      const adminUser = this.adminUsers.get(1);
      if (adminUser) {
        const data = { adminUser };
        fs.writeFileSync(this.adminDataFile, JSON.stringify(data, null, 2));
        console.log('✓ Admin credentials saved to persistent storage');
      }
    } catch (error) {
      console.error('Failed to save admin data:', error);
    }
  }

  private loadFeatureFlags(): void {
    try {
      if (fs.existsSync(this.flagsDataFile)) {
        const data = JSON.parse(fs.readFileSync(this.flagsDataFile, 'utf8'));
        if (data.featureFlags && Array.isArray(data.featureFlags)) {
          // Restore dates
          data.featureFlags.forEach((flag: any) => {
            flag.createdAt = new Date(flag.createdAt);
            flag.updatedAt = new Date(flag.updatedAt);
            this.featureFlags.set(flag.id, flag);
          });
          this.currentFeatureFlagId = Math.max(...data.featureFlags.map((f: any) => f.id)) + 1;
          console.log('✓ Feature flags loaded from persistent storage');
        }
      }
    } catch (error) {
      console.log('No persistent feature flags found, will use defaults');
    }
  }

  private saveFeatureFlags(): void {
    try {
      const featureFlags = Array.from(this.featureFlags.values());
      const data = { featureFlags };
      fs.writeFileSync(this.flagsDataFile, JSON.stringify(data, null, 2));
      console.log('✓ Feature flags saved to persistent storage');
    } catch (error) {
      console.error('Failed to save feature flags:', error);
    }
  }

  private initializeDefaults(): void {
    // Define all default feature flags
    const defaultFlags: FeatureFlag[] = [
        {
          id: 1,
          name: "advertisements_enabled",
          description: "Master switch for all advertisements. When disabled, no ads will show anywhere on the platform.",
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "chat_sidebar_ads",
          description: "Controls tasteful faith-based ads in the chat sidebar. Only shows when master ad switch is enabled.",
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "home_banner_ads",
          description: "Controls banner ads on the main landing page. Perfect for ministry partnerships and announcements.",
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "between_messages_ads",
          description: "Shows relevant Christian content between chat messages while maintaining conversation flow.",
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "ministry_support_reminders",
          description: "Occasionally adds tasteful ministry support reminders to AI responses (every 5th message). Helps sustain the ministry while maintaining a spiritual focus.",
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "clickable_bible_links",
          description: "Enable clickable Bible verse links in AI responses for enhanced Bible study experience.",
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "tts_ai_responses",
          description: "Enable premium text-to-speech for AI-generated spiritual guidance and biblical teachings.",
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: "tts_bible_verses",
          description: "Enable premium text-to-speech for Bible verse cards, daily verses, and scripture references.",
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: "pwa_enabled",
          description: "Enable Progressive Web App features including service worker, offline capability, and app installation prompts.",
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

    // Check for missing flags and add them
    const existingFlagNames = new Set(Array.from(this.featureFlags.values()).map(f => f.name));
    let maxId = this.featureFlags.size > 0 ? Math.max(...Array.from(this.featureFlags.values()).map(f => f.id)) : 0;
    let flagsAdded = false;

    defaultFlags.forEach(defaultFlag => {
      if (!existingFlagNames.has(defaultFlag.name)) {
        const newFlag = { ...defaultFlag, id: ++maxId };
        this.featureFlags.set(newFlag.id, newFlag);
        flagsAdded = true;
        console.log(`✓ Added missing feature flag: ${newFlag.name}`);
      }
    });

    if (flagsAdded) {
      this.currentFeatureFlagId = maxId + 1;
      this.saveFeatureFlags();
    } else if (this.featureFlags.size === 0) {
      // First time setup - add all defaults
      defaultFlags.forEach(flag => {
        this.featureFlags.set(flag.id, flag);
      });
      this.currentFeatureFlagId = 10;
      this.saveFeatureFlags();
    }
  }

  private initializeAdvertisements(): void {
    // Initialize sample advertisements for testing
    const sampleAds: Advertisement[] = [
      {
        id: 1,
        title: "Daily Devotional Book",
        description: "Start your day with inspiring biblical reflections and prayers",
        imageUrl: null,
        linkUrl: "https://www.biblestudytools.com/devotionals/",
        type: "book",
        placement: "chat_sidebar",
        active: true,
        priority: 1,
        targetAudience: "Christian adults seeking daily spiritual growth",
        impressionCount: 0,
        clickCount: 0,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "Christian Life Conference 2025",
        description: "Join thousands of believers for worship, teaching, and fellowship",
        imageUrl: null,
        linkUrl: "https://www.crosswalk.com/church/events/",
        type: "event",
        placement: "home_banner",
        active: true,
        priority: 1,
        targetAudience: "Christians interested in conferences and events",
        impressionCount: 0,
        clickCount: 0,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        title: "Online Bible Study Course",
        description: "Deepen your understanding of Scripture with expert guidance",
        imageUrl: null,
        linkUrl: "https://www.blueletterbible.org/study/",
        type: "course",
        placement: "between_messages",
        active: true,
        priority: 1,
        targetAudience: "Christians seeking biblical education",
        impressionCount: 0,
        clickCount: 0,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleAds.forEach(ad => {
      this.advertisements.set(ad.id, ad);
    });
    this.currentAdvertisementId = 4;

    // Initialize default admin user only if not loaded from persistent storage
    if (!this.adminUsers.has(1)) {
      // Password: "admin123" (you should change this immediately after first login)
      const defaultAdmin: AdminUser = {
        id: 1,
        username: "admin",
        passwordHash: "$2b$12$WfwM.DDwTbB.OODoZIbN6ujnK7Ro0mI4YBXTJRcmxRvHHUeFDJUNe", // bcrypt hash of "admin123"
        email: null,
        role: "owner",
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.adminUsers.set(1, defaultAdmin);
      this.currentAdminUserId = 2;
      this.saveAdminData(); // Save the admin user to persistent storage
      console.log('✓ Default admin user created (admin/admin123)');
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.currentSessionId++;
    const session: ChatSession = {
      id,
      sessionId: insertSession.sessionId,
      createdAt: new Date(),
    };
    this.chatSessions.set(insertSession.sessionId, session);
    this.messages.set(insertSession.sessionId, []);
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(sessionId);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      id,
      sessionId: insertMessage.sessionId,
      role: insertMessage.role,
      content: insertMessage.content,
      scriptureReferences: insertMessage.scriptureReferences || null,
      timestamp: new Date(),
    };

    const sessionMessages = this.messages.get(insertMessage.sessionId) || [];
    sessionMessages.push(message);
    this.messages.set(insertMessage.sessionId, sessionMessages);

    return message;
  }

  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    return this.messages.get(sessionId) || [];
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    this.chatSessions.delete(sessionId);
    this.messages.delete(sessionId);
  }

  async deleteMessage(id: number): Promise<void> {
    // Find and remove message from all sessions
    for (const [sessionId, messages] of this.messages.entries()) {
      const index = messages.findIndex(m => m.id === id);
      if (index !== -1) {
        messages.splice(index, 1);
        this.messages.set(sessionId, messages);
        break;
      }
    }
  }

  // Feature Flags implementation
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return Array.from(this.featureFlags.values());
  }

  async getFeatureFlag(name: string): Promise<FeatureFlag | undefined> {
    return Array.from(this.featureFlags.values()).find(flag => flag.name === name);
  }

  async createFeatureFlag(insertFlag: InsertFeatureFlag): Promise<FeatureFlag> {
    const id = this.currentFeatureFlagId++;
    const flag: FeatureFlag = {
      id,
      name: insertFlag.name,
      description: insertFlag.description || null,
      enabled: insertFlag.enabled || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.featureFlags.set(id, flag);
    this.saveFeatureFlags(); // Persist changes immediately
    return flag;
  }

  async updateFeatureFlag(id: number, updates: Partial<FeatureFlag>): Promise<FeatureFlag> {
    const flag = this.featureFlags.get(id);
    if (!flag) {
      throw new Error(`Feature flag with id ${id} not found`);
    }
    
    const updatedFlag: FeatureFlag = {
      ...flag,
      ...updates,
      updatedAt: new Date(),
    };
    this.featureFlags.set(id, updatedFlag);
    this.saveFeatureFlags(); // Persist changes immediately
    return updatedFlag;
  }

  async deleteFeatureFlag(id: number): Promise<void> {
    this.featureFlags.delete(id);
    this.saveFeatureFlags(); // Persist changes immediately
  }

  // Advertisements implementation
  async getAdvertisements(): Promise<Advertisement[]> {
    return Array.from(this.advertisements.values());
  }

  async getActiveAdvertisements(placement?: string): Promise<Advertisement[]> {
    const now = new Date();
    return Array.from(this.advertisements.values())
      .filter(ad => {
        if (!ad.active) return false;
        if (ad.startDate && ad.startDate > now) return false;
        if (ad.endDate && ad.endDate < now) return false;
        if (placement && ad.placement !== placement) return false;
        return true;
      })
      .sort((a, b) => b.priority - a.priority);
  }

  async getAdvertisement(id: number): Promise<Advertisement | undefined> {
    return this.advertisements.get(id);
  }

  async createAdvertisement(insertAd: InsertAdvertisement): Promise<Advertisement> {
    const id = this.currentAdvertisementId++;
    const ad: Advertisement = {
      id,
      title: insertAd.title,
      description: insertAd.description,
      imageUrl: insertAd.imageUrl || null,
      linkUrl: insertAd.linkUrl || null,
      type: insertAd.type,
      placement: insertAd.placement,
      active: insertAd.active || false,
      priority: insertAd.priority || 0,
      targetAudience: insertAd.targetAudience || null,
      startDate: insertAd.startDate || null,
      endDate: insertAd.endDate || null,
      clickCount: 0,
      impressionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.advertisements.set(id, ad);
    return ad;
  }

  async updateAdvertisement(id: number, updates: Partial<Advertisement>): Promise<Advertisement> {
    const ad = this.advertisements.get(id);
    if (!ad) {
      throw new Error(`Advertisement with id ${id} not found`);
    }
    
    const updatedAd: Advertisement = {
      ...ad,
      ...updates,
      updatedAt: new Date(),
    };
    this.advertisements.set(id, updatedAd);
    return updatedAd;
  }

  async deleteAdvertisement(id: number): Promise<void> {
    this.advertisements.delete(id);
  }

  async incrementAdClicks(id: number): Promise<void> {
    const ad = this.advertisements.get(id);
    if (ad) {
      ad.clickCount += 1;
      ad.updatedAt = new Date();
      this.advertisements.set(id, ad);
    }
  }

  async incrementAdImpressions(id: number): Promise<void> {
    const ad = this.advertisements.get(id);
    if (ad) {
      ad.impressionCount += 1;
      ad.updatedAt = new Date();
      this.advertisements.set(id, ad);
    }
  }

  // Admin Authentication Methods
  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const adminUser: AdminUser = {
      id: this.currentAdminUserId++,
      username: userData.username,
      passwordHash: userData.passwordHash,
      role: userData.role || "admin",
      email: userData.email || null,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminUsers.set(adminUser.id, adminUser);
    return adminUser;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const users = Array.from(this.adminUsers.values());
    return users.find(user => user.username === username);
  }

  async updateAdminPassword(id: number, passwordHash: string): Promise<void> {
    const user = this.adminUsers.get(id);
    if (user) {
      user.passwordHash = passwordHash;
      user.updatedAt = new Date();
      this.adminUsers.set(id, user);
      this.saveAdminData(); // Persist the password change
      console.log('✓ Admin password updated and saved to persistent storage');
    }
  }

  async createAdminSession(sessionId: string, adminUserId: number, expiresAt: Date): Promise<AdminSession> {
    const session: AdminSession = {
      id: this.currentAdminSessionId++,
      sessionId,
      adminUserId,
      expiresAt,
      createdAt: new Date(),
    };
    this.adminSessions.set(sessionId, session);
    return session;
  }

  async getAdminSession(sessionId: string): Promise<(AdminSession & { user: AdminUser }) | undefined> {
    const session = this.adminSessions.get(sessionId);
    if (!session) return undefined;

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      this.adminSessions.delete(sessionId);
      return undefined;
    }

    const user = this.adminUsers.get(session.adminUserId);
    if (!user) return undefined;

    return { ...session, user };
  }

  async deleteAdminSession(sessionId: string): Promise<void> {
    this.adminSessions.delete(sessionId);
  }

  async updateAdminUserLastLogin(userId: number): Promise<void> {
    const user = this.adminUsers.get(userId);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
    }
  }

  async getAnalytics(): Promise<{
    totalSessions: number;
    totalMessages: number;
    avgMessagesPerSession: number;
    activeSessionsToday: number;
    totalAdImpressions: number;
    totalAdClicks: number;
    avgCTR: number;
    topPlacements: Array<{placement: string; impressions: number; clicks: number; ctr: number}>;
    dailyStats: Array<{date: string; sessions: number; messages: number; impressions: number; clicks: number}>;
    sessionDurations: Array<number>;
    messageVolumeTrends: Array<{hour: number; count: number}>;
  }> {
    const sessions = Array.from(this.chatSessions.values());
    const allMessages = Array.from(this.messages.values()).flat();
    const advertisements = Array.from(this.advertisements.values());
    

    
    const totalSessions = sessions.length;
    const totalMessages = allMessages.length;
    const avgMessagesPerSession = totalSessions > 0 ? Math.round(totalMessages / totalSessions * 10) / 10 : 0;
    
    // Active sessions today
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const activeSessionsToday = sessions.filter(session => 
      new Date(session.createdAt) >= oneDayAgo
    ).length;
    
    // Advertisement metrics
    const totalAdImpressions = advertisements.reduce((sum, ad) => sum + ad.impressionCount, 0);
    const totalAdClicks = advertisements.reduce((sum, ad) => sum + ad.clickCount, 0);
    const avgCTR = totalAdImpressions > 0 ? Math.round((totalAdClicks / totalAdImpressions) * 1000) / 10 : 0;
    
    // Top performing placements
    const placementStats = new Map<string, {impressions: number; clicks: number}>();
    advertisements.forEach(ad => {
      const existing = placementStats.get(ad.placement) || {impressions: 0, clicks: 0};
      existing.impressions += ad.impressionCount;
      existing.clicks += ad.clickCount;
      placementStats.set(ad.placement, existing);
    });
    
    const topPlacements = Array.from(placementStats.entries()).map(([placement, stats]) => ({
      placement,
      impressions: stats.impressions,
      clicks: stats.clicks,
      ctr: stats.impressions > 0 ? Math.round((stats.clicks / stats.impressions) * 1000) / 10 : 0
    })).sort((a, b) => b.impressions - a.impressions);
    
    // Daily stats for last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.createdAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      }).length;
      
      const dayMessages = allMessages.filter(message => {
        const messageDate = new Date(message.timestamp);
        return messageDate >= dayStart && messageDate <= dayEnd;
      }).length;
      
      const dayImpressions = daySessions * 2;
      const dayClicks = Math.round(dayImpressions * 0.035);
      
      dailyStats.push({
        date: dateStr,
        sessions: daySessions,
        messages: dayMessages,
        impressions: dayImpressions,
        clicks: dayClicks
      });
    }
    
    // Session durations
    const sessionDurations = sessions.map(session => {
      const sessionMessages = this.messages.get(session.sessionId) || [];
      return sessionMessages.length;
    });
    
    // Message volume by hour
    const messageVolumeTrends = [];
    for (let hour = 0; hour < 24; hour++) {
      const count = allMessages.filter(message => {
        const messageDate = new Date(message.timestamp);
        const messageHour = messageDate.getHours();
        const isToday = messageDate.toDateString() === now.toDateString();
        return isToday && messageHour === hour;
      }).length;
      messageVolumeTrends.push({ hour, count });
    }
    
    return {
      totalSessions,
      totalMessages,
      avgMessagesPerSession,
      activeSessionsToday,
      totalAdImpressions,
      totalAdClicks,
      avgCTR,
      topPlacements,
      dailyStats,
      sessionDurations,
      messageVolumeTrends
    };
  }
}

export const storage = new MemStorage();
