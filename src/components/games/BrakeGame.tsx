import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import { Car, AlertTriangle } from "lucide-react";

interface BrakeGameProps {
  onGameEnd: (score: number) => void;
}

const BrakeGame = ({ onGameEnd }: BrakeGameProps) => {
  const [carPosition, setCarPosition] = useState(0);
  const [obstacleAppeared, setObstacleAppeared] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [obstacleTime, setObstacleTime] = useState<number>(0);
  const maxRounds = 8;

  const nextRound = useCallback(() => {
    if (round >= maxRounds) {
      setGameActive(false);
      onGameEnd(score);
      return;
    }

    setObstacleAppeared(false);
    setCarPosition(0);
    setReactionTime(null);
    setRound((r) => r + 1);

    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      setObstacleAppeared(true);
      setObstacleTime(Date.now());
    }, delay);
  }, [round, score, onGameEnd]);

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setCarPosition((pos) => {
        if (pos >= 100) {
          if (obstacleAppeared && reactionTime === null) {
            // Слишком поздно
            nextRound();
            return 0;
          }
          return pos;
        }
        return pos + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameActive, obstacleAppeared, reactionTime, nextRound]);

  const handleBrake = () => {
    if (!gameActive || !obstacleAppeared || reactionTime !== null) return;

    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }

    const reaction = Date.now() - obstacleTime;
    setReactionTime(reaction);

    // Начисляем очки в зависимости от скорости реакции
    let points = 0;
    if (reaction < 300) points = 100;
    else if (reaction < 500) points = 75;
    else if (reaction < 700) points = 50;
    else if (reaction < 1000) points = 25;

    setScore((s) => s + points);

    setTimeout(() => {
      nextRound();
    }, 1500);
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setRound(1);
    nextRound();
  };

  if (!gameActive && round === 1) {
    return (
      <GlassCard glowColor="green" className="text-center space-y-6">
        <div className="w-32 h-32 mx-auto rounded-full glass-strong flex items-center justify-center neon-glow-green">
          <Car className="text-neon-green animate-glow" size={64} />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Успей затормозить</h2>
          <p className="text-sm text-muted-foreground">
            Машина едет вперёд. Когда появится препятствие — жми "Стоп"! Чем быстрее реакция — тем больше очков.
          </p>
        </div>
        <Button
          onClick={startGame}
          size="lg"
          className="w-full max-w-[280px] glass-strong rounded-2xl py-6 bg-gradient-to-r from-neon-green to-neon-cyan hover:opacity-90 neon-glow-green active:scale-95 min-h-[56px]"
        >
          Начать
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <GlassCard className="px-4 py-2">
          <span className="text-sm text-muted-foreground">Очки: </span>
          <span className="text-lg font-bold text-neon-green">{score}</span>
        </GlassCard>
        <GlassCard className="px-4 py-2">
          <span className="text-sm text-muted-foreground">Раунд: </span>
          <span className="text-lg font-bold text-neon-cyan">{round}/{maxRounds}</span>
        </GlassCard>
      </div>

      <GlassCard glowColor="green" className="space-y-4 py-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {!obstacleAppeared ? "Едем..." : reactionTime ? `Реакция: ${reactionTime}мс` : "Жми СТОП!"}
          </h3>
          {reactionTime !== null && (
            <p className="text-sm text-neon-green">
              {reactionTime < 300 ? "Отлично! 🎯" : 
               reactionTime < 500 ? "Хорошо! 👍" :
               reactionTime < 700 ? "Неплохо! ✓" : "Медленно... ⏱️"}
            </p>
          )}
        </div>

        <div className="relative h-32 glass-strong rounded-2xl overflow-hidden">
          {/* Дорога */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/50 to-transparent" />
          
          {/* Машина */}
          <div 
            className="absolute bottom-4 transition-all duration-100"
            style={{ left: `${carPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="glass-strong rounded-xl p-3 neon-glow-green">
              <Car className="text-neon-green" size={32} />
            </div>
          </div>

          {/* Препятствие */}
          {obstacleAppeared && (
            <div className="absolute right-8 bottom-4 animate-pulse">
              <div className={`glass-strong rounded-xl p-3 ${
                reactionTime === null ? "neon-glow-red" : "neon-glow-green"
              }`}>
                <AlertTriangle className={reactionTime === null ? "text-red-500" : "text-neon-green"} size={32} />
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      <Button
        onClick={handleBrake}
        disabled={!obstacleAppeared || reactionTime !== null}
        size="lg"
        className="w-full glass-strong rounded-2xl py-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 active:scale-95 min-h-[72px] disabled:opacity-50"
      >
        <span className="text-2xl font-bold text-red-500">СТОП</span>
      </Button>
    </div>
  );
};

export default BrakeGame;
