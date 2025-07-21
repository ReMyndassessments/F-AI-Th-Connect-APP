import type { Message } from "@/lib/chat-api";
import ScriptureReference from "@/components/chat/scripture-reference";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const scriptureReferences = message.scriptureReferences ? 
    (typeof message.scriptureReferences === 'string' ? 
      JSON.parse(message.scriptureReferences) : 
      message.scriptureReferences) : [];

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-xs lg:max-w-md">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs text-blue-100 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-semibold text-sm">AI</span>
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-md lg:max-w-lg">
        <div className="text-sm text-gray-900 whitespace-pre-wrap mb-2">
          {message.content}
        </div>
        
        {scriptureReferences.length > 0 && (
          <div className="space-y-2 mt-3">
            {scriptureReferences.map((ref: any, index: number) => (
              <ScriptureReference key={index} reference={ref} />
            ))}
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-2">
          F-AI-TH-Connect • {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
