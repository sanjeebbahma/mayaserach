"use client";

export default function MayaLogo() {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-9xl sm:text-[6rem] md:text-[8rem] lg:text-[18rem] xl:text-[20rem] font-bold tracking-wider" style={{ fontSize: '6rem', fontWeight: '800', color: '#ba160a', letterSpacing: '0.2em' }}>
        <span className="inline-block letter-bounce" style={{ animationDelay: '0s' }}>M</span>
        <span className="inline-block letter-bounce" style={{ animationDelay: '0.2s' }}>A</span>
        <span className="inline-block letter-bounce" style={{ animationDelay: '0.4s' }}>Y</span>
        <span className="inline-block letter-bounce" style={{ animationDelay: '0.6s' }}>A</span>
      </h1>
    </div>
  );
}
