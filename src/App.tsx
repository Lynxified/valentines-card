import { useState, useEffect, useCallback } from 'react';
import { EnvelopeSection } from './sections/EnvelopeSection';
import { CardRevealSection } from './sections/CardRevealSection';
import { MessageRevealSection } from './sections/MessageRevealSection';
import { ParticleBackground } from './components/ParticleBackground';
import { FireworksEffect } from './components/FireworksEffect';

export type GameState = 'envelope' | 'fireworks' | 'cards' | 'message';
export interface CardData {
  id: number;
  name: string;
  image: string;
  message: string;
}

export const cards: CardData[] = [
  {
    id: 1,
    name: 'The Rose',
    image: '/images/card-rose.png',
    message: 'Like a rose, I learned too late that care matters more than intent. I’m still learning how to grow without hurting what I love.'
  },
  {
    id: 2,
    name: 'The Moon',
    image: '/images/card-moon.png',
    message: 'Some nights I was only half-present. Now I’m learning to be my own light, not borrow yours when it’s convenient.'
  },
  {
    id: 3,
    name: 'The Heart',
    image: '/images/card-heart.png',
    message: 'I once gave the bare minimum and called it effort. This heart is learning accountability, not excuses.'
  },
  {
    id: 4,
    name: 'The Dove',
    image: '/images/card-dove.png',
    message: 'Loving you also meant knowing when to step back. Peace sometimes looks like distance, not holding on.'
  },
  {
    id: 5,
    name: 'The Ring',
    image: '/images/card-ring.png',
    message: 'Not a promise of forever—just proof that I’m trying to be better than who I was, even if it’s without you.'
  }
];

function App() {
  const [gameState, setGameState] = useState<GameState>('envelope');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleEnvelopeOpen = useCallback(() => {
    setShowFireworks(true);
    setGameState('fireworks');
    
    // Transition to cards after fireworks
    setTimeout(() => {
      setShowFireworks(false);
      setGameState('cards');
    }, 3000);
  }, []);

  const handleCardSelect = useCallback((card: CardData) => {
    setSelectedCard(card);
    setGameState('message');
  }, []);

  const handleReset = useCallback(() => {
    setSelectedCard(null);
    setGameState('cards');
  }, []);

  const handleRestart = useCallback(() => {
    setSelectedCard(null);
    setGameState('envelope');
  }, []);

  // Preload images
  useEffect(() => {
    const imagesToPreload = [
      '/images/card-back.png',
      '/images/card-rose.png',
      '/images/card-moon.png',
      '/images/card-heart.png',
      '/images/card-dove.png',
      '/images/card-ring.png',
      '/images/hand.png'
    ];
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-valentine-gradient relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Fireworks Effect */}
      {showFireworks && <FireworksEffect />}
      
      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center">
        {gameState === 'envelope' && (
          <EnvelopeSection onOpen={handleEnvelopeOpen} />
        )}
        
        {gameState === 'fireworks' && (
          <div className="text-center">
            <h1 className="font-display text-6xl md:text-8xl text-valentine-red animate-pulse">
              My Love Letter to You
            </h1>
          </div>
        )}
        
        {gameState === 'cards' && (
          <CardRevealSection onCardSelect={handleCardSelect} />
        )}
        
        {gameState === 'message' && selectedCard && (
          <MessageRevealSection 
            card={selectedCard} 
            onReset={handleReset}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}

export default App;
