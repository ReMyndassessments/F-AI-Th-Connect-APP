import { apiRequest } from "./queryClient";

export interface Message {
  id: number;
  sessionId: string;
  role: string;
  content: string;
  scriptureReferences?: Array<{
    verse: string;
    book: string;
    chapter: number;
    verses: string;
    text: string;
  }>;
  timestamp: string;
}

export interface ChatSession {
  sessionId: string;
}

export const chatApi = {
  async createSession(): Promise<ChatSession> {
    const response = await apiRequest("POST", "/api/chat/sessions");
    return response.json();
  },

  async getMessages(sessionId: string): Promise<{ messages: Message[] }> {
    const response = await apiRequest("GET", `/api/chat/sessions/${sessionId}/messages`);
    return response.json();
  },

  async sendMessage(sessionId: string, content: string): Promise<{
    userMessage: Message;
    aiMessage: Message;
  }> {
    const response = await apiRequest("POST", `/api/chat/sessions/${sessionId}/messages`, {
      content,
    });
    return response.json();
  },
};
