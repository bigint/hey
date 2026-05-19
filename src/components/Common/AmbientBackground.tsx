import { memo, useEffect, useRef } from "react";

const AmbientBackground = () => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = spotlightRef.current;
    if (!node) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) {
      node.style.opacity = "0";
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;
    let active = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      node.style.setProperty("--mx", `${currentX}px`);
      node.style.setProperty("--my", `${currentY}px`);
      if (
        active ||
        Math.abs(targetX - currentX) > 0.5 ||
        Math.abs(targetY - currentY) > 0.5
      ) {
        raf = requestAnimationFrame(tick);
      }
    };

    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!active) {
        active = true;
        node.style.opacity = "1";
        raf = requestAnimationFrame(tick);
      }
    };

    const handleLeave = () => {
      active = false;
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="ambient-aurora" />
      <div className="ambient-hero-glow" />
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <div className="ambient-spotlight" ref={spotlightRef} />
      <svg
        className="ambient-noise-svg"
        height="100%"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="ambient-noise-filter">
          <feTurbulence
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
            type="fractalNoise"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect filter="url(#ambient-noise-filter)" height="100%" width="100%" />
      </svg>
    </div>
  );
};

export default memo(AmbientBackground);
