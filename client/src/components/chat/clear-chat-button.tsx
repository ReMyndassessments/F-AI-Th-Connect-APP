import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ClearChatButtonProps {
  onClearChat: () => void;
  disabled?: boolean;
}

export default function ClearChatButton({ onClearChat, disabled = false }: ClearChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleConfirmClear = () => {
    onClearChat();
    setIsOpen(false);
    toast({
      title: "Conversation cleared",
      description: "Starting a new spiritual conversation.",
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors text-xs sm:text-sm px-2 sm:px-4"
          title="Clear conversation and start new"
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">Clear Chat</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
            Clear Conversation
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to clear this conversation? This will permanently delete all messages and start a new spiritual conversation. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmClear}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Clear Conversation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}