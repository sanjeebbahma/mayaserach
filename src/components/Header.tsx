"use client";

import { User, ShoppingBag, Mail, Zap, MessageCircle, Menu } from "lucide-react";
import InstallButton from "./InstallButton";

export default function Header() {
  return (
    <header className="w-full bg-white relative z-20 shadow-sm">
      {/* Mobile Header */}
      <div className="flex md:hidden justify-between items-center px-4 py-3">
        {/* Left side - Profile and Store icons only */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-105" title="Profile">
            <User className="w-5 h-5" style={{ color: '#ba160a' }} />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-105" title="Store">
            <ShoppingBag className="w-5 h-5" style={{ color: '#ba160a' }} />
          </div>
        </div>

        {/* Right side - Install App, AI Mode, Chat, and Menu */}
        <div className="flex items-center space-x-2">
          <InstallButton />
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-105" title="AI Mode">
            <Zap className="w-5 h-5" style={{ color: '#ba160a' }} />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-105" title="Chat">
            <MessageCircle className="w-5 h-5" style={{ color: '#ba160a' }} />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 text-white shadow-lg hover:shadow-xl" style={{ backgroundColor: '#ba160a' }} title="Menu">
            <Menu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center px-4 lg:px-8 py-4">
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105">
            <User className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>Profile</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105">
            <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>Store</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105">
            <Mail className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>Mail</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 lg:space-x-8">
          <InstallButton />
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105">
            <Zap className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>AI Mode</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105">
            <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#ba160a' }} />
            <span className="font-medium text-sm lg:text-base" style={{ color: '#ba160a' }}>Chat</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl" style={{ backgroundColor: '#ba160a' }}>
            <Menu className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="font-medium text-sm lg:text-base">Menu</span>
          </div>
        </div>
      </div>
    </header>
  );
}
