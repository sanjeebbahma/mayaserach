"use client";

export default function QuickAccess() {
  const apps = [
    { name: "Scrolllink", icon: "/apps/scrolllink.jpg", url: "https://scrolllink.com/" },
    { name: "MayoTube", icon: "/apps/mayotube.jpg", url: "https://mayotube.mayaworldweb.com/" },
    { name: "Images", icon: null, url: null },
    { name: "NewsLiveNow", icon: "/apps/newslivenow.jpg", url: "https://newslivenow.com/" },
    { name: "MayoAI", icon: null, url: null },
    { name: "MayoPedia", icon: null, url: null },
    { name: "MayoShopping", icon: null, url: null },
    { name: "MayoMaps", icon: null, url: null },
    { name: "MayoBooks", icon: null, url: null },
    { name: "MayoForums", icon: null, url: null }
  ];

  const handleAppClick = (app: typeof apps[0]) => {
    if (app.url) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
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
    </div>
  );
}
