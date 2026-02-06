import React, { useEffect, useRef, useState } from "react";

const ReelPeekSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.videoWidth && v.videoHeight) {
      setAspectRatio(v.videoWidth / v.videoHeight);
    }
  };

  return (
    <section className="relative w-full z-10 px-[5vw] mix-blend-normal pb-24 pointer-events-none">
      <div
        className={`
          w-full max-w-[1500px] mx-auto
          -mt-[80px] md:-mt-[110px]
          transition-all duration-1000 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        `}
      >
        {/* IMPORTANT:
            - No fixed aspect classes here (no aspect-video / no md:aspect-[2.4/1])
            - We use dynamic aspectRatio from the actual video metadata
        */}
        <div
          className="relative w-full bg-[#f2efe9] rounded-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/[0.06]"
          style={{ aspectRatio: aspectRatio ?? 16 / 9 }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover opacity-95 pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            disableRemotePlayback
            tabIndex={-1}
            aria-hidden="true"
            onContextMenu={(e) => e.preventDefault()}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src="/media/reel.mp4" type="video/mp4" />
          </video>

          {/* Grain/Texture overlay */}
          <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />

          {/* Inner border (no rounding) */}
          <div className="absolute inset-0 border border-white/10 rounded-none pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ReelPeekSection;
