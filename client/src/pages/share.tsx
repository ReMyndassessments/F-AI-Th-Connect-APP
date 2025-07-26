import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Smartphone, Tablet, Monitor, Plus } from "lucide-react";
import { useLocation } from "wouter";
import QRCode from "qrcode";
import { usePWA } from "@/hooks/use-pwa";

export default function SharePage() {
  const [, setLocation] = useLocation();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const appUrl = window.location.origin;
  const { isInstallable, isInstalled, installApp, getInstallInstructions } = usePWA();
  const installInstructions = getInstallInstructions();

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
              {isInstallable && (
                <Button
                  onClick={installApp}
                  className="w-full faith-button-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Install App to Home Screen
                </Button>
              )}
              
              {isInstalled && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ App is installed on this device
                  </p>
                </div>
              )}
              
              <Button
                onClick={shareUrl}
                className="w-full faith-button-primary"
                variant={isInstallable ? "outline" : "default"}
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

        {/* Installation Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Install the App</CardTitle>
            <CardDescription>
              Get F-AI-TH-Connect as a native app on your device for the best experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* QR Code Instructions */}
              <div>
                <h4 className="font-semibold mb-4 text-lg">Via QR Code</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <p className="text-sm text-gray-600">Scan the QR code with your phone camera</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-600 font-bold text-sm">2</span>
                    </div>
                    <p className="text-sm text-gray-600">Tap the notification to open the app</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 font-bold text-sm">3</span>
                    </div>
                    <p className="text-sm text-gray-600">Follow the installation steps below</p>
                  </div>
                </div>
              </div>

              {/* Browser-specific Instructions */}
              <div>
                <h4 className="font-semibold mb-4 text-lg">For {installInstructions.platform} Users</h4>
                <div className="space-y-3">
                  {installInstructions.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg">
              <h5 className="font-semibold text-gray-900 mb-3">Benefits of Installing:</h5>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Works offline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Faster loading</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Native app feel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Home screen access</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ministry Focus */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-amber-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Expanding God's Kingdom Together</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-4">
              Every share and installation helps bring biblical wisdom and spiritual guidance to those who need it most. 
              Thank you for being part of this ministry outreach.
            </p>
            <div className="text-center">
              <p className="text-sm opacity-75">
                When installed as an app, F-AI-TH-Connect works offline and provides instant access to spiritual guidance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}