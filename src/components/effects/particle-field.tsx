"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * A constellation of drifting points behind the hero. Nearby points link up
 * with faint lines, and the cursor pulls the field toward it and lights the
 * lines around it in brass. Pauses off screen and in background tabs, caps the
 * pixel ratio at 2 and scales the particle count with the area.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const color = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;
    let accent = color("--accent", "#c8a26b");
    let ink = color("--muted", "#a39b8f");

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const LINK = 130;
    const REACH = 190;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(140, Math.round((width * height) / 11000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    let frame = 0;
    let running = false;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH && d > 1) {
            const pull = (1 - d / REACH) * 0.06;
            p.vx += (dx / d) * pull;
            p.vy += (dy / d) * pull;
          }
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        // Keep a little drift so the field never freezes.
        if (Math.abs(p.vx) + Math.abs(p.vy) < 0.12) {
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]!;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK) continue;
          const near =
            pointer.active &&
            Math.hypot((a.x + b.x) / 2 - pointer.x, (a.y + b.y) / 2 - pointer.y) < REACH;
          ctx.globalAlpha = (1 - d / LINK) * (near ? 0.75 : 0.16);
          ctx.strokeStyle = near ? accent : ink;
          ctx.lineWidth = near ? 1 : 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const p of particles) {
        const near = pointer.active && Math.hypot(p.x - pointer.x, p.y - pointer.y) < REACH;
        ctx.globalAlpha = near ? 0.95 : 0.45;
        ctx.fillStyle = near ? accent : ink;
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? p.r + 0.8 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const themeObserver = new MutationObserver(() => {
      const s = getComputedStyle(document.documentElement);
      accent = s.getPropertyValue("--accent").trim() || accent;
      ink = s.getPropertyValue("--muted").trim() || ink;
    });
    themeObserver.observe(document.documentElement, { attributeFilter: ["data-theme"] });

    const visibility = new IntersectionObserver(([entry]) =>
      entry?.isIntersecting ? start() : stop(),
    );
    const sizeObserver = new ResizeObserver(resize);

    resize();
    sizeObserver.observe(host);
    visibility.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      sizeObserver.disconnect();
      visibility.disconnect();
      themeObserver.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="particle-field pointer-events-none absolute inset-0"
    />
  );
}
