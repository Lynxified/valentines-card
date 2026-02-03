import { useState, useEffect, useRef } from 'react';
import type { CardData } from '../App';
import { Heart, Sparkles, RotateCcw, Home } from 'lucide-react';

interface MessageRevealSectionProps {
  card: CardData;
  onReset: () => void;
  onRestart: () => void;
}

export function MessageRevealSection({ card, onReset, onRestart }: MessageRevealSectionProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [orbitingHearts, setOrbitingHearts] = useState<{ id: number; radius: number; duration: number; delay: number }[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0;
    const text = card.message;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setShowCursor(false);
        setTimeout(() => setShowButtons(true), 500);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [card.message]);

  // Generate orbiting hearts
  useEffect(() => {
    const hearts = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      radius: 150 + i * 25,
      duration: 8 + i * 2,
      delay: i * 0.5
    }));
    setOrbitingHearts(hearts);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative">
      {/* Orbiting Hearts Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {orbitingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute"
            style={{
              animation: `orbit ${heart.duration}s linear infinite`,
              animationDelay: `${heart.delay}s`,
              ['--radius' as string]: `${heart.radius}px`
            }}
          >
            <Heart 
              className="w-4 h-4 text-valentine-pink fill-valentine-pink opacity-40"
              style={{ transform: `scale(${0.6 + heart.id * 0.1})` }}
            />
          </div>
        ))}
      </div>

      {/* Card Display */}
      <div 
        className="relative mb-8 animate-float"
        style={{ animationDuration: '3s' }}
      >
        {/* Card Glow */}
        <div 
          className="absolute inset-0 rounded-2xl animate-pulse-glow"
          style={{
            transform: 'scale(1.1)',
            filter: 'blur(20px)',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)'
          }}
        />
        
        {/* The Card */}
        <div 
          className="relative w-56 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.3)'
          }}
        >
          <img 
            src={card.image} 
            alt={card.name}
            className="w-full h-full object-cover"
          />
          
          {/* Card Overlay Shine */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
            }}
          />
        </div>
        
        {/* Sparkle Decorations */}
        <div className="absolute -top-4 -right-4">
          <Sparkles className="w-8 h-8 text-valentine-gold animate-sparkle" />
        </div>
        <div className="absolute -bottom-3 -left-3">
          <Sparkles className="w-6 h-6 text-valentine-gold animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute top-1/2 -right-6">
          <Sparkles className="w-5 h-5 text-valentine-gold animate-sparkle" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Card Name */}
      <h3 className="font-display text-3xl md:text-4xl text-valentine-purple mb-6">
        {card.name}
      </h3>

      {/* Message Display */}
      <div 
        ref={messageRef}
        className="max-w-xl text-center mb-10 px-6"
      >
        <p className="font-display text-xl md:text-2xl text-valentine-purple leading-relaxed">
          {displayedText}
          {showCursor && (
            <span className="inline-block w-0.5 h-6 bg-valentine-red ml-1 animate-pulse" />
          )}
        </p>
      </div>

      {/* Action Buttons */}
      <div 
        className="flex gap-4 transition-all duration-500"
        style={{
          opacity: showButtons ? 1 : 0,
          transform: showButtons ? 'translateY(0)' : 'translateY(20px)'
        }}
      >
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-valentine-red text-white rounded-full font-body font-medium hover:bg-valentine-dark-red transition-colors duration-300 hover:shadow-lg hover:shadow-valentine-red/30"
        >
          <RotateCcw className="w-5 h-5" />
          Choose Another Card
        </button>
        
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-white text-valentine-red border-2 border-valentine-red rounded-full font-body font-medium hover:bg-valentine-light-pink transition-colors duration-300"
        >
          <Home className="w-5 h-5" />
          Back to Envelope
        </button>
      </div>

      {/* Bottom Decorative Message */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center transition-all duration-700"
        style={{
          opacity: showButtons ? 1 : 0,
          transitionDelay: '0.3s'
        }}
      >
        <p className="font-display text-lg text-valentine-purple/60">
          Every day with you is Valentine's Day
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Heart className="w-4 h-4 text-valentine-red fill-valentine-red animate-heartbeat" />
          <span className="font-display text-valentine-red">Forever Yours</span>
          <Heart className="w-4 h-4 text-valentine-red fill-valentine-red animate-heartbeat" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>

      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-valentine-pink fill-valentine-pink opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${15 + Math.random() * 20}px`,
              height: `${15 + Math.random() * 20}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg); }
          to { transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
