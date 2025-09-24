"use client";

import { User, ShoppingBag, Mail, Zap, MessageCircle, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center px-4 sm:px-8 py-4 bg-white relative z-20">
      <div className="flex items-center space-x-4 sm:space-x-8">
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
      <div className="flex items-center space-x-4 sm:space-x-8">
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
    </header>
  );
}
