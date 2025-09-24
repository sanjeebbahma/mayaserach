"use client";

import Header from "@/components/Header";
import MayaLogo from "@/components/MayaLogo";
import SearchBar from "@/components/SearchBar";
import QuickAccess from "@/components/QuickAccess";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden" style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Floating Particles Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="floating-particle" style={{ width: '20px', height: '20px', left: '10%', animationDelay: '0s', animationDuration: '25s' }}></div>
        <div className="floating-particle" style={{ width: '15px', height: '15px', left: '20%', animationDelay: '2s', animationDuration: '30s' }}></div>
        <div className="floating-particle" style={{ width: '25px', height: '25px', left: '40%', animationDelay: '4s', animationDuration: '20s' }}></div>
        <div className="floating-particle" style={{ width: '18px', height: '18px', left: '60%', animationDelay: '6s', animationDuration: '35s' }}></div>
        <div className="floating-particle" style={{ width: '22px', height: '22px', left: '80%', animationDelay: '8s', animationDuration: '28s' }}></div>
        <div className="floating-particle" style={{ width: '16px', height: '16px', left: '90%', animationDelay: '10s', animationDuration: '32s' }}></div>
      </div>

      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <MayaLogo />
        <SearchBar />
        <QuickAccess />
      </main>

      <Footer />
    </div>
  );
}