import { 
  users, chatSessions, messages, featureFlags, advertisements, adminUsers, adminSessions,
  type User, type InsertUser, type ChatSession, type InsertChatSession, 
  type Message, type InsertMessage, type FeatureFlag, type InsertFeatureFlag,
  type Advertisement, type InsertAdvertisement, type AdminUser, type InsertAdminUser,
  type AdminSession
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatSessions: Map<string, ChatSession>;
  private messages: Map<string, Message[]>;
  private featureFlags: Map<number, FeatureFlag>;
  private advertisements: Map<number, Advertisement>;
  private adminUsers: Map<number, AdminUser>;
  private adminSessions: Map<string, AdminSession>;
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
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentMessageId = 1;
    this.currentFeatureFlagId = 1;
    this.currentAdvertisementId = 1;
    this.currentAdminUserId = 1;
    this.currentAdminSessionId = 1;
    
    // Initialize default feature flags and admin user
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    // Initialize default feature flags
    const defaultFlags: FeatureFlag[] = [
      {
        id: 1,
        name: "advertisements_enabled",
        description: "Enable tasteful faith-based advertisements",
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "chat_sidebar_ads",
        description: "Show ads in chat sidebar",
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "home_banner_ads",
        description: "Show banner ads on home page",
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "between_messages_ads",
        description: "Show ads between chat messages",
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    defaultFlags.forEach(flag => {
      this.featureFlags.set(flag.id, flag);
    });
    this.currentFeatureFlagId = 5;

    // Initialize default admin user (owner)
    // Password: "admin123" (you should change this immediately after first login)
    const defaultAdmin: AdminUser = {
      id: 1,
      username: "admin",
      passwordHash: "$2b$12$uFB6Gi.Cj8TmDC45WUym9OpYgwffjOfi1oJFMo3FsRmrdc3NL1xIW", // bcrypt hash of "admin123"
      email: null,
      role: "owner",
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminUsers.set(1, defaultAdmin);
    this.currentAdminUserId = 2;
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
    return updatedFlag;
  }

  async deleteFeatureFlag(id: number): Promise<void> {
    this.featureFlags.delete(id);
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
      ...userData,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminUsers.set(adminUser.id, adminUser);
    return adminUser;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    for (const [, user] of this.adminUsers) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async updateAdminPassword(id: number, passwordHash: string): Promise<void> {
    const user = this.adminUsers.get(id);
    if (user) {
      user.passwordHash = passwordHash;
      user.updatedAt = new Date();
      this.adminUsers.set(id, user);
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
}

export const storage = new MemStorage();
