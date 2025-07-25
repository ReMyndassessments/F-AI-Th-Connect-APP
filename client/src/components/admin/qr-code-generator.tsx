import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, QrCode, Copy, Printer, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

export function QRCodeGenerator() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [appUrl, setAppUrl] = useState<string>("");
  const [customText, setCustomText] = useState<string>("Visit F-AI-TH-Connect for Christian AI guidance");
  const [qrSize, setQrSize] = useState<string>("400");
  const [errorLevel, setErrorLevel] = useState<string>("M");
  const [includeText, setIncludeText] = useState<boolean>(true);
  const { toast } = useToast();

  // Get current app URL
  useEffect(() => {
    const currentUrl = window.location.origin;
    setAppUrl(currentUrl);
    generateQRCode(currentUrl);
  }, []);

  const generateQRCode = async (url: string) => {
    try {
      const options = {
        width: parseInt(qrSize),
        margin: 2,
        errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
        color: {
          dark: '#1f2937', // Dark blue-gray
          light: '#ffffff'
        }
      };

      const qrDataUrl = await QRCode.toDataURL(url, options);
      setQrDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
  };

  const handleRegenerateQR = () => {
    if (appUrl) {
      generateQRCode(appUrl);
      toast({
        title: "QR Code Generated",
        description: "New QR code created successfully"
      });
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const padding = 40;
      const textHeight = includeText ? 60 : 0;
      canvas.width = img.width + (padding * 2);
      canvas.height = img.height + (padding * 2) + textHeight;
      
      if (ctx) {
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw QR code
        ctx.drawImage(img, padding, padding);
        
        // Add text if enabled
        if (includeText && customText) {
          ctx.fillStyle = '#1f2937';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(customText, canvas.width / 2, img.height + padding + 30);
          
          // Add URL
          ctx.font = '12px Arial';
          ctx.fillText(appUrl, canvas.width / 2, img.height + padding + 50);
        }
        
        // Download
        const link = document.createElement('a');
        link.download = `f-ai-th-connect-qr-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "QR Code Downloaded",
          description: "Ready for printing on materials"
        });
      }
    };
    
    img.src = qrDataUrl;
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      toast({
        title: "URL Copied",
        description: "App URL copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy URL to clipboard",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>F-AI-TH-Connect QR Code</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              background: white;
            }
            .qr-container {
              text-align: center;
              page-break-inside: avoid;
            }
            .qr-code {
              margin: 20px 0;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 10px;
            }
            .description {
              font-size: 16px;
              color: #4b5563;
              margin-bottom: 20px;
            }
            .url {
              font-size: 14px;
              color: #6b7280;
              margin-top: 10px;
            }
            @media print {
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="title">F-AI-TH-Connect</div>
            <div class="description">${customText}</div>
            <div class="qr-code">
              <img src="${qrDataUrl}" alt="F-AI-TH-Connect QR Code" />
            </div>
            <div class="url">${appUrl}</div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate QR codes for printing on T-shirts, flyers, and promotional materials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current App URL */}
        <div className="space-y-2">
          <Label htmlFor="app-url">App URL</Label>
          <div className="flex gap-2">
            <Input
              id="app-url"
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="https://your-app-url.com"
            />
            <Button variant="outline" size="sm" onClick={handleCopyUrl}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* QR Code Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="qr-size">Size (pixels)</Label>
            <Select value={qrSize} onValueChange={setQrSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="200">200x200 (Small)</SelectItem>
                <SelectItem value="400">400x400 (Medium)</SelectItem>
                <SelectItem value="600">600x600 (Large)</SelectItem>
                <SelectItem value="800">800x800 (Extra Large)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="error-level">Error Correction</Label>
            <Select value={errorLevel} onValueChange={setErrorLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (7%)</SelectItem>
                <SelectItem value="M">Medium (15%)</SelectItem>
                <SelectItem value="Q">Quartile (25%)</SelectItem>
                <SelectItem value="H">High (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Include Text</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeText}
                onChange={(e) => setIncludeText(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Add description text</span>
            </div>
          </div>
        </div>

        {/* Custom Text */}
        {includeText && (
          <div className="space-y-2">
            <Label htmlFor="custom-text">Description Text</Label>
            <Textarea
              id="custom-text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter text to display with QR code"
              rows={2}
            />
          </div>
        )}

        {/* Generate Button */}
        <Button onClick={handleRegenerateQR} className="w-full">
          <QrCode className="w-4 h-4 mr-2" />
          Generate QR Code
        </Button>

        {/* QR Code Display */}
        {qrDataUrl && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-center space-y-4">
                  {includeText && customText && (
                    <div>
                      <h3 className="font-semibold text-gray-900">{customText}</h3>
                    </div>
                  )}
                  <img 
                    src={qrDataUrl} 
                    alt="F-AI-TH-Connect QR Code" 
                    className="mx-auto"
                  />
                  {includeText && (
                    <div className="text-sm text-gray-600">{appUrl}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleCopyUrl}>
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
            </div>

            {/* Usage Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Usage Tips
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use High error correction for materials that might get damaged</li>
                <li>• Large sizes (600px+) work best for T-shirts and banners</li>
                <li>• Medium sizes (400px) are perfect for flyers and business cards</li>
                <li>• Test the QR code with different devices before mass printing</li>
                <li>• Consider adding your ministry contact info alongside the QR code</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}