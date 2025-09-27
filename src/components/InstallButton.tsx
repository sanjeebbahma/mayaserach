"use client";

import { useState } from "react";
import { usePWAInstall } from "./PWAInstallPrompt";

export default function InstallButton() {
  const { canInstall, isIOS, installApp } = usePWAInstall();
  const [showInstallPopup, setShowInstallPopup] = useState(false);

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

  if (!canInstall) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-105"
        title="Install App"
      >
        <svg className="w-5 h-5" style={{ color: '#ba160a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>

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
