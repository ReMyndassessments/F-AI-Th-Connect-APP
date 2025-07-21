import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/lib/chat-api";
import ChatInterface from "@/components/chat/chat-interface";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, MessageCircle } from "lucide-react";

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
  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["/api/chat/sessions", currentSessionId, "messages"],
    enabled: !!currentSessionId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ sessionId, content }: { sessionId: string; content: string }) =>
      chatApi.sendMessage(sessionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/chat/sessions", currentSessionId, "messages"],
      });
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

            <Button
              onClick={handleStartNewChat}
              className="faith-button-primary"
              disabled={createSessionMutation.isPending}
            >
              New Conversation
            </Button>
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
