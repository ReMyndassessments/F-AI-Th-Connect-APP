import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { DeepseekAI } from "./services/deepseek-ai";
import { FileProcessor } from "./services/file-processor";
import { z } from "zod";
import { insertMessageSchema, insertChatSessionSchema } from "@shared/schema";

const deepseekAI = new DeepseekAI();

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
