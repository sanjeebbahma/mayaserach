"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Hook to manage PWA install functionality
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // For iOS, can always show install instructions
    if (iOS && !standalone) {
      setCanInstall(true);
    }

    // For Android, wait for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      // Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
        setCanInstall(false);
      }
      
      setDeferredPrompt(null);
    } else if (isIOS) {
      // iOS - show instructions
      setShowInstallPrompt(true);
    }
  };

  return {
    canInstall: canInstall && !isStandalone,
    isIOS,
    isStandalone,
    installApp
  };
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000); // 24 hours

    // Show prompt if not dismissed recently and not already installed
    if (!standalone && dismissedTime < oneDayAgo) {
      // For iOS, show immediately
      if (iOS) {
        setShowInstallPrompt(true);
      } else {
        // For Android, wait for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
          e.preventDefault();
          setDeferredPrompt(e as BeforeInstallPromptEvent);
          setShowInstallPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
      }
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      // iOS - just close the prompt
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      
      {/* Popup Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm mx-4 p-6 transform animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center mb-3" style={{ color: '#ba160a' }}>
          Install Maya Search
        </h3>

        {/* Message */}
        <p className="text-gray-700 text-center text-sm leading-relaxed mb-4">
          {isIOS ? (
            <>
              Add Maya Search to your home screen for quick access and a better experience!
              <br /><br />
              <strong>Tap the Share button</strong> <span className="text-lg">📤</span> and select <strong>"Add to Home Screen"</strong>
            </>
          ) : (
            <>
              Install Maya Search as an app for faster access and offline capabilities!
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Install App
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            {isIOS ? 'Got it!' : 'Maybe later'}
          </button>
        </div>

        {/* iOS Instructions */}
        {isIOS && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="text-lg">1️⃣</span>
              <span>Tap the Share button</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
              <span className="text-lg">2️⃣</span>
              <span>Scroll down and tap "Add to Home Screen"</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
              <span className="text-lg">3️⃣</span>
              <span>Tap "Add" to confirm</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
