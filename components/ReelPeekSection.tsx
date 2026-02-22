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
    <section className="reelPeek relative w-full z-10 px-0 md:px-[5vw] mix-blend-normal pb-0 md:pb-24 pointer-events-none">
      <style>{`
        /* ✅ Subimos el video manualmente en móvil para que quede pegado al texto "Systems" */
        @media (max-width: 767px) {
          .reelPeek {
            margin-top: -30px; /* Ajusta este valor si necesitas que el video suba más o menos */
          }
        }
      `}</style>

      <div
        className={`
          w-full max-w-none mx-0
          md:max-w-[1500px] md:mx-auto
          transition-all duration-1000 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        `}
      >
        <div
          className="
            relative w-full bg-[#f2efe9]
            rounded-none overflow-hidden
            shadow-[0_10px_30px_rgba(0,0,0,0.06)]
            border border-black/[0.06]
          "
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

          <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 border border-white/10 rounded-none pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ReelPeekSection;