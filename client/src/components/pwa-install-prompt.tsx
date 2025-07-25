import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Download, Smartphone, Monitor, Wifi, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay (don't annoy users immediately)
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true);
        }
      }, 10000); // Wait 10 seconds before showing
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      toast({
        title: "App Installed Successfully!",
        description: "F-AI-TH-Connect is now available on your home screen"
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled, toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback: show manual installation instructions
      setShowBenefits(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "Installing App...",
          description: "F-AI-TH-Connect will be added to your home screen"
        });
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Installation failed:', error);
      setShowBenefits(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember user dismissed (don't show again for a while)
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if already installed or recently dismissed
  const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
  if (isInstalled || (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000)) {
    return null;
  }

  if (showBenefits) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              Install F-AI-TH-Connect
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBenefits(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Get the full app experience on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Wifi className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Works Offline</p>
                <p className="text-xs text-gray-600">Access your faith resources anywhere</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Monitor className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Home Screen Access</p>
                <p className="text-xs text-gray-600">Quick access like a native app</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Daily Verse Notifications</p>
                <p className="text-xs text-gray-600">Stay connected to Scripture</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700">
            <p className="font-medium mb-2">Manual Installation:</p>
            <div className="space-y-1">
              <p><strong>Chrome/Edge:</strong> Menu → "Install F-AI-TH-Connect"</p>
              <p><strong>Safari (iOS):</strong> Share → "Add to Home Screen"</p>
              <p><strong>Firefox:</strong> Menu → "Install" or "Add to Home screen"</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleInstallClick} className="flex-1" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Try Auto Install
            </Button>
            <Button variant="outline" onClick={() => setShowBenefits(false)} size="sm">
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-72 z-50 shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-600" />
            Install App
            <Badge variant="secondary" className="text-xs">Free</Badge>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription className="text-sm">
          Install F-AI-TH-Connect on your device for faster access and offline support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button onClick={handleInstallClick} className="flex-1" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowBenefits(true)} 
            size="sm"
          >
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}