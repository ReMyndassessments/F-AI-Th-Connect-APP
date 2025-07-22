import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import MessageBubble from "@/components/chat/message-bubble";
import TypingIndicator from "@/components/chat/typing-indicator";

import FileUpload from "@/components/chat/file-upload";
import type { Message } from "@/lib/chat-api";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isSending: boolean;
}

const LARGE_CONTENT_THRESHOLD = 1000;

export default function ChatInterface({ messages, onSendMessage, isLoading, isSending }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [fileContent, setFileContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullMessage = fileContent ? `${fileContent}\n\n${inputValue.trim()}` : inputValue.trim();
    if (fullMessage && !isSending) {
      onSendMessage(fullMessage);
      setInputValue("");
      setFileContent("");
    }
  };



  const handleFileContent = (content: string, fileName: string) => {
    setFileContent(content);
    // Clear any existing input and set a helpful prompt
    setInputValue(`Please create a comprehensive Bible study based on this ${fileName.endsWith('.pdf') ? 'document' : fileName.endsWith('.docx') ? 'Word document' : 'content'}. Include discussion questions and practical applications.`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200 overflow-hidden">
        <div className="h-80 sm:h-96 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-500 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">Loading your conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-amber-500 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs sm:text-sm">AI</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">F-AI-TH-Connect</h3>
            <p className="text-white text-opacity-80 text-xs sm:text-sm">Your Christian AI Companion</p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="h-80 sm:h-96 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-4 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-white font-bold text-lg sm:text-xl">✝</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Welcome to F-AI-TH-Connect</h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base px-2">
              I'm here to provide biblical guidance, prayer support, and spiritual encouragement. 
              How can I help you in your faith journey today?
            </p>
            <div className="flex flex-wrap gap-2 justify-center px-2">
              <button
                onClick={() => onSendMessage("I'm feeling anxious about my future. What does the Bible say about worry?")}
                className="bg-blue-50 text-blue-600 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-100 transition-colors"
              >
                Anxiety and worry
              </button>
              <button
                onClick={() => onSendMessage("How can I deepen my relationship with God?")}
                className="bg-blue-50 text-blue-600 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-100 transition-colors"
              >
                Spiritual growth
              </button>
              <button
                onClick={() => onSendMessage("Can you help me with a prayer for my family?")}
                className="bg-blue-50 text-blue-600 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-100 transition-colors"
              >
                Prayer requests
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        <TypingIndicator 
          isVisible={isSending}
          message={inputValue.length > LARGE_CONTENT_THRESHOLD ? "Processing extensive content" : "Seeking biblical guidance"}
        />
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2 sm:p-4 space-y-2 sm:space-y-3">
        {/* File Upload */}
        <FileUpload 
          onFileContent={handleFileContent}
          disabled={isSending}
        />
        
        <div className="flex items-end space-x-2 sm:space-x-3">
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Ask about faith, prayer, or biblical guidance..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 min-h-[44px] sm:min-h-[48px] max-h-32 resize-none text-sm sm:text-base"
              disabled={isSending}
              rows={1}
            />
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            <Button
              type="submit"
              disabled={(!inputValue.trim() && !fileContent) || isSending}
              className="bg-blue-500 text-white p-2 sm:p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              size="sm"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
