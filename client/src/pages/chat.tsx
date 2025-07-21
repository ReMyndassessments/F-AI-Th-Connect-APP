import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/lib/chat-api";
import ChatInterface from "@/components/chat/chat-interface";
import ClearChatButton from "@/components/chat/clear-chat-button";
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold faith-gradient-text">F-AI-TH-Connect</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ClearChatButton 
                onClearChat={handleClearChat}
                disabled={deleteSessionMutation.isPending || !currentSessionId}
              />
              <Button
                onClick={handleStartNewChat}
                className="faith-button-primary"
                disabled={createSessionMutation.isPending}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ChatInterface
          messages={messagesData?.messages || []}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isSending={sendMessageMutation.isPending}
        />
      </main>
    </div>
  );
}
