import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Share, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageActionsProps {
  content: string;
  messageId: number;
  isAiMessage?: boolean;
}

export default function MessageActions({ content, messageId, isAiMessage = false }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied successfully.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `faith-connect-${isAiMessage ? 'guidance' : 'message'}-${messageId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "Message saved as text file.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'F-AI-TH-Connect - Biblical Guidance',
          text: content,
        });
      } catch (error) {
        // User cancelled or error occurred, fall back to copy
        handleCopy();
      }
    } else {
      // Share API not available, fall back to copy
      handleCopy();
    }
  };

  return (
    <div className="flex items-center space-x-1 mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-6 px-1.5 text-xs hover:bg-white/20 text-gray-400 hover:text-gray-600 transition-all"
        title={copied ? "Copied!" : "Copy message"}
      >
        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="h-6 px-1.5 text-xs hover:bg-white/20 text-gray-400 hover:text-gray-600 transition-all"
        title="Download as text file"
      >
        <Download className="w-3 h-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="h-6 px-1.5 text-xs hover:bg-white/20 text-gray-400 hover:text-gray-600 transition-all"
        title="Share message"
      >
        <Share className="w-3 h-3" />
      </Button>
    </div>
  );
}