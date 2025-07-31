import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  canInstall: boolean;
  install: () => Promise<void>;
  showInstallPrompt: boolean;
  dismissInstallPrompt: () => void;
}

export function usePWA(): PWAState {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Check if PWA is enabled via feature flag
  const { data: featureFlags } = useQuery({
    queryKey: ["/api/feature-flags/public"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isPWAEnabled = featureFlags?.flags?.find(
    (flag: any) => flag.name === 'pwa_enabled'
  )?.enabled ?? false;

  useEffect(() => {
    if (!isPWAEnabled) return;

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setInstallPrompt(event);
      
      // Show install prompt after a delay if not already installed
      if (!isInstalled) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 10000); // Show after 10 seconds
      }
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallPrompt(false);
      console.log('PWA was installed');
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isPWAEnabled, isInstalled]);

  const install = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallPrompt(false);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setInstallPrompt(null);
    } catch (error) {
      console.error('Install failed:', error);
    }
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show install prompt if dismissed in current session
  const isDismissedThisSession = sessionStorage.getItem('pwa-install-dismissed') === 'true';

  return {
    isInstallable: !!installPrompt && isPWAEnabled,
    isInstalled,
    isOffline,
    canInstall: !!installPrompt && !isInstalled && isPWAEnabled,
    install,
    showInstallPrompt: showInstallPrompt && !isDismissedThisSession && !isInstalled && isPWAEnabled,
    dismissInstallPrompt,
  };
}