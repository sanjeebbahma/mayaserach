"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickAccess() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [popupApp, setPopupApp] = useState<string>("");
  const apps = [
    { name: "Scrolllink", icon: "/apps/scrolllink.jpg", url: "https://scrolllink.com/" },
    { name: "MayoTube", icon: "/apps/mayotube.jpg", url: "https://mayotube.mayaworldweb.com/" },
    { name: "Images", icon: "/apps/images_app.jpg", url: null, searchCategory: "images" },
    { name: "NewsLiveNow", icon: "/apps/newslivenow.jpg", url: "https://newslivenow.com/" },
    { name: "MayoAI", icon: null, url: null },
    { name: "MayoPedia", icon: "/apps/mayopedia.jpg", url: null, comingSoon: true },
    { name: "BigXPrime", icon: "/apps/bigxprime.jpg", url: null, comingSoon: true },
    { name: "MayoMaps", icon: null, url: null },
    { name: "MayoBooks", icon: null, url: null },
    { name: "MayoForums", icon: null, url: null }
  ];

  const handleAppClick = (app: typeof apps[0]) => {
    if (app.url) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    } else if (app.comingSoon) {
      setPopupApp(app.name);
      setShowPopup(true);
    } else if (app.searchCategory) {
      // Set image mode in localStorage and reload page
      localStorage.setItem('searchMode', 'images');
      window.location.reload();
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupApp("");
  };

  return (
    <div className="w-full max-w-2xl mt-12 sm:mt-16 md:mt-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 relative" style={{ color: '#ba160a' }}>
        Quick Access
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5" style={{ backgroundColor: '#ba160a' }}></div>
      </h2>
      
      {/* Apps Grid */}
      <div className="grid grid-cols-5 gap-0 gap-y-4 sm:gap-4 md:gap-6">
        {apps.map((app, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => handleAppClick(app)}
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 border-2 rounded-2xl bg-white flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200" style={{ borderColor: '#ba160a' }}>
              {app.icon ? (
                <img 
                  src={app.icon} 
                  alt={app.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              )}
            </div>
            <span className="mt-1 text-xs sm:text-sm font-medium text-center" style={{ color: '#ba160a' }}>{app.name}</span>
          </div>
        ))}
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
              We are working on the <strong>{popupApp}</strong> application and soon we will connect it with the Maya Search Engine. Stay tuned for updates!
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
    </div>
  );
}
