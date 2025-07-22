import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { storage } from "./storage";
import { DeepseekAI } from "./services/deepseek-ai";
import { FileProcessor } from "./services/file-processor";
import { z } from "zod";
import { insertMessageSchema, insertChatSessionSchema, adminLoginSchema, insertFeatureFlagSchema, insertAdvertisementSchema } from "@shared/schema";

const deepseekAI = new DeepseekAI();

// Admin Authentication Middleware
const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.headers['x-admin-session'] as string;
    
    if (!sessionId) {
      return res.status(401).json({ error: "Admin session required" });
    }

    const session = await storage.getAdminSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Invalid or expired admin session" });
    }

    // Add admin user to request for use in handlers
    (req as any).adminUser = session.user;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload PDF, Word, or text files.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new chat session
  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const session = await storage.createChatSession({ sessionId });
      res.json({ sessionId: session.sessionId });
    } catch (error) {
      console.error("Error creating chat session:", error);
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  // Get chat history for a session
  app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getChatSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      const messages = await storage.getMessagesBySession(sessionId);
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a message and get AI response
  app.post("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const validation = z.object({
        content: z.string().min(1),
      }).safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({ message: "Invalid message content" });
      }

      const { content } = validation.data;
      
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        sessionId,
        role: 'user',
        content,
      });

      // Get conversation history for context (optimize for long messages)
      const previousMessages = await storage.getMessagesBySession(sessionId);
      const contextLimit = content.length > 1000 ? 3 : 10; // Fewer context messages for long input
      const conversationHistory = previousMessages
        .slice(-contextLimit)
        .map(msg => ({
          role: msg.role,
          content: msg.content.length > 500 ? msg.content.substring(0, 500) + "..." : msg.content
        }));

      // Generate AI response
      const aiResult = await deepseekAI.generateChristianResponse(content, conversationHistory);
      
      // Check feature flags for ministry support reminders
      const flags = await storage.getFeatureFlags();
      const ministryReminderEnabled = flags.find(f => f.name === 'ministry_support_reminders')?.enabled || false;
      
      // Add tasteful ministry support reminder occasionally (every 5th assistant message)
      let finalResponse = aiResult.response;
      if (ministryReminderEnabled) {
        const assistantMessageCount = previousMessages.filter(m => m.role === 'assistant').length;
        // Add 1 because we're about to create the next assistant message
        const nextAssistantCount = assistantMessageCount + 1;
        console.log(`Ministry reminder check: ${nextAssistantCount} assistant messages, reminder enabled: ${ministryReminderEnabled}`);
        
        if (nextAssistantCount >= 3 && nextAssistantCount % 3 === 0) {
          console.log(`Adding ministry support reminder on message ${nextAssistantCount}`);
          finalResponse += "\n\n---\n\n*💙 Blessings! If F-AI-TH-Connect helps your spiritual journey, please consider [supporting our ministry](https://www.givesendgo.com/CodeandCoffeeforChrist). Your partnership helps us serve more believers.*";
        }
      }
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        sessionId,
        role: 'assistant',
        content: finalResponse,
        scriptureReferences: JSON.stringify(aiResult.scriptureReferences),
      });

      res.json({
        userMessage,
        aiMessage: {
          ...aiMessage,
          scriptureReferences: aiResult.scriptureReferences,
        }
      });

    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Delete a chat session
  app.delete("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // Delete all messages in the session
      const messages = await storage.getMessagesBySession(sessionId);
      for (const message of messages) {
        await storage.deleteMessage(message.id);
      }
      
      // Delete the session
      await storage.deleteChatSession(sessionId);
      
      res.json({ message: "Chat session deleted successfully" });
    } catch (error) {
      console.error("Error deleting chat session:", error);
      res.status(500).json({ message: "Failed to delete chat session" });
    }
  });

  // Public feature flags endpoint (for checking if features are enabled)
  app.get("/api/feature-flags/public", async (req, res) => {
    try {
      const flags = await storage.getFeatureFlags();
      // Return all flags (both enabled and disabled) for frontend logic
      const publicFlags = flags.map(flag => ({
        name: flag.name,
        enabled: flag.enabled
      }));
      res.json({ flags: publicFlags });
    } catch (error) {
      console.error("Error fetching feature flags:", error);
      res.status(500).json({ message: "Failed to fetch feature flags" });
    }
  });

  // Advertisements endpoints
  app.get("/api/advertisements", async (req, res) => {
    try {
      const { placement, active } = req.query;
      let ads;
      
      if (active === 'true') {
        ads = await storage.getActiveAdvertisements(placement as string);
      } else {
        ads = await storage.getAdvertisements();
        if (placement) {
          ads = ads.filter(ad => ad.placement === placement);
        }
      }
      
      res.json({ advertisements: ads });
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      res.status(500).json({ message: "Failed to fetch advertisements" });
    }
  });

  app.post("/api/advertisements", async (req, res) => {
    try {
      const ad = await storage.createAdvertisement(req.body);
      res.json({ advertisement: ad });
    } catch (error) {
      console.error("Error creating advertisement:", error);
      res.status(500).json({ message: "Failed to create advertisement" });
    }
  });

  app.patch("/api/advertisements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ad = await storage.updateAdvertisement(id, req.body);
      res.json({ advertisement: ad });
    } catch (error) {
      console.error("Error updating advertisement:", error);
      res.status(500).json({ message: "Failed to update advertisement" });
    }
  });

  app.delete("/api/advertisements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAdvertisement(id);
      res.json({ message: "Advertisement deleted successfully" });
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      res.status(500).json({ message: "Failed to delete advertisement" });
    }
  });

  app.post("/api/advertisements/:id/click", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementAdClicks(id);
      res.json({ message: "Click recorded" });
    } catch (error) {
      console.error("Error recording click:", error);
      res.status(500).json({ message: "Failed to record click" });
    }
  });

  // Admin Analytics Endpoint
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const loginData = adminLoginSchema.parse(req.body);
      
      // Find admin user
      const adminUser = await storage.getAdminUserByUsername(loginData.username);
      if (!adminUser) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(loginData.password, adminUser.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create session
      const sessionId = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await storage.createAdminSession(sessionId, adminUser.id, expiresAt);
      await storage.updateAdminUserLastLogin(adminUser.id);

      res.json({
        sessionId,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
          lastLogin: new Date(),
        },
        expiresAt,
      });
    } catch (error) {
      console.error("Admin login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data" });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", requireAdmin, async (req, res) => {
    try {
      const sessionId = req.headers['x-admin-session'] as string;
      await storage.deleteAdminSession(sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  app.get("/api/admin/verify", requireAdmin, async (req, res) => {
    try {
      const adminUser = (req as any).adminUser;
      res.json({
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
          lastLogin: adminUser.lastLogin,
        }
      });
    } catch (error) {
      console.error("Admin verify error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Change admin password
  app.post("/api/admin/change-password", requireAdmin, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const adminUser = (req as any).adminUser;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current password and new password are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long" });
      }
      
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, adminUser.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      
      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      
      // Update password
      await storage.updateAdminPassword(adminUser.id, newPasswordHash);
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Feature flags endpoints (now require admin authentication)
  app.get("/api/feature-flags", requireAdmin, async (req, res) => {
    try {
      const flags = await storage.getFeatureFlags();
      res.json({ flags });
    } catch (error) {
      console.error("Error fetching feature flags:", error);
      res.status(500).json({ message: "Failed to fetch feature flags" });
    }
  });

  app.post("/api/feature-flags", requireAdmin, async (req, res) => {
    try {
      const flagData = insertFeatureFlagSchema.parse(req.body);
      const flag = await storage.createFeatureFlag(flagData);
      res.json({ flag });
    } catch (error) {
      console.error("Error creating feature flag:", error);
      res.status(500).json({ message: "Failed to create feature flag" });
    }
  });

  app.patch("/api/feature-flags/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const flag = await storage.updateFeatureFlag(id, req.body);
      res.json({ flag });
    } catch (error) {
      console.error("Error updating feature flag:", error);
      res.status(500).json({ message: "Failed to update feature flag" });
    }
  });

  app.delete("/api/feature-flags/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFeatureFlag(id);
      res.json({ message: "Feature flag deleted successfully" });
    } catch (error) {
      console.error("Error deleting feature flag:", error);
      res.status(500).json({ message: "Failed to delete feature flag" });
    }
  });

  // Advertisement endpoints (now require admin authentication)
  app.get("/api/advertisements", requireAdmin, async (req, res) => {
    try {
      const { placement } = req.query;
      const ads = await storage.getActiveAdvertisements(placement as string);
      res.json({ advertisements: ads });
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      res.status(500).json({ message: "Failed to fetch advertisements" });
    }
  });

  app.post("/api/advertisements", requireAdmin, async (req, res) => {
    try {
      const adData = insertAdvertisementSchema.parse(req.body);
      const ad = await storage.createAdvertisement(adData);
      res.json({ advertisement: ad });
    } catch (error) {
      console.error("Error creating advertisement:", error);
      res.status(500).json({ message: "Failed to create advertisement" });
    }
  });

  app.patch("/api/advertisements/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ad = await storage.updateAdvertisement(id, req.body);
      res.json({ advertisement: ad });
    } catch (error) {
      console.error("Error updating advertisement:", error);
      res.status(500).json({ message: "Failed to update advertisement" });
    }
  });

  app.delete("/api/advertisements/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAdvertisement(id);
      res.json({ message: "Advertisement deleted successfully" });
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      res.status(500).json({ message: "Failed to delete advertisement" });
    }
  });

  // File upload and processing endpoint
  app.post("/api/files/process", upload.single('file'), async (req: any, res: any) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { buffer, originalname, mimetype } = file;
      
      // Process the file content
      const processedFile = await FileProcessor.processFile(buffer, originalname, mimetype);
      const formattedContent = FileProcessor.formatFileContent(processedFile);

      res.json({
        success: true,
        fileName: originalname,
        fileType: processedFile.fileType,
        wordCount: processedFile.wordCount,
        content: formattedContent,
      });

    } catch (error) {
      console.error("File processing error:", error);
      const errorMessage = error instanceof Error ? error.message : "File processing failed";
      res.status(400).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
