import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Reflows PDF-extracted text:
 *  - Collapses multiple spaces/tabs within each line
 *  - Joins lines that are clearly mid-paragraph continuations
 *  - Keeps blank lines as paragraph separators
 *  - Keeps short ALL-CAPS lines (section headers) separate
 */
function normalizePdfText(raw: string): string {
  const lines = raw.split('\n');
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    // Collapse internal whitespace
    const line = lines[i].replace(/[ \t]{2,}/g, ' ').trim();

    if (line === '') {
      // Blank line — preserve as paragraph break (but deduplicate consecutive blanks)
      if (out.length > 0 && out[out.length - 1] !== '') out.push('');
      continue;
    }

    const isHeader = line.length < 80 && line === line.toUpperCase() && /[A-Z]{2}/.test(line);

    if (isHeader) {
      // Section headers stay on their own line
      if (out.length > 0 && out[out.length - 1] !== '') out.push('');
      out.push(line);
      out.push('');
      continue;
    }

    const prev = out.length > 0 ? out[out.length - 1] : '';

    // Join with previous line if:
    //   - there is a previous line (not blank)
    //   - prev ends mid-sentence (no sentence-ending punctuation) OR with a hyphen
    //   - current line isn't a numbered/bulleted list item
    const canJoin =
      prev !== '' &&
      !/^[-•*\d]/.test(line) &&
      (prev.endsWith('-') || !/[.!?:;]"?\s*$/.test(prev));

    if (canJoin) {
      if (prev.endsWith('-')) {
        out[out.length - 1] = prev.slice(0, -1) + line;
      } else {
        out[out.length - 1] = prev + ' ' + line;
      }
    } else {
      out.push(line);
    }
  }

  // Clean up trailing blank lines and collapse 2+ blanks to 1
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

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
      const raw = data.text?.trim() || '';
      
      if (!raw) {
        throw new Error('PDF appears to be empty or contains only images');
      }

      const content = normalizePdfText(raw);
      
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