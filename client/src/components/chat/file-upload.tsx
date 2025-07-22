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

    // Check file type - now supporting PDF, Word docs, and text files
    const allowedTypes = [
      'text/plain', 
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please select a text file, PDF, or Word document (.docx).",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Processing file...",
        description: "Extracting text content from your document.",
      });

      // Upload and process file on server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/files/process', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'File processing failed');
      }

      const uploadedFile = {
        name: result.fileName,
        size: file.size,
        type: result.fileType,
        content: result.content
      };

      setUploadedFile(uploadedFile);
      onFileContent(result.content, result.fileName);

      toast({
        title: "File processed successfully",
        description: `Extracted ${result.wordCount.toLocaleString()} words from ${result.fileName}`,
      });

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Could not process the file. Please try again.",
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
        title="Attach a file (text, PDF, or Word document, e.g. 4W's, sermons, Bible studies, devotionals)"
      >
        <Paperclip className="w-4 h-4 mr-2" />
        {uploadedFile ? 'Change File' : 'Attach File'}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".txt,.pdf,.docx,.doc"
        className="hidden"
      />
    </div>
  );
}