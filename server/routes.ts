import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { storage } from "./storage";
import { DeepseekAI } from "./services/deepseek-ai";
import { simpleBibleAPI } from "./services/simple-bible-api";
import { elevenLabsTTS } from "./services/elevenlabs-tts";

import { FileProcessor } from "./services/file-processor";
import { spellCheckService } from "./services/spell-check-service";
import { z } from "zod";
import { insertMessageSchema, insertChatSessionSchema, adminLoginSchema, insertFeatureFlagSchema, insertAdvertisementSchema, insertMissionGroupSchema, updateMissionGroupSchema } from "@shared/schema";

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

      // Get conversation history for context (optimized for speed)
      const previousMessages = await storage.getMessagesBySession(sessionId);
      const contextLimit = content.length > 1000 ? 2 : 6; // Reduced context for faster processing
      const conversationHistory = previousMessages
        .slice(-contextLimit)
        .map(msg => ({
          role: msg.role,
          content: msg.content.length > 300 ? msg.content.substring(0, 300) + "..." : msg.content
        }));

      // Generate AI response
      const aiResult = await deepseekAI.generateChristianResponse(content, conversationHistory);
      
      // Check feature flags for ministry support reminders
      const flags = await storage.getFeatureFlags();
      const ministryReminderEnabled = flags.find(f => f.name === 'ministry_support_reminders')?.enabled || false;
      
      // Check feature flags for clickable Bible links
      const bibleLinkEnabled = flags.find(f => f.name === 'clickable_bible_links')?.enabled || false;
      
      // Add tasteful ministry support reminder occasionally (every 5th assistant message)
      let finalResponse = aiResult.response;
      if (ministryReminderEnabled) {
        const assistantMessageCount = previousMessages.filter(m => m.role === 'assistant').length;
        // Add 1 because we're about to create the next assistant message
        const nextAssistantCount = assistantMessageCount + 1;
        console.log(`Ministry reminder check: ${nextAssistantCount} assistant messages, reminder enabled: ${ministryReminderEnabled}`);
        
        if (nextAssistantCount >= 3 && nextAssistantCount % 3 === 0) {
          console.log(`Adding ministry support reminder on message ${nextAssistantCount}`);
          if (bibleLinkEnabled) {
            finalResponse += "\n\n---\n\n*💙 Blessings! If F-AI-TH-Connect helps your spiritual journey, please consider [supporting our ministry](https://www.givesendgo.com/CodeandCoffeeforChrist). Your partnership helps us serve more believers.*";
          } else {
            finalResponse += "\n\n---\n\n*💙 Blessings! If F-AI-TH-Connect helps your spiritual journey, please consider supporting our ministry at https://www.givesendgo.com/CodeandCoffeeforChrist. Your partnership helps us serve more believers.*";
          }
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

  // Bible verse API route
  app.get('/api/bible/verse/:reference', async (req, res) => {
    try {
      const reference = decodeURIComponent(req.params.reference);
      const version = req.query.version as string;
      const verse = await simpleBibleAPI.getVerse(reference, version);
      
      if (!verse) {
        return res.status(404).json({ 
          error: 'Verse not found',
          message: `Could not find verse: ${reference}` 
        });
      }
      
      res.json(verse);
    } catch (error) {
      console.error('Bible API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch verse',
        message: 'Unable to retrieve verse at this time' 
      });
    }
  });

  // Predictive verse search endpoint
  app.get('/api/bible/search', async (req, res) => {
    try {
      const { query, version = 'kjv', limit = 10 } = req.query;
      
      if (!query || typeof query !== 'string' || query.trim().length < 3) {
        return res.json({ verses: [] });
      }

      const searchResults = await simpleBibleAPI.searchVerses(query.trim(), version as string, parseInt(limit as string));
      res.json({ verses: searchResults || [] });
    } catch (error) {
      console.error("Bible search error:", error);
      res.status(500).json({ error: "Failed to search verses" });
    }
  });

  // Text-to-Speech API routes
  app.get('/api/tts/voices', async (req, res) => {
    try {
      const voices = elevenLabsTTS.getAvailableVoices();
      const isAvailable = elevenLabsTTS.isAvailable();
      
      res.json({
        available: isAvailable,
        voices: voices,
        service: 'ElevenLabs'
      });
    } catch (error) {
      console.error('TTS voices error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch voices',
        message: 'Unable to get available voices'
      });
    }
  });

  app.post('/api/tts/generate', async (req, res) => {
    try {
      const { text, voiceId } = req.body;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          error: 'Text required',
          message: 'Text content is required for speech generation'
        });
      }

      // Check if text is too long (ElevenLabs limit: 2500 chars)
      if (text.length > 2500) {
        return res.status(400).json({
          error: 'Text too long',
          message: 'Text must be 2500 characters or less for TTS generation'
        });
      }

      const audioBuffer = await elevenLabsTTS.generateSpeech(text, voiceId);
      
      if (!audioBuffer) {
        return res.status(503).json({
          error: 'TTS unavailable',
          message: 'ElevenLabs TTS service is not available. Please use browser TTS instead.'
        });
      }

      // Return audio file
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length);
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(audioBuffer);
      
    } catch (error) {
      console.error('TTS generation error:', error);
      res.status(500).json({
        error: 'Generation failed',
        message: 'Failed to generate speech audio'
      });
    }
  });

  app.get('/api/tts/usage', async (req, res) => {
    try {
      const usage = await elevenLabsTTS.getUsageInfo();
      
      if (!usage) {
        return res.status(503).json({
          error: 'Usage unavailable',
          message: 'Cannot retrieve ElevenLabs usage information'
        });
      }

      res.json(usage);
    } catch (error) {
      console.error('TTS usage error:', error);
      res.status(500).json({
        error: 'Failed to get usage',
        message: 'Unable to retrieve usage information'
      });
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
        rawContent: processedFile.content,
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

  // Spell check and predictive text routes
  app.post("/api/spell-check", async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const results = spellCheckService.checkSpelling(text);
      res.json(results);
    } catch (error) {
      console.error("Error checking spelling:", error);
      res.status(500).json({ message: "Failed to check spelling" });
    }
  });

  app.post("/api/predictive-text", async (req: Request, res: Response) => {
    try {
      const { input, limit = 5 } = req.body;
      if (!input || typeof input !== 'string') {
        return res.status(400).json({ message: "Input is required" });
      }
      
      const results = spellCheckService.getPredictiveText(input, limit);
      res.json(results);
    } catch (error) {
      console.error("Error getting predictive text:", error);
      res.status(500).json({ message: "Failed to get predictive text" });
    }
  });

  // ============================================================
  // D-GROUP MEETING ROOMS (in-memory, Jitsi-powered)
  // ============================================================
  interface DGroupRoom {
    code: string;
    jitsiRoom: string;
    groupName: string;
    studyType: string;
    studyContent: string;
    leaderName: string;
    createdAt: string;
  }
  const dgroupRooms = new Map<string, DGroupRoom>();

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  app.post('/api/dgroups', (req: Request, res: Response) => {
    try {
      const { groupName, studyType, studyContent, leaderName } = req.body;
      if (!groupName) {
        return res.status(400).json({ error: 'groupName is required' });
      }
      let code = generateCode();
      while (dgroupRooms.has(code)) code = generateCode();

      const jitsiRoom = `faithconnect${code.toLowerCase()}`;
      const room: DGroupRoom = {
        code,
        jitsiRoom,
        groupName: groupName.trim(),
        studyType,
        studyContent: studyContent || '',
        leaderName: leaderName?.trim() || 'Leader',
        createdAt: new Date().toISOString(),
      };
      dgroupRooms.set(code, room);
      res.json(room);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create meeting room' });
    }
  });

  // Proxy: fetch the CCF weekly study guide and forward it to the client
  // Dynamically discovers the current week's guide from the 4WS listing page
  // MUST be before /api/dgroups/:code so the wildcard doesn't swallow it
  app.get('/api/dgroups/ccf-weekly', async (req: Request, res: Response) => {
    const HEADERS = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.ccf.org.ph/',
    };
    const FALLBACK_URL = 'https://www.ccf.org.ph/4ws/';

    try {
      // Step 1: Fetch the 4WS listing page to find the current week's guide URL
      const listingRes = await fetch('https://www.ccf.org.ph/4ws/', { headers: HEADERS, redirect: 'follow' });
      if (!listingRes.ok) {
        return res.status(502).json({ error: 'Could not reach the CCF 4WS page.', url: FALLBACK_URL, blocked: true });
      }
      const listingHtml = await listingRes.text();

      // Extract first fourwslink that is NOT a goviral edition (standard weekly guide)
      const linkMatches = [...listingHtml.matchAll(/class="fourwslink"[^>]*href="([^"]+)"/g)];
      // Also try reversed attribute order
      const linkMatches2 = [...listingHtml.matchAll(/href="([^"]+)"[^>]*class="fourwslink"/g)];
      const allLinks = [...linkMatches.map(m => m[1]), ...linkMatches2.map(m => m[1])];
      const guidePageUrl = allLinks.find(url => !url.toLowerCase().includes('goviral'));

      if (!guidePageUrl) {
        return res.status(502).json({ error: 'Could not find the current week\'s guide on the CCF website.', url: FALLBACK_URL, blocked: true });
      }

      // Step 2: Fetch the individual guide page to get the actual download link
      const guidePageRes = await fetch(guidePageUrl, { headers: HEADERS, redirect: 'follow' });
      if (!guidePageRes.ok) {
        return res.status(502).json({ error: 'Could not load the guide page.', url: guidePageUrl, blocked: true });
      }
      const guideHtml = await guidePageRes.text();

      // Extract the download URL (pattern: https://www.ccf.org.ph/download/XXXXX/)
      const downloadMatch = guideHtml.match(/href\s*=\s*["']?(https:\/\/www\.ccf\.org\.ph\/download\/\d+\/)[^"'\s>]*/);
      const downloadUrl = downloadMatch?.[1];

      if (!downloadUrl) {
        return res.status(502).json({ error: 'Could not find the download link on the guide page.', url: guidePageUrl, blocked: true });
      }

      // Step 3: Fetch and stream the actual file
      const fileRes = await fetch(downloadUrl, {
        headers: { ...HEADERS, Accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,*/*' },
        redirect: 'follow',
      });

      if (!fileRes.ok) {
        return res.status(502).json({ error: 'CCF website returned an error fetching the file.', url: downloadUrl });
      }

      const contentType = fileRes.headers.get('content-type') || 'application/octet-stream';
      if (contentType.includes('text/html')) {
        return res.status(400).json({ error: 'The CCF website requires you to download the guide manually.', url: downloadUrl, blocked: true });
      }

      const contentDisposition = fileRes.headers.get('content-disposition');
      res.set('Content-Type', contentType);
      if (contentDisposition) res.set('Content-Disposition', contentDisposition);
      // Short cache — 1 hour max so a new week's guide appears promptly
      res.set('Cache-Control', 'public, max-age=3600');

      const buffer = await fileRes.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (err) {
      res.status(502).json({ error: 'Network error fetching CCF weekly guide.', url: FALLBACK_URL });
    }
  });

  app.get('/api/dgroups/:code', (req: Request, res: Response) => {
    const room = dgroupRooms.get(req.params.code.toUpperCase());
    if (!room) return res.status(404).json({ error: 'Room not found or expired' });
    res.json(room);
  });

  // ============================================================
  // MISSIONS PARTNER PROGRAM
  // ============================================================

  // Slug generator utility
  const generateSlug = (groupName: string, attempt = 0): string => {
    const base = groupName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);
    return attempt === 0 ? base : `${base}-${attempt}`;
  };

  // Public: register a new missions group
  app.post('/api/missions/register', async (req: Request, res: Response) => {
    try {
      const parsed = insertMissionGroupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid data', details: parsed.error.flatten() });
      }
      // Generate a unique slug
      let slug = generateSlug(parsed.data.groupName);
      let attempt = 0;
      while (await storage.getMissionGroupBySlug(slug)) {
        attempt++;
        slug = generateSlug(parsed.data.groupName, attempt);
      }
      const group = await storage.createMissionGroup(parsed.data, slug);
      res.status(201).json(group);
    } catch (error) {
      console.error('Error registering mission group:', error);
      res.status(500).json({ error: 'Failed to register mission group' });
    }
  });

  // Public: list approved missions groups (optionally filtered by missionType)
  app.get('/api/missions', async (req: Request, res: Response) => {
    try {
      const groups = await storage.getMissionGroups('approved');
      const missionType = req.query.missionType as string | undefined;
      const filtered = missionType ? groups.filter(g => g.missionType === missionType) : groups;
      res.json(filtered);
    } catch (error) {
      console.error('Error fetching missions:', error);
      res.status(500).json({ error: 'Failed to fetch missions' });
    }
  });

  // Public: get a single approved mission group by slug
  app.get('/api/missions/:slug', async (req: Request, res: Response) => {
    try {
      const group = await storage.getMissionGroupBySlug(req.params.slug);
      if (!group) return res.status(404).json({ error: 'Mission group not found' });
      if (group.status !== 'approved') return res.status(404).json({ error: 'Mission group not found' });
      res.json(group);
    } catch (error) {
      console.error('Error fetching mission group:', error);
      res.status(500).json({ error: 'Failed to fetch mission group' });
    }
  });

  // Admin: list ALL missions groups (all statuses)
  app.get('/api/admin/missions', requireAdmin, async (req: Request, res: Response) => {
    try {
      const groups = await storage.getMissionGroups();
      res.json(groups);
    } catch (error) {
      console.error('Error fetching all missions:', error);
      res.status(500).json({ error: 'Failed to fetch missions' });
    }
  });

  // Admin: update a mission group (approve/reject/edit)
  app.patch('/api/admin/missions/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const existing = await storage.getMissionGroupById(id);
      if (!existing) return res.status(404).json({ error: 'Mission group not found' });
      const parsed = updateMissionGroupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid data', details: parsed.error.flatten() });
      }
      const updated = await storage.updateMissionGroup(id, parsed.data);
      res.json(updated);
    } catch (error) {
      console.error('Error updating mission group:', error);
      res.status(500).json({ error: 'Failed to update mission group' });
    }
  });

  // Admin: delete a mission group
  app.delete('/api/admin/missions/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const existing = await storage.getMissionGroupById(id);
      if (!existing) return res.status(404).json({ error: 'Mission group not found' });
      await storage.deleteMissionGroup(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting mission group:', error);
      res.status(500).json({ error: 'Failed to delete mission group' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
