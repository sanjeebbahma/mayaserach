"use client";

export default function QuickAccess() {
  const apps = [
    "Scrolllink",
    "Myotube", 
    "Images",
    "NewsLiveNow",
    "MayoAI",
    "MayoPedia",
    "MayoShopping",
    "MayoMaps",
    "MayoBooks",
    "MayoForums"
  ];

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-3xl font-bold text-center mb-6 relative" style={{ color: '#ba160a' }}>
        Quick Access
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5" style={{ backgroundColor: '#ba160a' }}></div>
      </h2>
      
      {/* Apps Grid */}
      <div className="grid grid-cols-5 gap-0 gap-y-4 sm:gap-4 md:gap-6">
        {apps.map((app, index) => (
          <div key={index} className="flex flex-col items-center cursor-pointer group">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 border-2 rounded-2xl bg-white flex items-center justify-center" style={{ borderColor: '#ba160a' }}>
            </div>
            <span className="mt-1 text-xs sm:text-sm font-medium text-center" style={{ color: '#ba160a' }}>{app}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
