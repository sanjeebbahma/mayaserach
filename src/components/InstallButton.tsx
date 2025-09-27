"use client";

import { usePWAInstall } from "./PWAInstallPrompt";

export default function InstallButton() {
  const { canInstall, isIOS, installApp } = usePWAInstall();

  if (!canInstall) return null;

  return (
    <button
      onClick={installApp}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <span>Install App</span>
    </button>
  );
}
