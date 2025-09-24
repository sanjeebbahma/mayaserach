"use client";

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 sm:px-8 bg-gray-50 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <p className="text-gray-600 text-sm sm:text-base">© 2024 MAYA Search Engine. All rights reserved.</p>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <a href="#" className="font-medium transition-colors duration-300" style={{ color: '#ba160a' }}>Privacy</a>
          <a href="#" className="font-medium transition-colors duration-300" style={{ color: '#ba160a' }}>Terms</a>
          <a href="#" className="font-medium transition-colors duration-300" style={{ color: '#ba160a' }}>Help</a>
        </div>
      </div>
    </footer>
  );
}
