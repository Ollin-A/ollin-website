import React, { useEffect, useMemo, useRef, useState } from "react";

type Step = {
    title: string;
    desc: string;
    detail: string;
};

type Trade = {
    name: string;
    headline: string;
    sub: string;
    img: string;
};

/**
 * LiquidImage (14islands-ish):
 * - Canvas con overscan (inset negativo) para que la deformación pueda “salirse”.
 * - La imagen NO se escala al overscan (se mantiene calzada al recuadro original).
 * - Fondo transparente -> lo que se ve detrás es el bg del contenedor (aquí: bg-ollin-bg / #f2efe9).
 * - Sin “idle waves”: sólo anima cuando hay movimiento del cursor.
 */
function LiquidImage({
    src,
    alt,
    className = "",
    overscan = 22,
}: {
    src: string;
    alt?: string;
    className?: string;
    overscan?: number; // px extra alrededor para permitir deformación fuera del borde
}) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const texRef = useRef<WebGLTexture | null>(null);

    const rafRef = useRef<number | null>(null);
    const runningRef = useRef(false);

    // Guardamos posiciones ya en el espacio UV de WebGL (Y hacia arriba)
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);
    const lastMoveTRef = useRef<number>(0);

    const pointerRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
    const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const strengthRef = useRef<number>(0);

    const uniRef = useRef<{
        uTime?: WebGLUniformLocation | null;
        uPointer?: WebGLUniformLocation | null;
        uVelocity?: WebGLUniformLocation | null;
        uStrength?: WebGLUniformLocation | null;
        uPad?: WebGLUniformLocation | null;
        uTex?: WebGLUniformLocation | null;
    }>({});

    const startTimeRef = useRef<number>(performance.now());
    const sizeRef = useRef<{ w: number; h: number; pad: number }>({
        w: 0,
        h: 0,
        pad: overscan,
    });

    const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
        const sh = gl.createShader(type);
        if (!sh) return null;
        gl.shaderSource(sh, source);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            // eslint-disable-next-line no-console
            console.error(gl.getShaderInfoLog(sh));
            gl.deleteShader(sh);
            return null;
        }
        return sh;
    };

    const createProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
        const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return null;

        const prog = gl.createProgram();
        if (!prog) return null;

        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        gl.deleteShader(vs);
        gl.deleteShader(fs);

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            // eslint-disable-next-line no-console
            console.error(gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }
        return prog;
    };

    const createTextureFromImage = (gl: WebGLRenderingContext, img: HTMLImageElement) => {
        const tex = gl.createTexture();
        if (!tex) return null;

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        gl.bindTexture(gl.TEXTURE_2D, null);
        return tex;
    };

    const setCanvasSize = () => {
        const host = hostRef.current;
        const canvas = canvasRef.current;
        const gl = glRef.current;
        if (!host || !canvas || !gl) return;

        const rect = host.getBoundingClientRect();
        const pad = sizeRef.current.pad;

        const wCSS = Math.max(1, rect.width);
        const hCSS = Math.max(1, rect.height);

        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = Math.round((wCSS + pad * 2) * dpr);
        const h = Math.round((hCSS + pad * 2) * dpr);

        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
        }

        sizeRef.current = { w: wCSS, h: hCSS, pad };
    };

    const render = (tNow: number) => {
        const gl = glRef.current;
        const prog = programRef.current;
        const tex = texRef.current;
        if (!gl || !prog || !tex) return;

        const { w, h, pad } = sizeRef.current;

        // Decaimiento rápido (sin “esperar segundos”)
        const dt = Math.min(0.05, (tNow - lastMoveTRef.current) / 1000);
        const s = strengthRef.current;
        const decay = Math.pow(0.12, dt); // se apaga rápido
        strengthRef.current = s * decay;

        if (strengthRef.current < 0.002) {
            strengthRef.current = 0;
            runningRef.current = false;
        }

        const time = (tNow - startTimeRef.current) / 1000;

        gl.useProgram(prog);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(uniRef.current.uTex!, 0);

        gl.uniform1f(uniRef.current.uTime!, time);

        gl.uniform2f(uniRef.current.uPointer!, pointerRef.current.x, pointerRef.current.y);
        gl.uniform2f(uniRef.current.uVelocity!, velocityRef.current.x, velocityRef.current.y);
        gl.uniform1f(uniRef.current.uStrength!, strengthRef.current);

        const padNormX = pad / (w + pad * 2);
        const padNormY = pad / (h + pad * 2);
        gl.uniform2f(uniRef.current.uPad!, padNormX, padNormY);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindTexture(gl.TEXTURE_2D, null);

        if (runningRef.current) {
            rafRef.current = requestAnimationFrame(render);
        }
    };

    const kick = () => {
        if (runningRef.current) return;
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(render);
    };

    useEffect(() => {
        const host = hostRef.current;
        const canvas = canvasRef.current;
        if (!host || !canvas) return;

        const gl = canvas.getContext("webgl", {
            alpha: true,
            premultipliedAlpha: false,
            antialias: true,
            preserveDrawingBuffer: false,
        });

        if (!gl) return;

        glRef.current = gl;

        const vs = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = (aPos + 1.0) * 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

        const fs = `
      precision mediump float;
      varying vec2 vUv;

      uniform sampler2D uTex;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform vec2 uVelocity;
      uniform float uStrength;
      uniform vec2 uPad;

      float inside01(vec2 uv) {
        return step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0);
      }

      void main() {
        vec2 uv = (vUv - uPad) / (1.0 - 2.0 * uPad);

        float baseMask = inside01(uv);
        if (baseMask < 0.5) {
          gl_FragColor = vec4(0.0);
          return;
        }

        vec2 p = uv - uPointer;
        float d = length(p);

        float ripple = sin(d * 26.0 - uTime * 10.0);
        float falloff = exp(-d * 7.0);

        vec2 dir = normalize(p + vec2(1e-4));
        vec2 disp = dir * ripple * falloff * uStrength * 0.028;
        disp += uVelocity * falloff * uStrength * 0.055;

        vec2 uv2 = uv + disp;

        float mask = inside01(uv2);

        vec4 col = texture2D(uTex, clamp(uv2, 0.0, 1.0));
        col.a *= mask;

        gl_FragColor = col;
      }
    `;

        const prog = createProgram(gl, vs, fs);
        if (!prog) return;

        programRef.current = prog;

        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        const verts = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(prog, "aPos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        uniRef.current.uTex = gl.getUniformLocation(prog, "uTex");
        uniRef.current.uTime = gl.getUniformLocation(prog, "uTime");
        uniRef.current.uPointer = gl.getUniformLocation(prog, "uPointer");
        uniRef.current.uVelocity = gl.getUniformLocation(prog, "uVelocity");
        uniRef.current.uStrength = gl.getUniformLocation(prog, "uStrength");
        uniRef.current.uPad = gl.getUniformLocation(prog, "uPad");

        let cancelled = false;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;

        img.onload = () => {
            if (cancelled) return;
            const tex = createTextureFromImage(gl, img);
            if (!tex) return;
            texRef.current = tex;

            setCanvasSize();

            lastMoveTRef.current = performance.now();
            strengthRef.current = 0;
            runningRef.current = false;
            render(performance.now());
        };

        const ro = new ResizeObserver(() => {
            setCanvasSize();
            lastMoveTRef.current = performance.now();
            strengthRef.current = 0;
            runningRef.current = false;
            render(performance.now());
        });
        ro.observe(host);

        const onMove = (e: PointerEvent) => {
            const rect = host.getBoundingClientRect();
            const x = (e.clientX - rect.left) / Math.max(1, rect.width);
            const yDom = (e.clientY - rect.top) / Math.max(1, rect.height);

            const nx = Math.min(1, Math.max(0, x));
            const nyDom = Math.min(1, Math.max(0, yDom));

            // ✅ FIX: DOM (0 arriba) -> UV WebGL (0 abajo)
            const ny = 1 - nyDom;

            const prev = lastPosRef.current;
            if (prev) {
                const vx = nx - prev.x;
                const vy = ny - prev.y; // ✅ Y ya no queda invertido
                velocityRef.current.x = velocityRef.current.x * 0.65 + vx * 0.35;
                velocityRef.current.y = velocityRef.current.y * 0.65 + vy * 0.35;
            }

            lastPosRef.current = { x: nx, y: ny };
            pointerRef.current = { x: nx, y: ny };

            strengthRef.current = 1.0;
            lastMoveTRef.current = performance.now();
            kick();
        };

        const onLeave = () => {
            lastPosRef.current = null;
            velocityRef.current = { x: 0, y: 0 };
        };

        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);

        return () => {
            cancelled = true;
            ro.disconnect();
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerleave", onLeave);

            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            const g = glRef.current;
            if (g) {
                if (texRef.current) g.deleteTexture(texRef.current);
                if (programRef.current) g.deleteProgram(programRef.current);
            }
            glRef.current = null;
            programRef.current = null;
            texRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return (
        <div ref={hostRef} className={["relative", className].join(" ")}>
            <canvas
                ref={canvasRef}
                className="absolute"
                style={{
                    inset: `-${overscan}px`,
                    width: `calc(100% + ${overscan * 2}px)`,
                    height: `calc(100% + ${overscan * 2}px)`,
                    display: "block",
                    pointerEvents: "none",
                }}
                aria-hidden
            />
            <img src={src} alt={alt || ""} className="absolute inset-0 h-full w-full object-cover opacity-0" />
        </div>
    );
}

const BookingSystemSection: React.FC = () => {
    const steps: Step[] = useMemo(
        () => [
            {
                title: "Get found locally",
                desc: "Show up when people search near you.",
                detail: "We tune Maps + local signals so you appear where it counts.",
            },
            {
                title: "Bring in real calls",
                desc: "Ads that bring serious leads, not time-wasters.",
                detail: "Targeting, offers, and weekly tuning focused on booked jobs.",
            },
            {
                title: "Look legit fast",
                desc: "A website that builds trust in seconds.",
                detail: "Clear services, proof, and a simple path to request an estimate.",
            },
            {
                title: "Reply in minutes",
                desc: "Missed call → instant text-back.",
                detail: "Fast replies that stop leads from going to competitors.",
            },
            {
                title: "Keep the loop running.",
                desc: "More 5-stars. More booked work.",
                detail: "Follow-ups, review requests, and rebook nudges that run in the background.",
            },
        ],
        []
    );

    const trades: Trade[] = useMemo(
        () => [
            {
                name: "Roofing",
                headline: "Win the urgent calls.",
                sub: "Storm season visibility + fast follow-ups.",
                img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Plumbing",
                headline: "Be the first they call.",
                sub: "Maps + quick replies for high-intent jobs.",
                img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "HVAC",
                headline: "Stay booked all year.",
                sub: "Seasonal demand + consistent lead flow.",
                img: "https://images.unsplash.com/photo-1581092334510-5c6c2b64b4d0?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Electrical",
                headline: "Cleaner leads, better jobs.",
                sub: "Target the right service calls in your area.",
                img: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Remodeling",
                headline: "Premium positioning.",
                sub: "Before/after proof that sells bigger projects.",
                img: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Concrete",
                headline: "Own your service radius.",
                sub: "Local visibility + estimate requests that convert.",
                img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Landscaping",
                headline: "Consistent weekly inquiries.",
                sub: "Keep the phone ringing beyond peak season.",
                img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Painting",
                headline: "Look pro online.",
                sub: "Photos + simple pages that drive estimates.",
                img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Cleaning",
                headline: "More recurring clients.",
                sub: "Simple booking flow + follow-ups that stick.",
                img: "https://images.unsplash.com/photo-1581579185169-1a29c5f2d4f6?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Restoration",
                headline: "High-intent emergencies.",
                sub: "Be visible when they need you now.",
                img: "https://images.unsplash.com/photo-1590725121839-892b458a74fe?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Fencing",
                headline: "Better projects, fewer tire-kickers.",
                sub: "Targeted leads + proof that builds trust.",
                img: "https://images.unsplash.com/photo-1600566753151-384129cf4e3f?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "General Contractors",
                headline: "A full pipeline, installed.",
                sub: "Visibility → calls → estimates → booked work.",
                img: "https://images.unsplash.com/photo-1504306662979-7f7e94b8c2f8?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Mold Remediation",
                headline: "Own the urgent fixes.",
                sub: "Be visible when water shows up fast.",
                img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Waterproofing",
                headline: "Protect the home, win the job.",
                sub: "High-intent leads + faster booking.",
                img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "Siding",
                headline: "Look sharp from the street.",
                sub: "Local visibility + proof that builds trust.",
                img: "https://images.unsplash.com/photo-1600566753151-384129cf4e3f?auto=format&fit=crop&w=1400&q=80",
            },
            {
                name: "And many more...",
                headline: "Full-service marketing, built for contractors.",
                sub: "Ads, websites, and social that looks premium and brings booked work.",
                img: "https://images.unsplash.com/photo-1504306662979-7f7e94b8c2f8?auto=format&fit=crop&w=1400&q=80",
            },
        ],
        []
    );

    const [activeTradeIdx, setActiveTradeIdx] = useState(0);
    const activeTrade = trades[activeTradeIdx];

    return (
        <section id="system" className="relative w-full bg-ollin-bg text-ollin-black py-20 md:py-28">
            <style>{`
        /* =========================
           OLLIN INLINE ARROW CTA (replica del “código ganador”)
           ========================= */
        .ollinArrowBtn {
          color: #6b6b6b;
          background: transparent;
          border: 0;
          padding: 0;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: color 280ms ease-out;

          /* defaults (override por botón con style={{...}}) */
          --arrowLenBase: 14px;     /* ✅ NUEVO: base, para que hover pueda sobreescribir --arrowLen */
          --arrowLenHover: 34px;
          --arrowLen: var(--arrowLenBase);
          --arrowOverlap: 7.5px;   /* ✅ el “valor ganador” */
          --arrowBoxW: 56px;       /* espacio reservado (>= hover) */
        }
        .ollinArrowBtn:hover {
          color: #111111;
          --arrowLen: var(--arrowLenHover);
        }

        /* ===== SHEEN (igual al ganador) ===== */
        .ollinArrowBtnText {
          position: relative;
          display: inline-block;
          line-height: 1;
        }
        .ollinArrowBtnText::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: transparent;
          background-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 248, 220, 0.92) 45%,
            transparent 62%
          );
          background-size: 220% 100%;
          background-position: 220% 0;
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0;
          pointer-events: none;
        }
        @keyframes ollinSheenOnceLR {
          0%   { background-position: 220% 0; opacity: 0; }
          12%  { opacity: 0.70; }
          88%  { opacity: 0.70; }
          100% { background-position: -220% 0; opacity: 0; }
        }
        .ollinArrowBtn:hover .ollinArrowBtnText::after {
          animation: ollinSheenOnceLR 720ms ease-out 1;
        }

        /* ===== FLECHA (igual lógica del ganador) ===== */
        .ollinArrowBtnArrow {
          position: relative;
          display: inline-block;
          width: var(--arrowBoxW);
          height: 12px;
          margin-left: 5px; /* 👈 un pelín más “14islands-ish” */
          pointer-events: none;
        }
        .ollinArrowBtnArrowLineSvg {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: var(--arrowLen);
          height: 12px;
          overflow: visible;
          transition: width 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: width;
        }
        .ollinArrowBtnArrowHeadSvg {
          position: absolute;
          left: 0;
          top: 50%;
          width: 13px;
          height: 12px;
          transform: translate3d(calc(var(--arrowLen) - var(--arrowOverlap)), -50%, 0);
          transition: transform 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .ollinArrowBtn { transition: none !important; }
          .ollinArrowBtnArrowLineSvg,
          .ollinArrowBtnArrowHeadSvg { transition: none !important; }
          .ollinArrowBtn:hover .ollinArrowBtnText::after { animation: none !important; }
        }
      `}</style>

            <div className="max-w-[1500px] mx-auto px-[5vw] w-full">
                {/* ===== TOP: Pipeline ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
                    {/* Left copy */}
                    <div>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.02] font-medium">
                            How jobs get booked.
                        </h3>
                        <p className="mt-4 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[520px]">
                            A clear system that turns demand into booked work.
                        </p>

                        {/* ✅ CTA actualizado al estilo ganador */}
                        <button
                            onClick={() => {
                                const el = document.getElementById("contact");
                                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className="mt-8 text-sm font-semibold tracking-tight ollinArrowBtn"
                            style={
                                {
                                    ["--arrowLenBase" as any]: "13px",   /* ✅ antes: --arrowLen (inline) */
                                    ["--arrowLenHover" as any]: "32px",
                                    ["--arrowBoxW" as any]: "54px",
                                    ["--arrowOverlap" as any]: "7.5px",
                                } as React.CSSProperties
                            }
                        >
                            <span className="ollinArrowBtnText" data-text="Get a quick breakdown">
                                Get a quick breakdown
                            </span>

                            <span className="ollinArrowBtnArrow" aria-hidden="true">
                                <svg className="ollinArrowBtnArrowLineSvg" viewBox="0 0 100 16" fill="none">
                                    <line
                                        x1="0"
                                        y1="8"
                                        x2="100"
                                        y2="8"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="butt"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </svg>

                                <svg
                                    className="ollinArrowBtnArrowHeadSvg"
                                    viewBox="0 0 18 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M0 3 L12 8 L0 13" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    {/* Right: steps list */}
                    <div className="relative">
                        {/* rail line */}
                        <div className="pointer-events-none absolute left-[14px] top-0 bottom-0 w-px bg-black/10" />

                        <div className="space-y-6">
                            {steps.map((s) => (
                                <div
                                    key={s.title}
                                    className={["group relative pl-10 pr-4 py-4", "transition-colors duration-200"].join(" ")}
                                >
                                    {/* Node (solid, sin transparencia; mantiene el look gris y el hover) */}
                                    <span
                                        className={[
                                            "absolute left-[9px] top-[26px]",
                                            "h-[10px] w-[10px] rounded-full",
                                            "bg-[#9D9B97]",
                                            "transition-colors duration-200",
                                            "group-hover:bg-[#61605D]",
                                        ].join(" ")}
                                    />

                                    <div className="relative">
                                        <div className="text-lg md:text-xl font-medium tracking-tight">{s.title}</div>
                                        <div className="mt-1 text-sm md:text-[15px] leading-snug text-ollin-black/65">{s.desc}</div>

                                        <div className="mt-2 text-xs md:text-sm text-ollin-black/55 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                                            {s.detail}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Separador “invisible” (mismo color del fondo) */}
                <div className="my-16 md:my-20 h-px w-full bg-ollin-bg" />

                {/* ===== BOTTOM: Trades ===== */}
                <div className="mt-14 md:mt-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
                    {/* Left list */}
                    <div>
                        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ollin-black/45">Built for your trade</div>
                        <p className="mt-3 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[520px]">
                            Same system. Different trade. Same goal: more calls and more booked jobs.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                            {trades.map((t, idx) => {
                                const active = idx === activeTradeIdx;
                                return (
                                    <button
                                        key={t.name}
                                        onMouseEnter={() => setActiveTradeIdx(idx)}
                                        onFocus={() => setActiveTradeIdx(idx)}
                                        className={[
                                            "text-left",
                                            "text-sm md:text-[15px]",
                                            "tracking-tight",
                                            "transition-colors duration-150",
                                            active ? "text-ollin-black" : "text-ollin-black/55 hover:text-ollin-black/80",
                                            "outline-none",
                                        ].join(" ")}
                                    >
                                        {t.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right preview panel */}
                    <div className="relative">
                        <div className="relative overflow-visible rounded-none bg-transparent">
                            {/* Image area: fondo crema para que la deformación revele #f2efe9, no blanco */}
                            <div className="relative z-0 h-[260px] sm:h-[300px] md:h-[340px] bg-ollin-bg overflow-visible">
                                <LiquidImage
                                    key={activeTrade.img}
                                    src={activeTrade.img}
                                    alt={activeTrade.name}
                                    className="absolute inset-0 h-full w-full"
                                    overscan={22}
                                />

                                {/* overlay sutil para que todo “case” con la paleta (usa crema, no blanco) */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background:
                                            "linear-gradient(to top, rgba(242,239,233,0.85), rgba(242,239,233,0.18), rgba(242,239,233,0.0))",
                                    }}
                                />
                            </div>

                            {/* Text panel: blanco (lo único “enmarcado” visible) */}
                            <div className="relative z-20 bg-white px-6 md:px-8 py-6 md:py-7">
                                <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ollin-black/45">{activeTrade.name}</div>
                                <div className="mt-2 text-2xl md:text-3xl font-medium tracking-tight leading-[1.05]">{activeTrade.headline}</div>
                                <div className="mt-2 text-sm md:text-base text-ollin-black/70 max-w-[560px]">{activeTrade.sub}</div>

                                {/* ✅ CTA actualizado al estilo ganador */}
                                <button
                                    onClick={() => {
                                        const el = document.getElementById("contact");
                                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }}
                                    className="mt-6 text-sm font-semibold tracking-tight ollinArrowBtn"
                                    style={
                                        {
                                            ["--arrowLenBase" as any]: "12px",   /* ✅ antes: --arrowLen (inline) */
                                            ["--arrowLenHover" as any]: "30px",
                                            ["--arrowBoxW" as any]: "52px",
                                            ["--arrowOverlap" as any]: "7.5px",
                                        } as React.CSSProperties
                                    }
                                >
                                    <span className="ollinArrowBtnText" data-text="Talk to us">
                                        Talk to us
                                    </span>

                                    <span className="ollinArrowBtnArrow" aria-hidden="true">
                                        <svg className="ollinArrowBtnArrowLineSvg" viewBox="0 0 100 16" fill="none">
                                            <line
                                                x1="0"
                                                y1="8"
                                                x2="100"
                                                y2="8"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                                strokeLinecap="butt"
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        </svg>

                                        <svg
                                            className="ollinArrowBtnArrowHeadSvg"
                                            viewBox="0 0 18 16"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M0 3 L12 8 L0 13" vectorEffect="non-scaling-stroke" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingSystemSection;
