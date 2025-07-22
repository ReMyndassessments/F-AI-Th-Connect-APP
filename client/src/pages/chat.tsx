import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/lib/chat-api";
import ChatInterface from "@/components/chat/chat-interface";
import ClearChatButton from "@/components/chat/clear-chat-button";
import AdvertisementDisplay from "@/components/ads/advertisement-display";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, MessageCircle, RotateCcw } from "lucide-react";

export default function Chat() {
  const { sessionId } = useParams();
  const [, setLocation] = useLocation();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const queryClient = useQueryClient();

  // Create new session if no sessionId provided
  const createSessionMutation = useMutation({
    mutationFn: chatApi.createSession,
    onSuccess: (data) => {
      setCurrentSessionId(data.sessionId);
      setLocation(`/chat/${data.sessionId}`);
    },
  });

  // Get messages for current session
  const { data: messagesData, isLoading, error: messagesError } = useQuery({
    queryKey: ["/api/chat/sessions", currentSessionId, "messages"],
    enabled: !!currentSessionId,
    retry: (failureCount, error: any) => {
      // If session not found, don't retry - we'll create a new one
      if (error?.status === 404) return false;
      return failureCount < 3;
    },
  }) as { data: { messages: any[] } | undefined; isLoading: boolean; error: any };

  // Handle session not found error
  if (messagesError?.status === 404 && currentSessionId) {
    console.log('Session not found, creating new session...');
    setCurrentSessionId(null);
  }

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ sessionId, content }: { sessionId: string; content: string }) =>
      chatApi.sendMessage(sessionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/chat/sessions", currentSessionId, "messages"],
      });
    },
    onError: (error: any) => {
      console.error('Failed to send message:', error);
      // If session not found (404), create a new session
      if (error?.message?.includes('404') || error?.status === 404) {
        console.log('Session not found, creating new session...');
        setCurrentSessionId(null);
        createSessionMutation.mutate();
      }
    },
  });

  useEffect(() => {
    if (!currentSessionId && !createSessionMutation.isPending) {
      createSessionMutation.mutate();
    }
  }, [currentSessionId]);

  const handleSendMessage = (content: string) => {
    if (currentSessionId) {
      sendMessageMutation.mutate({ sessionId: currentSessionId, content });
    }
  };

  const handleStartNewChat = () => {
    setCurrentSessionId(null);
    createSessionMutation.mutate();
  };

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: string) => chatApi.deleteSession(sessionId),
    onSuccess: () => {
      // Clear the query cache and start a new session
      queryClient.clear();
      handleStartNewChat();
    },
    onError: (error) => {
      console.error('Failed to delete session:', error);
      // Even if delete fails, start a new session
      handleStartNewChat();
    },
  });

  const handleClearChat = () => {
    if (currentSessionId) {
      deleteSessionMutation.mutate(currentSessionId);
    } else {
      handleStartNewChat();
    }
  };

  if (createSessionMutation.isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Starting your spiritual conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold faith-gradient-text">F-AI-TH-Connect</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <ClearChatButton 
                onClearChat={handleClearChat}
                disabled={deleteSessionMutation.isPending || !currentSessionId}
              />
              <Button
                onClick={handleStartNewChat}
                className="faith-button-primary text-xs sm:text-sm px-2 sm:px-4"
                disabled={createSessionMutation.isPending}
                size="sm"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main Chat Area */}
          <div className="flex-1 min-w-0">
            <ChatInterface
              messages={messagesData?.messages || []}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              isSending={sendMessageMutation.isPending}
            />
          </div>
          
          {/* Sidebar with Daily Verse and Ads - Hidden on mobile */}
          <div className="hidden lg:block w-80 space-y-4 flex-shrink-0">
            <DailyVerseCard variant="compact" />
            <AdvertisementDisplay placement="chat_sidebar" />
          </div>
        </div>
        
        {/* Mobile Daily Verse and Ads - Only shown on mobile */}
        <div className="lg:hidden mt-4 space-y-4">
          <DailyVerseCard variant="compact" />
          <AdvertisementDisplay placement="chat_sidebar" />
        </div>
      </main>
    </div>
  );
}
