import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Smartphone, Tablet, Monitor } from "lucide-react";
import { useLocation } from "wouter";
import QRCode from "qrcode";

export default function SharePage() {
  const [, setLocation] = useLocation();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const appUrl = window.location.origin;

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(appUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e40af', // Blue-700
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = 'F-AI-TH-Connect-QR.png';
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const shareUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'F-AI-TH-Connect - Christian AI Guidance',
          text: 'Get biblical wisdom and spiritual support through AI-powered conversations',
          url: appUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(appUrl);
      alert('App URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setLocation("/")}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold faith-gradient-text">Share F-AI-TH-Connect</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share the <span className="faith-gradient-text">Gift of Faith</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help others connect with biblical wisdom and spiritual guidance through F-AI-TH-Connect
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Card */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>Scan QR Code</span>
              </CardTitle>
              <CardDescription>
                Perfect for in-person sharing and printed materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {qrCodeUrl && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg shadow-inner border-2 border-gray-100">
                    <img 
                      src={qrCodeUrl} 
                      alt="F-AI-TH-Connect QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  className="w-full"
                  disabled={!qrCodeUrl}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                
                <p className="text-sm text-gray-500">
                  Great for bulletins, flyers, and ministry materials
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Share Options Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share Options</span>
              </CardTitle>
              <CardDescription>
                Multiple ways to spread the word about F-AI-TH-Connect
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={shareUrl}
                className="w-full faith-button-primary"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share App Link
              </Button>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Perfect for:</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Monitor className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Church websites and digital bulletins</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <Tablet className="w-5 h-5 text-amber-600" />
                    <span className="text-sm">Social media posts and stories</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Text messages and personal sharing</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-medium">App URL:</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-white rounded border text-sm font-mono">
                    {appUrl}
                  </code>
                  <Button
                    onClick={() => navigator.clipboard.writeText(appUrl)}
                    variant="outline"
                    size="sm"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use the QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Print or Display</h4>
                <p className="text-sm text-gray-600">
                  Add the QR code to bulletins, flyers, or display on screens
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-amber-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">Scan with Camera</h4>
                <p className="text-sm text-gray-600">
                  Users open their phone camera and point it at the QR code
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Install & Use</h4>
                <p className="text-sm text-gray-600">
                  The app opens in their browser and they can install it to their home screen
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ministry Focus */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-amber-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Expanding God's Kingdom Together</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Every share helps bring biblical wisdom and spiritual guidance to those who need it most. 
              Thank you for being part of this ministry outreach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}