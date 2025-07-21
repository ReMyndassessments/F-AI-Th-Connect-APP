import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DeepseekAI } from "./services/deepseek-ai";
import { z } from "zod";
import { insertMessageSchema, insertChatSessionSchema } from "@shared/schema";

const deepseekAI = new DeepseekAI();

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
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        sessionId,
        role: 'assistant',
        content: aiResult.response,
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

  const httpServer = createServer(app);
  return httpServer;
}
