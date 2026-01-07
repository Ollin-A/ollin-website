import React, { useState, useEffect } from 'react';

const ReelPeekSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger subtle entrance animation
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full z-10 px-[5vw] pointer-events-none mix-blend-normal pb-24">
      {/* 
        Container with negative margin to pull overlapping "Peek" effect.
        -mt-[100px] on desktop ensures about 100px of the card is visible initially 
        at the bottom of the 100vh hero.
      */}
      <div 
        className={`
          w-full max-w-[1500px] mx-auto 
          -mt-[80px] md:-mt-[110px] 
          transition-all duration-1000 ease-out 
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
        `}
      >
        <div className="relative w-full aspect-video md:aspect-[2.4/1] bg-[#f2efe9] rounded-[12px] md:rounded-[16px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/[0.06] pointer-events-auto group">
          
          {/* Video Element */}
          <video
            className="w-full h-full object-cover opacity-95 transition-opacity duration-700 hover:opacity-100"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2400&auto=format&fit=crop"
          >
            {/* 
              Placeholder video source representing "Contractor/Design" work. 
              Using a clean, architectural or working hands styled stock clip.
            */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-architect-working-on-a-model-house-3444-large.mp4" type="video/mp4" />
          </video>

          {/* Subtle Grain/Texture overlay on video for filmic feel */}
          <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
          
          {/* Optional: Subtle inner border for depth */}
          <div className="absolute inset-0 border border-white/10 rounded-[12px] md:rounded-[16px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ReelPeekSection;