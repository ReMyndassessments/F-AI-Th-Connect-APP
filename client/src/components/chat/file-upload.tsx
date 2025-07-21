import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X, FileText, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileContent: (content: string, fileName: string) => void;
  disabled?: boolean;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content: string;
}

export default function FileUpload({ onFileContent, disabled = false }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { toast } = useToast();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const allowedTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please select a text file, PDF, or image.",
        variant: "destructive",
      });
      return;
    }

    try {
      let content = '';
      
      if (file.type === 'text/plain') {
        content = await file.text();
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'll show a placeholder message
        content = `[PDF Document: ${file.name}]\n\nThis is a PDF file. Please copy and paste the text content you'd like to analyze, as PDF processing requires additional setup.`;
      } else if (file.type.startsWith('image/')) {
        // For images, we'll create a data URL and ask for description
        const reader = new FileReader();
        reader.onload = (e) => {
          content = `[Image: ${file.name}]\n\nPlease describe what you see in this image or what spiritual guidance you're seeking related to it.`;
          setUploadedFile({
            name: file.name,
            size: file.size,
            type: file.type,
            content
          });
          onFileContent(content, file.name);
        };
        reader.readAsDataURL(file);
        return;
      }

      const uploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        content
      };

      setUploadedFile(uploadedFile);
      onFileContent(content, file.name);

      toast({
        title: "File uploaded",
        description: `${file.name} has been processed and added to your message.`,
      });

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Upload failed",
        description: "Could not process the file. Please try again.",
        variant: "destructive",
      });
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="space-y-2">
      {uploadedFile && (
        <div className="flex items-center space-x-2 bg-blue-50 rounded-lg p-2 text-sm">
          <div className="text-blue-600">
            {getFileIcon(uploadedFile.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-blue-800 font-medium truncate">{uploadedFile.name}</p>
            <p className="text-blue-600 text-xs">{formatFileSize(uploadedFile.size)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleFileSelect}
        disabled={disabled}
        className="hover:bg-gray-50 transition-colors"
        title="Attach a file (text, PDF, or image)"
      >
        <Paperclip className="w-4 h-4 mr-2" />
        {uploadedFile ? 'Change File' : 'Attach File'}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".txt,.pdf,.jpg,.jpeg,.png,.gif"
        className="hidden"
      />
    </div>
  );
}