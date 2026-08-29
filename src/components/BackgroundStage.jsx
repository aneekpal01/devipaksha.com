import React, { useEffect, useRef } from 'react';

export default function BackgroundStage({ isNight = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      buildTuniBulbs();
    };
    window.addEventListener('resize', handleResize);

    // 1. Floating particles: Shiuli & Kash (Day) / Golden Embers (Night)
    const particles = [];
    const particleCount = Math.min(36, Math.floor(width / 28));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3.5 + 2,
        speedX: Math.random() * 0.7 + 0.2,
        speedY: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.7 + 0.3,
        type: i % 3 === 0 ? 'shiuli' : i % 3 === 1 ? 'kash' : 'sparkle'
      });
    }

    // 2. Realistic Tuni Bulb (Fairy Lights) along the top sky & roofline ONLY (Zero middle clutter)
    let tuniBulbs = [];
    const bulbColors = [
      { main: '#ffd873', glow: 'rgba(255, 216, 115, 0.75)' }, // Warm Gold
      { main: '#ff3b30', glow: 'rgba(255, 59, 48, 0.75)' },   // Crimson Red
      { main: '#00e676', glow: 'rgba(0, 230, 118, 0.75)' },   // Festive Green
      { main: '#00d2ff', glow: 'rgba(0, 210, 255, 0.75)' },   // Electric Blue
      { main: '#ff9100', glow: 'rgba(255, 145, 0, 0.75)' },   // Amber
      { main: '#ff007f', glow: 'rgba(255, 0, 127, 0.75)' }    // Magenta
    ];

    const buildTuniBulbs = () => {
      tuniBulbs = [];
      const isDesktop = width >= 768;
      const curves = [];

      if (isDesktop) {
        // Desktop: Clean top street-crossing draped festoons only (Zero center obstruction)
        curves.push({
          x1: 0, y1: height * 0.03,
          cx: width * 0.5, cy: height * 0.07,
          x2: width, y2: height * 0.03,
          count: 36
        });

        curves.push({
          x1: width * 0.05, y1: height * 0.09,
          cx: width * 0.5, cy: height * 0.14,
          x2: width * 0.95, y2: height * 0.09,
          count: 32
        });
      } else {
        // Mobile: Clean top draped festoons only (Middle chain completely removed!)
        curves.push({
          x1: 0, y1: height * 0.03,
          cx: width * 0.5, cy: height * 0.07,
          x2: width, y2: height * 0.03,
          count: 22
        });

        curves.push({
          x1: 0, y1: height * 0.10,
          cx: width * 0.5, cy: height * 0.15,
          x2: width, y2: height * 0.10,
          count: 22
        });
      }

      let bulbId = 0;
      curves.forEach((c) => {
        for (let i = 0; i <= c.count; i++) {
          const t = i / c.count;
          const x = (1 - t) * (1 - t) * c.x1 + 2 * (1 - t) * t * c.cx + t * t * c.x2;
          const y = (1 - t) * (1 - t) * c.y1 + 2 * (1 - t) * t * c.cy + t * t * c.y2;

          const color = bulbColors[bulbId % bulbColors.length];
          tuniBulbs.push({
            x,
            y,
            color: color.main,
            glow: color.glow,
            size: isDesktop ? 3 : 2.4,
            speed: 0.003 + (bulbId % 4) * 0.001,
            phase: (bulbId * 0.5) % (Math.PI * 2)
          });
          bulbId++;
        }
      });
    };

    buildTuniBulbs();

    const drawShiuli = (x, y, radius, rotation, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;

      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const angle = (i * Math.PI * 2) / 5;
        const px = Math.cos(angle) * (radius * 1.5);
        const py = Math.sin(angle) * (radius * 1.5);
        ctx.ellipse(px, py, radius * 0.7, radius * 0.4, angle, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ff6b1a';
      ctx.fill();
      ctx.restore();
    };

    const drawKash = (x, y, radius, rotation, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity * 0.85;

      const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, radius * 2.5);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.5, 'rgba(245, 240, 230, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 2.2, radius * 0.9, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (x, y, radius, opacity) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = isNight ? '#ffd873' : '#fff3d1';
      ctx.shadowColor = '#ffd873';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawTuniBulb = (bulb, time) => {
      const pulse = 0.5 + 0.5 * Math.sin(time * bulb.speed + bulb.phase);
      const alpha = Math.max(0.3, pulse);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Soft light halo
      const glowGrad = ctx.createRadialGradient(bulb.x, bulb.y, 1, bulb.x, bulb.y, bulb.size * 3.2);
      glowGrad.addColorStop(0, bulb.glow);
      glowGrad.addColorStop(0.6, bulb.glow.replace('0.75', '0.2'));
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(bulb.x, bulb.y, bulb.size * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Bright white hot center
      ctx.shadowColor = bulb.color;
      ctx.shadowBlur = 8 * pulse;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bulb.x, bulb.y, bulb.size * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Colored glass shell
      ctx.fillStyle = bulb.color;
      ctx.beginPath();
      ctx.arc(bulb.x, bulb.y, bulb.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    let startTime = Date.now();

    const render = () => {
      const time = Date.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      // In Night Mode: Draw clean top strings of glowing, twinkling Tuni Bulbs
      if (isNight) {
        tuniBulbs.forEach((bulb) => {
          drawTuniBulb(bulb, time);
        });
      }

      // Floating Petals (Day) & Night Embers
      particles.forEach((p) => {
        if (isNight) {
          p.x += Math.sin(time * 0.001 + p.rotation) * 0.5;
          p.y -= p.speedY * 0.6;

          if (p.y < -20) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          drawSparkle(p.x, p.y, p.radius, p.opacity);
        } else {
          p.x += p.speedX;
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) {
            p.x = -20;
            p.y = Math.random() * height;
          }

          if (p.type === 'shiuli') {
            drawShiuli(p.x, p.y, p.radius, p.rotation, p.opacity);
          } else if (p.type === 'kash') {
            drawKash(p.x, p.y, p.radius, p.rotation, p.opacity);
          } else {
            drawSparkle(p.x, p.y, p.radius, p.opacity);
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isNight]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050201]">
      {/* 1. PC / Desktop Panoramic Background */}
      <div className="hidden md:block absolute inset-0 w-full h-full">
        {/* Day Background */}
        <img
          src="/assets/pandal-pc-day.jpg"
          alt="Durga Puja Pandal Panoramic PC View"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            isNight ? 'opacity-0 scale-100' : 'opacity-95 scale-101'
          } filter brightness-95 contrast-105 saturate-105`}
        />

        {/* Clean, Crisp Night Pandal View (Without any artificial yellow fog blobs) */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            isNight ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src="/assets/pandal-pc-day.jpg"
            alt="Durga Puja Pandal Night View"
            className="w-full h-full object-cover object-center filter brightness-65 contrast-125 saturate-115"
          />

          {/* Deep Natural Midnight Sky Gradient at the top */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020514]/85 via-[#070302]/30 to-[#020101]/80 mix-blend-multiply" />
        </div>
      </div>

      {/* 2. Mobile Background */}
      <div className="block md:hidden absolute inset-0 w-full h-full">
        <img
          src="/assets/pandal-day.jpg"
          alt="Durga Puja Pandal Daytime Mobile"
          className={`absolute inset-0 w-full h-full object-cover object-[center_35%] transition-opacity duration-1000 ease-in-out ${
            isNight ? 'opacity-0 scale-100' : 'opacity-90 scale-102'
          } filter brightness-95 contrast-105 saturate-95`}
        />

        <img
          src="/assets/pandal-night.jpg"
          alt="Durga Puja Pandal Nighttime Mobile"
          className={`absolute inset-0 w-full h-full object-cover object-[center_35%] transition-opacity duration-1000 ease-in-out ${
            isNight ? 'opacity-95 scale-102' : 'opacity-0 scale-100'
          } filter brightness-105 contrast-110 saturate-105`}
        />
      </div>

      {/* Atmospheric Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070302]/45 via-transparent to-[#070302]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(0,0,0,0.45)_85%,_rgba(0,0,0,0.85)_100%)]" />

      {/* 3. Canvas Layer: Floating Kash/Shiuli (Day) OR Clean Top Tuni Bulbs & Aarti Sparks (Night) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full pointer-events-none" />

      {/* Vintage film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
        }}
      />
    </div>
  );
}
