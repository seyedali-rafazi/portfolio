"use client";

import React, { useEffect, useRef } from "react";

export const GlobeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = (canvas.offsetWidth || 220) * 2);
    let height = (canvas.height = (canvas.offsetHeight || 220) * 2);

    const dots: { x: number; y: number; z: number }[] = [];
    const numDots = 420;
    const radius = Math.min(width, height) * 0.38;

    // Generate sphere points using Fibonacci sphere algorithm
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numDots; i++) {
      const y = 1 - (i / (numDots - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      dots.push({ x: x * radius, y: y * radius, z: z * radius });
    }

    let rotationY = 0;
    const rotationX = 0.2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      rotationY += 0.006;

      // Draw subtle glowing background circle
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.15
      );
      gradient.addColorStop(0, "rgba(22, 131, 255, 0.12)");
      gradient.addColorStop(0.6, "rgba(22, 131, 255, 0.04)");
      gradient.addColorStop(1, "rgba(22, 131, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Sort dots by Z depth for realistic rendering
      const projected = dots.map((dot) => {
        // Rotate around Y
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const x1 = dot.x * cosY - dot.z * sinY;
        const z1 = dot.z * cosY + dot.x * sinY;

        // Rotate slightly around X
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const y2 = dot.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + dot.y * sinX;

        return { x: x1 + centerX, y: y2 + centerY, z: z2 };
      });

      projected.sort((a, b) => a.z - b.z);

      // Render dots
      projected.forEach((p) => {
        const normalizedZ = (p.z + radius) / (2 * radius); // 0 to 1
        const alpha = Math.max(0.08, Math.min(0.9, normalizedZ * 0.95));
        const size = Math.max(1, normalizedZ * 2.8);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

        if (normalizedZ > 0.65) {
          ctx.fillStyle = `rgba(140, 195, 255, ${alpha})`;
          ctx.shadowColor = "rgba(22, 131, 255, 0.8)";
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = `rgba(80, 120, 180, ${alpha * 0.5})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = (canvas.offsetWidth || 220) * 2;
      height = canvas.height = (canvas.offsetHeight || 220) * 2;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[240px] h-[220px] flex items-center justify-center mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
};
