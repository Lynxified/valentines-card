import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'sparkle';
  color: string;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const colors = ['#e63946', '#ff6b7a', '#ffb3c1', '#ffd700', '#fff5cc'];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 15 + 5,
        speedY: -Math.random() * 0.5 - 0.2,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: Math.random() > 0.6 ? 'heart' : 'sparkle',
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const drawHeart = (x: number, y: number, size: number, color: string, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.globalAlpha = particlesRef.current.find(p => p.x === x && p.y === y)?.opacity || 0.5;
      
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.fill();
      
      ctx.restore();
    };

    const drawSparkle = (x: number, y: number, size: number, color: string, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.globalAlpha = particlesRef.current.find(p => p.x === x && p.y === y)?.opacity || 0.5;
      
      // Draw 4-point star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        ctx.lineTo(Math.cos(angle + Math.PI / 4) * size * 0.3, Math.sin(angle + Math.PI / 4) * size * 0.3);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.y += particle.speedY;
        particle.x += particle.speedX + Math.sin(Date.now() * 0.001 + index) * 0.3;
        particle.rotation += particle.rotationSpeed;

        // Pulse opacity
        particle.opacity = 0.3 + Math.sin(Date.now() * 0.002 + index) * 0.2;

        // Reset if off screen
        if (particle.y < -50) {
          particle.y = canvas.height + 50;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle
        if (particle.type === 'heart') {
          drawHeart(particle.x, particle.y, particle.size, particle.color, particle.rotation);
        } else {
          drawSparkle(particle.x, particle.y, particle.size * 0.6, particle.color, particle.rotation);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
