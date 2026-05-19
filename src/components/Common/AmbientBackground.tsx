import { MicrophoneIcon } from "@heroicons/react/24/outline";
import type { CSSProperties } from "react";
import { memo, useEffect, useRef, useState } from "react";
import cn from "@/helpers/cn";

interface Tint {
  name: string;
  r: number;
  g: number;
  b: number;
}

const TINTS: Record<string, Tint> = {
  default: { b: 93, g: 58, name: "default", r: 251 },
  group: { b: 247, g: 85, name: "group", r: 168 },
  profile: { b: 246, g: 130, name: "profile", r: 59 },
  tweet: { b: 94, g: 197, name: "tweet", r: 34 }
};

const tintFromHref = (href: string): Tint => {
  if (href.startsWith("/posts/")) return TINTS.tweet;
  if (href.startsWith("/account/") || href.startsWith("/u/")) {
    return TINTS.profile;
  }
  if (href.startsWith("/g/")) return TINTS.group;
  return TINTS.default;
};

const AmbientBackground = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const burstLayerRef = useRef<HTMLDivElement | null>(null);
  const [audioOn, setAudioOn] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const spot = spotlightRef.current;
    const burstLayer = burstLayerRef.current;
    if (!root || !spot || !burstLayer) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const disablePointerFx = reduced || coarse;

    let scrollRaf: number | null = null;
    const onScroll = () => {
      if (scrollRaf !== null) return;
      scrollRaf = requestAnimationFrame(() => {
        root.style.setProperty("--scroll-y", `${window.scrollY}px`);
        scrollRaf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let curX = targetX;
    let curY = targetY;
    let targetTint: Tint = TINTS.default;
    let curR = TINTS.default.r;
    let curG = TINTS.default.g;
    let curB = TINTS.default.b;
    let active = false;
    let tickRaf = 0;

    const tick = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      curR += (targetTint.r - curR) * 0.1;
      curG += (targetTint.g - curG) * 0.1;
      curB += (targetTint.b - curB) * 0.1;
      spot.style.setProperty("--mx", `${curX}px`);
      spot.style.setProperty("--my", `${curY}px`);
      root.style.setProperty("--spot-r", curR.toFixed(0));
      root.style.setProperty("--spot-g", curG.toFixed(0));
      root.style.setProperty("--spot-b", curB.toFixed(0));
      const movingPos =
        Math.abs(targetX - curX) > 0.5 || Math.abs(targetY - curY) > 0.5;
      const movingColor =
        Math.abs(targetTint.r - curR) > 0.5 ||
        Math.abs(targetTint.g - curG) > 0.5 ||
        Math.abs(targetTint.b - curB) > 0.5;
      if (active || movingPos || movingColor) {
        tickRaf = requestAnimationFrame(tick);
      }
    };

    const startTicking = () => {
      if (!tickRaf) {
        tickRaf = requestAnimationFrame(tick);
      }
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!active) {
        active = true;
        spot.style.opacity = "1";
      }
      startTicking();
    };

    const onLeave = () => {
      active = false;
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      const next = link
        ? tintFromHref(link.getAttribute("href") || "")
        : TINTS.default;
      if (next.name !== targetTint.name) {
        targetTint = next;
        startTicking();
      }
    };

    if (!disablePointerFx) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerover", onPointerOver, { passive: true });
    } else {
      spot.style.opacity = "0";
    }

    const onLike = (event: Event) => {
      const detail = (event as CustomEvent<{ x: number; y: number }>).detail;
      const x = detail?.x ?? window.innerWidth / 2;
      const y = detail?.y ?? window.innerHeight / 2;
      const burst = document.createElement("div");
      burst.className = "ambient-burst";
      burst.style.left = `${x}px`;
      burst.style.top = `${y}px`;
      burstLayer.appendChild(burst);
      window.setTimeout(() => burst.remove(), 1800);
    };
    window.addEventListener("hey:like", onLike);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("hey:like", onLike);
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
      cancelAnimationFrame(tickRaf);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!audioOn) {
      root.style.setProperty("--audio", "0");
      return;
    }

    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    let ctx: AudioContext | null = null;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const AudioCtor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ctx = new AudioCtor();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        const buffer = new Uint8Array(analyser.frequencyBinCount);
        let smoothed = 0;
        const tick = () => {
          if (cancelled) return;
          analyser.getByteFrequencyData(buffer);
          let sum = 0;
          const bins = Math.min(40, buffer.length);
          for (let i = 0; i < bins; i++) sum += buffer[i];
          const avg = sum / bins / 255;
          smoothed = smoothed * 0.85 + avg * 0.15;
          root.style.setProperty("--audio", smoothed.toFixed(3));
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        setAudioError(true);
        setAudioOn(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((track) => track.stop());
      ctx?.close().catch(() => {});
      root.style.setProperty("--audio", "0");
    };
  }, [audioOn]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        ref={rootRef}
        style={
          {
            "--spot-b": TINTS.default.b,
            "--spot-g": TINTS.default.g,
            "--spot-r": TINTS.default.r
          } as CSSProperties
        }
      >
        <div className="ambient-aurora" />
        <div className="ambient-hero-glow" />
        <div className="ambient-parallax-slow">
          <div className="ambient-orb ambient-orb-1" />
        </div>
        <div className="ambient-parallax-fast">
          <div className="ambient-orb ambient-orb-2" />
        </div>
        <div className="ambient-parallax-mid">
          <div className="ambient-orb ambient-orb-3" />
        </div>
        <div className="ambient-spotlight" ref={spotlightRef} />
        <div className="ambient-burst-layer" ref={burstLayerRef} />
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
      <button
        aria-label={
          audioOn ? "Disable audio-reactive mode" : "Enable audio-reactive mode"
        }
        className={cn("ambient-audio-toggle", { on: audioOn })}
        onClick={() => {
          setAudioError(false);
          setAudioOn((value) => !value);
        }}
        title={
          audioError
            ? "Microphone access denied"
            : audioOn
              ? "Audio-reactive: on"
              : "Audio-reactive: off"
        }
        type="button"
      >
        <MicrophoneIcon className="size-4" />
      </button>
    </>
  );
};

export default memo(AmbientBackground);
