"use client";

import { useState } from "react";
import { User, ShoppingBag, Mail, Zap, MessageCircle, Menu } from "lucide-react";

export default function Header() {
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
    <header className="w-full bg-white relative z-20 shadow-sm">
      {/* Mobile Header */}
      <div className="flex md:hidden justify-between items-center px-4 py-3">
        {/* Left side - Profile and Store icons only */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-105" title="Profile" onClick={() => handleComingSoon("Profile")}>
            <User className="w-5 h-5" style={{ color: '#ba160a' }} />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-105" title="Store" onClick={() => handleComingSoon("Store")}>
            <ShoppingBag className="w-5 h-5" style={{ color: '#ba160a' }} />
          </div>
        </div>

        {/* Right side - AI Mode, Chat, and Menu */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-105" title="AI Mode" onClick={() => handleComingSoon("AI Mode")}>
            <Zap className="w-5 h-5" style={{ color: '#ba160a' }} />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-105" title="Chat" onClick={() => handleComingSoon("Chat")}>
            <MessageCircle className="w-5 h-5" style={{ color: '#ba160a' }} />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 text-white shadow-lg hover:shadow-xl" style={{ backgroundColor: '#ba160a' }} title="Menu" onClick={() => handleComingSoon("Menu")}>
            <Menu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center px-4 lg:px-8 py-4">
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" onClick={() => handleComingSoon("Profile")}>
            <User className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>Profile</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" onClick={() => handleComingSoon("Store")}>
            <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>Store</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" onClick={() => handleComingSoon("Mail")}>
            <Mail className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>Mail</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" onClick={() => handleComingSoon("AI Mode")}>
            <Zap className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>AI Mode</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" onClick={() => handleComingSoon("Chat")}>
            <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>Chat</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl" style={{ backgroundColor: '#ba160a' }} onClick={() => handleComingSoon("Menu")}>
            <Menu className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="font-medium text-sm lg:text-base">Menu</span>
          </div>
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
    </header>
  );
}
