"use client";

import { useState } from "react";

export default function Footer() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupApp, setPopupApp] = useState<string>("");

  const handleComingSoon = (appName: string) => {
    setPopupApp(appName);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupApp("");
  };
  return (
    <footer className="w-full py-6 px-4 sm:px-8 bg-gray-50 relative z-10 mt-12 sm:mt-16 md:mt-20">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <p className="text-gray-600 text-sm sm:text-base">© 2025 MAYA Search Engine. All rights reserved.</p>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <a href="#" className="font-medium transition-colors duration-300 cursor-pointer hover:underline" style={{ color: '#ba160a' }} onClick={(e) => { e.preventDefault(); handleComingSoon("Privacy"); }}>Privacy</a>
          <a href="#" className="font-medium transition-colors duration-300 cursor-pointer hover:underline" style={{ color: '#ba160a' }} onClick={(e) => { e.preventDefault(); handleComingSoon("Terms"); }}>Terms</a>
          <a href="#" className="font-medium transition-colors duration-300 cursor-pointer hover:underline" style={{ color: '#ba160a' }} onClick={(e) => { e.preventDefault(); handleComingSoon("Help"); }}>Help</a>
        </div>
      </div>

      {/* Beautiful Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePopup}
          />

          {/* Popup Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-8 transform animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-center mb-4" style={{ color: '#ba160a' }}>
              🚀 {popupApp} is Coming Soon!
            </h3>

            {/* Message */}
            <p className="text-gray-700 text-center leading-relaxed mb-6">
              We are working on the <strong>{popupApp}</strong> feature and soon we will connect it with the Maya Search Engine. Stay tuned for updates!
            </p>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={closePopup}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
