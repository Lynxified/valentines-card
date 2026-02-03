import { useEffect, useRef, useState } from 'react';

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'circle' | 'heart';
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  exploded: boolean;
  particles: FireworkParticle[];
  trail: { x: number; y: number }[];
}

export function FireworksEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const animationRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const colors = ['#e63946', '#ff6b7a', '#ffb3c1', '#ffd700', '#ff8fa3', '#c1121f'];

    const createFirework = (x: number, y: number): Firework => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x,
        y: dimensions.height || window.innerHeight,
        targetY: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 8 - 12,
        color,
        exploded: false,
        particles: [],
        trail: []
      };
    };

    const createExplosion = (firework: Firework) => {
      const particleCount = 40 + Math.random() * 30;
      const shapes: ('circle' | 'heart')[] = ['circle', 'circle', 'heart', 'circle'];
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const velocity = Math.random() * 6 + 2;
        const type = shapes[Math.floor(Math.random() * shapes.length)];
        
        firework.particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          maxLife: 1,
          color: firework.color,
          size: Math.random() * 4 + 2,
          type
        });
      }
    };

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
      ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.fill();
    };

    // Launch initial fireworks
    const launchFireworks = () => {
      const width = dimensions.width || window.innerWidth;
      const height = dimensions.height || window.innerHeight;
      
      // Launch multiple fireworks
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const x = Math.random() * width * 0.8 + width * 0.1;
          const y = Math.random() * height * 0.4 + height * 0.1;
          fireworksRef.current.push(createFirework(x, y));
        }, i * 300);
      }
    };

    launchFireworks();

    // Continue launching fireworks
    const launchInterval = setInterval(() => {
      if (fireworksRef.current.length < 8) {
        const width = dimensions.width || window.innerWidth;
        const height = dimensions.height || window.innerHeight;
        const x = Math.random() * width * 0.8 + width * 0.1;
        const y = Math.random() * height * 0.4 + height * 0.1;
        fireworksRef.current.push(createFirework(x, y));
      }
    }, 400);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworksRef.current = fireworksRef.current.filter(firework => {
        if (!firework.exploded) {
          // Update firework position
          firework.x += firework.vx;
          firework.y += firework.vy;
          firework.vy += 0.3; // Gravity

          // Add trail
          firework.trail.push({ x: firework.x, y: firework.y });
          if (firework.trail.length > 10) firework.trail.shift();

          // Draw trail
          ctx.strokeStyle = firework.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          firework.trail.forEach((point, i) => {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();

          // Draw firework
          ctx.fillStyle = firework.color;
          ctx.beginPath();
          ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
          ctx.fill();

          // Check if reached target or starting to fall
          if (firework.vy > 0 || firework.y <= firework.targetY) {
            firework.exploded = true;
            createExplosion(firework);
          }

          return true;
        } else {
          // Update and draw particles
          firework.particles = firework.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.15; // Gravity
            particle.vx *= 0.98; // Air resistance
            particle.life -= 0.015;

            if (particle.life <= 0) return false;

            ctx.globalAlpha = particle.life;
            
            if (particle.type === 'heart') {
              drawHeart(ctx, particle.x, particle.y, particle.size, particle.color);
            } else {
              ctx.fillStyle = particle.color;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
            }
            
            ctx.globalAlpha = 1;

            return true;
          });

          return firework.particles.length > 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearInterval(launchInterval);
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-20 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
