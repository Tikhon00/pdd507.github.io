import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import { Circle, Triangle, Square, Minus, AlertCircle } from "lucide-react";

interface SignMatchGameProps {
  onGameEnd: (score: number) => void;
}

type Sign = {
  id: string;
  icon: typeof Circle;
  name: string;
  meaning: string;
};

const signs: Sign[] = [
  { id: "stop", icon: Circle, name: "Стоп", meaning: "Остановка обязательна" },
  { id: "yield", icon: Triangle, name: "Уступи дорогу", meaning: "Пропусти другие ТС" },
  { id: "parking", icon: Square, name: "Парковка", meaning: "Можно припарковаться" },
  { id: "noentry", icon: Minus, name: "Въезд запрещён", meaning: "Нельзя въезжать" },
];

const SignMatchGame = ({ onGameEnd }: SignMatchGameProps) => {
  const [gameActive, setGameActive] = useState(false);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedSign, setDraggedSign] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameActive(true);
    setMatches({});
    setShowResults(false);
    setScore(0);
  };

  const handleDragStart = useCallback((signId: string) => {
    setDraggedSign(signId);
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  const handleDrop = useCallback((meaningId: string) => {
    if (!draggedSign) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }

    setMatches((prev) => ({
      ...prev,
      [draggedSign]: meaningId,
    }));
    setDraggedSign(null);
  }, [draggedSign]);

  const handleTouchMatch = useCallback((signId: string, meaningId: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }

    setMatches((prev) => ({
      ...prev,
      [signId]: meaningId,
    }));
  }, []);

  const checkAnswers = () => {
    let correct = 0;
    signs.forEach((sign) => {
      if (matches[sign.id] === sign.id) {
        correct++;
      }
    });
    
    const finalScore = (correct / signs.length) * 100;
    setScore(finalScore);
    setShowResults(true);

    if ('vibrate' in navigator) {
      navigator.vibrate(correct === signs.length ? [50, 100, 50] : 30);
    }

    setTimeout(() => {
      onGameEnd(finalScore);
    }, 3000);
  };

  if (!gameActive) {
    return (
      <GlassCard glowColor="yellow" className="text-center space-y-6">
        <div className="w-32 h-32 mx-auto rounded-full glass-strong flex items-center justify-center neon-glow-yellow">
          <AlertCircle className="text-neon-yellow animate-glow" size={64} />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Знак → Действие</h2>
          <p className="text-sm text-muted-foreground">
            Сопоставь дорожные знаки с их значениями. Нажми на знак, затем на его значение.
          </p>
        </div>
        <Button
          onClick={startGame}
          size="lg"
          className="w-full max-w-[280px] glass-strong rounded-2xl py-6 bg-gradient-to-r from-neon-yellow to-neon-green hover:opacity-90 neon-glow-yellow active:scale-95 min-h-[56px]"
        >
          Начать
        </Button>
      </GlassCard>
    );
  }

  const allMatched = Object.keys(matches).length === signs.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground">
          {showResults ? `Результат: ${Math.round(score)}%` : "Сопоставь знаки"}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">Знаки</p>
          <div className="grid grid-cols-2 gap-3">
            {signs.map((sign) => {
              const Icon = sign.icon;
              const isMatched = !!matches[sign.id];
              const isCorrect = showResults && matches[sign.id] === sign.id;
              const isWrong = showResults && matches[sign.id] && matches[sign.id] !== sign.id;
              
              return (
                <div
                  key={sign.id}
                  draggable={!showResults}
                  onDragStart={() => handleDragStart(sign.id)}
                  onClick={() => !showResults && setDraggedSign(sign.id)}
                  className={`glass-strong rounded-xl p-4 text-center space-y-2 transition-all active:scale-95 ${
                    draggedSign === sign.id ? "ring-2 ring-neon-cyan scale-105" : ""
                  } ${isMatched && !showResults ? "opacity-60" : ""} ${
                    isCorrect ? "neon-glow-green border border-neon-green/50" : ""
                  } ${isWrong ? "border border-red-500/50" : ""} ${
                    !showResults ? "cursor-grab active:cursor-grabbing" : ""
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl ${
                    isCorrect ? "bg-neon-green/20" : 
                    isWrong ? "bg-red-500/20" : "bg-neon-cyan/20"
                  } flex items-center justify-center`}>
                    <Icon className={
                      isCorrect ? "text-neon-green" :
                      isWrong ? "text-red-500" : "text-neon-cyan"
                    } size={24} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{sign.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">Значения</p>
          <div className="space-y-2">
            {signs.map((sign) => {
              const isTarget = draggedSign && !matches[draggedSign];
              const hasMatch = Object.values(matches).includes(sign.id);
              
              return (
                <div
                  key={`meaning-${sign.id}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(sign.id)}
                  onClick={() => draggedSign && handleTouchMatch(draggedSign, sign.id)}
                  className={`glass-strong rounded-xl p-3 text-center transition-all ${
                    isTarget ? "ring-2 ring-neon-green cursor-pointer" : ""
                  } ${hasMatch && !showResults ? "opacity-60" : ""} ${
                    !showResults && draggedSign ? "cursor-pointer hover:bg-white/5" : ""
                  }`}
                >
                  <span className="text-sm text-foreground">{sign.meaning}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {allMatched && !showResults && (
        <Button
          onClick={checkAnswers}
          size="lg"
          className="w-full glass-strong rounded-2xl py-6 bg-gradient-to-r from-neon-yellow to-neon-green hover:opacity-90 neon-glow-yellow active:scale-95 min-h-[56px]"
        >
          Проверить ответы
        </Button>
      )}

      {showResults && (
        <GlassCard glowColor={score === 100 ? "green" : score >= 50 ? "yellow" : "cyan"} className="text-center">
          <p className="text-lg font-semibold">
            {score === 100 ? "Превосходно! 🎉" :
             score >= 75 ? "Отлично! 👍" :
             score >= 50 ? "Хорошо! ✓" : "Попробуй ещё раз! 💪"}
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default SignMatchGame;
