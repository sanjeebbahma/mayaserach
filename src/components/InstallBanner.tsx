"use client";

import { useState, useEffect } from "react";
import { usePWAInstall } from "./PWAInstallPrompt";

export default function InstallBanner() {
  const { canInstall, isIOS, installApp } = usePWAInstall();
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [wasDismissed, setWasDismissed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('install_banner_dismissed') === 'true';
    setWasDismissed(dismissed);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // iOS - show beautiful popup
      setShowInstallPopup(true);
    } else {
      // Android/Chrome
      await installApp();
    }
  };

  const closePopup = () => {
    setShowInstallPopup(false);
  };

  const dismissBanner = () => {
    setIsDismissed(true);
    localStorage.setItem('install_banner_dismissed', 'true');
  };

  // Debug logging
  console.log('InstallBanner Debug:', {
    isClient,
    isDismissed,
    wasDismissed,
    canInstall,
    isIOS
  });

  // Temporarily show banner for debugging
  // if (!isClient) return null;
  // if (isDismissed || wasDismissed) return null;
  
  // Check if running as PWA (standalone mode)
  // const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
  //                     (window.navigator as any).standalone === true;
  // if (isStandalone) return null;

  return (
    <>
      {/* Compact Install Banner - Mobile Only */}
      <div className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 sm:px-4 md:hidden" style={{ backgroundColor: 'red', zIndex: 9999 }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - Compact message */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium truncate">
              <span className="hidden sm:inline">Get Maya Search as an app for faster access and offline support</span>
              <span className="sm:hidden">Get Maya Search as an app!</span>
            </span>
          </div>

          {/* Right side - Compact buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              className="px-2 sm:px-3 py-1 bg-white text-red-600 font-semibold rounded text-xs hover:bg-gray-100 transition-all duration-200"
            >
              Install
            </button>
            <button
              onClick={dismissBanner}
              className="p-1 text-white/80 hover:text-white transition-colors"
              title="Dismiss"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Simple PWA Install Popup */}
      {showInstallPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePopup}
          />
          
          {/* Popup Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 transform animate-in zoom-in-95 duration-300">
            {/* Title */}
            <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#ba160a' }}>
              Install Maya Search App
            </h3>

            {/* Message */}
            <p className="text-gray-700 text-center text-sm mb-6">
              Add Maya Search to your home screen for quick access and better performance.
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={closePopup}
                className="flex-1 px-4 py-3 text-gray-600 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={closePopup}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
