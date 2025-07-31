import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Download, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export default function InstallPrompt() {
  const { showInstallPrompt, install, dismissInstallPrompt, isOffline } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  if (!showInstallPrompt) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-white shadow-2xl border-0">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Install F-AI-TH-Connect</CardTitle>
                <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                  <Download className="w-3 h-3 mr-1" />
                  Free App
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissInstallPrompt}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Get the full F-AI-TH-Connect experience! Install our app for faster access, 
            offline Bible study, and a native mobile experience.
          </p>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Monitor className="w-4 h-4 text-blue-500" />
              <span>Home Screen Access</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              {isOffline ? (
                <WifiOff className="w-4 h-4 text-orange-500" />
              ) : (
                <Wifi className="w-4 h-4 text-green-500" />
              )}
              <span>Offline Bible Study</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Smartphone className="w-4 h-4 text-purple-500" />
              <span>Native App Feel</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Download className="w-4 h-4 text-amber-500" />
              <span>Instant Loading</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-900 text-sm mb-1">Perfect for:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Daily devotions and Bible study</li>
              <li>• Church services and group discussions</li>
              <li>• Offline spiritual guidance access</li>
            </ul>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {isInstalling ? 'Installing...' : 'Install App'}
            </Button>
            <Button
              variant="outline"
              onClick={dismissInstallPrompt}
              className="px-4"
            >
              Maybe Later
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            No additional storage required • Works on mobile and desktop
          </p>
        </CardContent>
      </Card>
    </div>
  );
}