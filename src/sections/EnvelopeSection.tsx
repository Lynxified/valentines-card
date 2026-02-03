import { useState, useRef } from 'react';
import { Heart } from 'lucide-react';

interface EnvelopeSectionProps {
  onOpen: () => void;
}

export function EnvelopeSection({ onOpen }: EnvelopeSectionProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const envelopeRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isOpening) return;
    
    setIsOpening(true);
    
    // Show letter emerging
    setTimeout(() => {
      setShowLetter(true);
    }, 500);
    
    // Trigger the transition
    setTimeout(() => {
      onOpen();
    }, 1800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Title */}
      <h1 className="font-display text-5xl md:text-7xl text-valentine-red mb-12 text-center animate-float">
        A Special Message
      </h1>
      
      {/* Envelope Container */}
      <div 
  className="envelope-container relative cursor-pointer"
  onClick={handleClick}
  ref={envelopeRef}
      >
        <div 
          className={`envelope relative w-72 h-48 md:w-96 md:h-56 ${isOpening ? 'opening' : ''}`}
          style={{
            transform: isOpening ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.8s var(--ease-dramatic)'
          }}
        >
          {/* Envelope Body */}
          <div 
    className={`envelope relative w-72 h-48 md:w-96 md:h-56 ${isOpening ? 'opening' : ''}`}
    style={{
      transform: isOpening ? 'scale(1.1)' : 'scale(1)',
      transition: 'transform 0.8s var(--ease-dramatic)'
    }}
          >
            {/* Envelope Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-valentine-red" />
              <div className="absolute top-8 right-8 w-1.5 h-1.5 rounded-full bg-valentine-red" />
              <div className="absolute bottom-6 left-10 w-1 h-1 rounded-full bg-valentine-red" />
              <div className="absolute top-12 left-16 w-1 h-1 rounded-full bg-valentine-gold" />
              <div className="absolute bottom-10 right-12 w-1.5 h-1.5 rounded-full bg-valentine-gold" />
            </div>
          </div>
          
          {/* Letter (hidden initially, emerges when opening) */}
          <div 
        className="absolute left-1/2 top-1/4 -translate-x-1/2 w-64 md:w-80 rounded shadow-lg flex flex-col items-center justify-center z-30"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #fff5f7 100%)',
          opacity: showLetter ? 1 : 0,
          transform: showLetter ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
          transition: 'all 0.7s var(--ease-romantic)'
        }}
          >
            {/* Letter Content */}
        <div className="p-6 flex flex-col items-center justify-center">
          <Heart className="w-8 h-8 text-valentine-red mb-3 animate-heartbeat" />
          <p className="font-display text-2xl text-valentine-red text-center">
            Open Your Heart
              </p>
            </div>
          </div>
          
          {/* Envelope Flap */}
          <div 
      className="envelope-flap absolute top-0 left-0 right-0 h-1/2 overflow-hidden z-20"
      style={{
        transformOrigin: 'top center',
        transform: isOpening ? 'rotateX(-180deg)' : 'rotateX(0deg)',
        transition: 'transform 1s var(--ease-romantic)',
      }}
          >
            <div 
        className="absolute top-0 left-0 right-0 h-full"
        style={{
          background: 'linear-gradient(145deg, #ffccd5 0%, #ffb3c1 50%, #ffccd5 100%)',
          clipPath: 'polygon(0 0, 50% 100%, 100% 0)'
        }}
            />
          </div>
          
          {/* Bottom Flaps */}
          <div 
            className="absolute bottom-0 left-0 w-1/2 h-1/2"
            style={{
              background: 'linear-gradient(145deg, #ffe4e9 0%, #ffccd5 100%)',
              clipPath: 'polygon(0 0, 100% 100%, 0 100%)'
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-1/2 h-1/2"
            style={{
              background: 'linear-gradient(145deg, #ffe4e9 0%, #ffccd5 100%)',
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
            }}
          />
          
          {/* Wax Seal */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              transform: `translate(-50%, -50%) scale(${isOpening ? 0 : 1})`,
              transition: 'transform 0.4s var(--ease-elastic)'
            }}
          >
            <div 
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center animate-pulse-glow"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #e63946 0%, #c1121f 50%, #9d0f1a 100%)',
                boxShadow: '0 4px 15px rgba(193, 18, 31, 0.5), inset 0 2px 5px rgba(255, 255, 255, 0.3)'
              }}
            >
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
            </div>
          </div>
          
          {/* Seal Break Particles */}
          {isOpening && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full z-30"
                  style={{
                    background: i % 2 === 0 ? '#c1121f' : '#e63946',
                    animation: `fireworks-burst 0.8s ease-out forwards`,
                    animationDelay: `${i * 50}ms`,
                    ['--tx' as string]: `${Math.cos(i * Math.PI / 4) * 80}px`,
                    ['--ty' as string]: `${Math.sin(i * Math.PI / 4) * 80}px`,
                  }}
                />
              ))}
            </>
          )}
        </div>
        
        {/* Click Hint */}
        {!isOpening && (
          <div 
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
            style={{
              animation: 'float 2s ease-in-out infinite'
            }}
          >
            <p className="font-display text-xl text-valentine-red/70">
              Click to Open
            </p>
            <div className="mt-2 flex justify-center">
              <Heart className="w-5 h-5 text-valentine-red/50 animate-heartbeat" />
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>
        <Heart className="w-8 h-8 text-valentine-pink fill-valentine-pink" />
      </div>
      <div className="fixed top-32 right-16 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <Heart className="w-6 h-6 text-valentine-pink fill-valentine-pink" />
      </div>
      <div className="fixed bottom-32 left-20 opacity-25 animate-float" style={{ animationDelay: '1.5s' }}>
        <Heart className="w-10 h-10 text-valentine-pink fill-valentine-pink" />
      </div>
      <div className="fixed bottom-20 right-24 opacity-20 animate-float" style={{ animationDelay: '0.8s' }}>
        <Heart className="w-7 h-7 text-valentine-pink fill-valentine-pink" />
      </div>
    </div>
  );
}
