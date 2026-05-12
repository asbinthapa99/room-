"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ─── Stick figure canvas ─── */
interface Character {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  size: number;
  color: string;
}

function drawStickFigure(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = "round";
  // head
  ctx.beginPath();
  ctx.arc(0, -size * 0.4, size * 0.15, 0, Math.PI * 2);
  ctx.stroke();
  // body
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.25);
  ctx.lineTo(0, size * 0.1);
  ctx.stroke();
  // arms
  ctx.beginPath();
  ctx.moveTo(-size * 0.25, -size * 0.05);
  ctx.lineTo(size * 0.25, -size * 0.05);
  ctx.stroke();
  // legs
  ctx.beginPath();
  ctx.moveTo(0, size * 0.1);
  ctx.lineTo(-size * 0.2, size * 0.4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, size * 0.1);
  ctx.lineTo(size * 0.2, size * 0.4);
  ctx.stroke();
  ctx.restore();
}

function CharactersAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const charsRef = useRef<Character[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#e11d48", "#fb7185", "#be123c", "#1f2937", "#9ca3af"];
    charsRef.current = Array.from({ length: 8 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 4,
      size: 30 + Math.random() * 30,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      charsRef.current.forEach((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotSpeed;
        if (c.x < -60) c.x = canvas.width + 60;
        if (c.x > canvas.width + 60) c.x = -60;
        if (c.y < -60) c.y = canvas.height + 60;
        if (c.y > canvas.height + 60) c.y = -60;
        drawStickFigure(ctx, c.x, c.y, c.size, c.rotation, c.color);
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-[0.08]" />;
}

/* ─── Expanding circle rings ─── */
function CircleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rings = Array.from({ length: 5 }, (_, i) => ({
      r: i * 100,
      alpha: 0.2 - i * 0.03,
      speed: 0.5 + i * 0.15,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxR = Math.hypot(cx, cy) + 50;

      rings.forEach((ring) => {
        ring.r += ring.speed;
        if (ring.r > maxR) {
          ring.r = 0;
          ring.alpha = 0.2;
        }
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(225, 29, 72, ${Math.max(0, ring.alpha - (ring.r / maxR) * 0.2)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />;
}

/* ─── Message ─── */
function MessageDisplay() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative z-10 flex flex-col items-center justify-center text-center px-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      <p className="text-[7rem] md:text-[10rem] font-black text-gray-900 tracking-tighter leading-none select-none">
        404
      </p>
      <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-800">Page not found</h1>
      <p className="mt-3 text-gray-500 max-w-sm leading-relaxed text-sm md:text-base">
        Looks like this room has already been taken — or the link is broken.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-2xl border-2 border-gray-900 bg-white text-gray-900 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          ← Go Back
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      <CircleAnimation />
      <CharactersAnimation />
      <MessageDisplay />
    </div>
  );
}
