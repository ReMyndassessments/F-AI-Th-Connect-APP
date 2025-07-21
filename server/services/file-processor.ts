import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

export interface ProcessedFile {
  fileName: string;
  content: string;
  fileType: string;
  wordCount: number;
}

export class FileProcessor {
  
  static async processPDF(buffer: Buffer, fileName: string): Promise<ProcessedFile> {
    try {
      const data = await pdfParse(buffer);
      const content = data.text?.trim() || '';
      
      if (!content) {
        throw new Error('PDF appears to be empty or contains only images');
      }
      
      return {
        fileName,
        content,
        fileType: 'pdf',
        wordCount: content.split(/\s+/).length
      };
    } catch (error) {
      console.error('PDF processing error:', error);
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  static async processWordDocument(buffer: Buffer, fileName: string): Promise<ProcessedFile> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const content = result.value?.trim() || '';
      
      if (!content) {
        throw new Error('Word document appears to be empty');
      }
      
      return {
        fileName,
        content,
        fileType: 'docx',
        wordCount: content.split(/\s+/).length
      };
    } catch (error) {
      console.error('Word document processing error:', error);
      throw new Error(`Failed to process Word document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  static async processTextFile(buffer: Buffer, fileName: string): Promise<ProcessedFile> {
    try {
      const content = buffer.toString('utf-8').trim();
      
      if (!content) {
        throw new Error('Text file appears to be empty');
      }
      
      return {
        fileName,
        content,
        fileType: 'text',
        wordCount: content.split(/\s+/).length
      };
    } catch (error) {
      console.error('Text file processing error:', error);
      throw new Error(`Failed to process text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  static async processFile(buffer: Buffer, fileName: string, mimeType: string): Promise<ProcessedFile> {
    const fileExtension = fileName.toLowerCase().split('.').pop();
    
    switch (true) {
      case mimeType === 'application/pdf' || fileExtension === 'pdf':
        return this.processPDF(buffer, fileName);
        
      case mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
           fileExtension === 'docx':
        return this.processWordDocument(buffer, fileName);
        
      case mimeType === 'application/msword' || fileExtension === 'doc':
        throw new Error('Legacy .doc files are not supported. Please convert to .docx format.');
        
      case mimeType === 'text/plain' || fileExtension === 'txt':
        return this.processTextFile(buffer, fileName);
        
      default:
        throw new Error(`Unsupported file type: ${mimeType}. Supported formats: PDF, Word (.docx), and Text (.txt)`);
    }
  }
  
  static formatFileContent(processedFile: ProcessedFile): string {
    const { fileName, content, fileType, wordCount } = processedFile;
    
    return `[Uploaded ${fileType.toUpperCase()} Document: ${fileName}]
Word count: ${wordCount.toLocaleString()} words

Content:
${content}

---
Please provide biblical guidance, create study materials, or answer questions based on the content above.`;
  }
}