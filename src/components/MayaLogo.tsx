"use client";

export default function MayaLogo() {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl font-bold tracking-wider text-center" style={{ fontWeight: '800', color: '#ba160a', letterSpacing: '0.1em' }}>
        <span className="inline-block letter-bounce" style={{ animationDelay: '0s' }}>M</span>
        <span className="inline-block letter-bounce" style={{ animationDelay: '0.2s' }}>A</span>
        <span className="inline-block letter-bounce" style={{ animationDelay: '0.4s' }}>Y</span>
        <span className="inline-block letter-bounce" style={{ animationDelay: '0.6s' }}>A</span>
      </h1>
    </div>
  );
}
