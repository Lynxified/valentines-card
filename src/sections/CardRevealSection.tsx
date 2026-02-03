import { useState, useEffect, useRef } from 'react';
import { cards, type CardData } from '../App';
import { Sparkles } from 'lucide-react';

interface CardRevealSectionProps {
  onCardSelect: (card: CardData) => void;
}

export function CardRevealSection({ onCardSelect }: CardRevealSectionProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [showHand, setShowHand] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  /* 🔁 Reset (fixes first-card bug) */
  const resetCards = () => {
    setHoveredCard(null);
    setSelectedCardId(null);
    setFlippedCard(null);
    setShowHand(false);
    setIsAnimating(false);
  };

  useEffect(() => {
    resetCards();
    setTimeout(() => sectionRef.current?.classList.add('loaded'), 100);
  }, []);

  const handleCardClick = (card: CardData) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSelectedCardId(card.id);

    setTimeout(() => setShowHand(true), 400);
    setTimeout(() => setFlippedCard(card.id), 1200);

    setTimeout(() => {
      onCardSelect(card);
      setIsAnimating(false);
    }, 2500);
  };

  /* 🃏 Dynamic arc — supports ANY number of cards */
  const getArcPosition = (index: number, total: number) => {
    const middle = (total - 1) / 2;
    const offset = index - middle;
    const isMobile = window.innerWidth < 640;

    return {
      rotateY: offset * (isMobile ? 8 : 12),
      translateX: offset * (isMobile ? 60 : 110),
      translateZ: -Math.abs(offset) * (isMobile ? 25 : 45)
    };
  };

  const getCardStyle = (index: number, cardId: number) => {
    const isHovered = hoveredCard === cardId;
    const isSelected = selectedCardId === cardId;
    const isOther = selectedCardId !== null && selectedCardId !== cardId;

    const pos = getArcPosition(index, cards.length);

    let transform = `
      rotateY(${pos.rotateY}deg)
      translateX(${pos.translateX}px)
      translateZ(${pos.translateZ}px)
    `;

    if (isHovered && !isSelected) {
      transform += ' translateZ(70px) scale(1.07)';
    }

    if (isSelected) {
      transform = 'rotateY(0deg) translateZ(180px) scale(1.25)';
    }

    if (isOther) {
      transform += ' translateZ(-200px) scale(0.8)';
    }

    return {
      transform,
      opacity: isOther ? 0.35 : 1,
      filter: isOther ? 'blur(2px)' : 'none',
      zIndex: isSelected ? 50 : isHovered ? 20 : 10,
      transition: 'all 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)'
    };
  };

  return (
    <div
      ref={sectionRef}
      className="flex flex-col items-center justify-center min-h-screen px-4 py-12"
    >
      {/* TITLE */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-6xl text-valentine-purple mb-3">
          Choose Your Destiny
        </h2>
        <p className="text-valentine-purple/70">
          Each card holds a message from my heart
        </p>
      </div>

      {/* CARD CONTAINER */}
      <div
        className="relative flex items-center justify-center w-full overflow-visible"
        style={{ perspective: '1000px', minHeight: '360px' }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="absolute cursor-pointer select-none"
            style={getCardStyle(index, card.id)}
            onMouseEnter={() => !isAnimating && setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(card)}
          >
            <div
              className={`tarot-card w-36 h-56 md:w-48 md:h-72 rounded-2xl shadow-xl ${
                flippedCard === card.id ? 'flipped' : ''
              }`}
            >
              {/* FRONT (card back design) */}
              <div className="card-face absolute inset-0 rounded-2xl overflow-hidden">
                <img
                  src="/images/card-back.png"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* BACK (revealed card) */}
              <div
                className="card-back absolute inset-0 rounded-2xl overflow-hidden"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <img
                  src={card.image}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* NAME LABEL */}
            <div
              className="absolute -bottom-9 left-1/2 -translate-x-1/2"
              style={{
                opacity: hoveredCard === card.id && !isAnimating ? 1 : 0,
                transition: 'opacity 0.25s ease'
              }}
            >
              <span className="bg-white/80 px-3 py-1 rounded-full text-valentine-purple">
                {card.name}
              </span>
            </div>
          </div>
        ))}

        {/* HAND */}
        {showHand && selectedCardId && (
          <div className="absolute z-40 pointer-events-none animate-hand-reach">
            <img src="/images/hand.png" className="w-40 md:w-56" />
          </div>
        )}
      </div>

      {/* FLIP STYLES */}
      <style>{`
        .tarot-card {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
        }

        .tarot-card.flipped {
          transform: rotateY(180deg);
        }

        .card-face,
        .card-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
