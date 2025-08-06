import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";

interface BirthdayCelebrationProps {
  isActive: boolean;
}

export function BirthdayCelebration({ isActive }: BirthdayCelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; emoji: string; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        emoji: ['🎉', '🎊', '✨', '🌟', '💖', '🎈', '🦋', '🌸'][Math.floor(Math.random() * 8)],
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2
      }));
      setConfetti(newConfetti);
    } else {
      setConfetti([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Special birthday background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5 animate-pulse" />
      
      {/* Floating confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute text-2xl animate-bounce opacity-80"
          style={{
            left: `${piece.left}%`,
            top: `-50px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s infinite`
          }}
        >
          {piece.emoji}
        </div>
      ))}

      {/* Floating hearts */}
      {[...Array(8)].map((_, i) => (
        <Heart
          key={`birthday-heart-${i}`}
          className="absolute text-pink-300/40 animate-bounce"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            fontSize: `${16 + Math.random() * 12}px`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}

      {/* Twinkling stars */}
      {[...Array(12)].map((_, i) => (
        <Star
          key={`birthday-star-${i}`}
          className="absolute text-yellow-300/50 animate-pulse"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            fontSize: `${12 + Math.random() * 8}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random()}s`
          }}
        />
      ))}

      {/* Birthday sparkles along edges */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-yellow-200/10 to-transparent animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-pink-200/10 to-transparent animate-pulse" />
      
      {/* Corner celebrations */}
      <div className="absolute top-4 left-4">
        <div className="text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎂</div>
      </div>
      <div className="absolute top-4 right-4">
        <div className="text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🎈</div>
      </div>
      <div className="absolute bottom-20 left-4">
        <div className="text-3xl animate-bounce" style={{ animationDelay: '1.5s' }}>🎁</div>
      </div>
      <div className="absolute bottom-20 right-4">
        <div className="text-3xl animate-bounce" style={{ animationDelay: '2s' }}>🌟</div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
