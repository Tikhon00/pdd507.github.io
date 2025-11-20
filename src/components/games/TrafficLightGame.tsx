import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import { Circle } from "lucide-react";

interface TrafficLightGameProps {
  onGameEnd: (score: number) => void;
}

type LightColor = "red" | "yellow" | "green";

const TrafficLightGame = ({ onGameEnd }: TrafficLightGameProps) => {
  const [currentLight, setCurrentLight] = useState<LightColor>("red");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2000);
  const maxRounds = 10;

  const colors: LightColor[] = ["red", "yellow", "green"];
  const colorMap = {
    red: { bg: "bg-red-500/20", text: "text-red-500", neon: "neon-glow-red", label: "Стоп" },
    yellow: { bg: "bg-neon-yellow/20", text: "text-neon-yellow", neon: "neon-glow-yellow", label: "Жди" },
    green: { bg: "bg-neon-green/20", text: "text-neon-green", neon: "neon-glow-green", label: "Иди" },
  };

  const nextRound = useCallback(() => {
    if (round >= maxRounds) {
      setGameActive(false);
      onGameEnd(score);
      return;
    }

    setIsWaiting(true);
    const delay = Math.random() * 1000 + 500;
    
    setTimeout(() => {
      const newColor = colors[Math.floor(Math.random() * colors.length)];
      setCurrentLight(newColor);
      setIsWaiting(false);
      setTimeLeft(2000);
      setRound((r) => r + 1);
    }, delay);
  }, [round, score, onGameEnd]);

  useEffect(() => {
    if (gameActive && !isWaiting && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 100), 100);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && gameActive && !isWaiting) {
      nextRound();
    }
  }, [timeLeft, gameActive, isWaiting, nextRound]);

  const handleColorClick = (color: LightColor) => {
    if (!gameActive || isWaiting) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(color === currentLight ? 30 : 50);
    }

    if (color === currentLight) {
      setScore((s) => s + Math.floor(timeLeft / 100));
    }
    nextRound();
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setRound(1);
    nextRound();
  };

  if (!gameActive && round === 1) {
    return (
      <GlassCard glowColor="cyan" className="text-center space-y-6">
        <div className="w-32 h-32 mx-auto rounded-full glass-strong flex items-center justify-center neon-glow-cyan">
          <Circle className="text-neon-cyan animate-glow" size={64} />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Светофор-реакция</h2>
          <p className="text-sm text-muted-foreground">
            Нажимай кнопку с правильным цветом светофора. Чем быстрее — тем больше очков!
          </p>
        </div>
        <Button
          onClick={startGame}
          size="lg"
          className="w-full max-w-[280px] glass-strong rounded-2xl py-6 bg-gradient-to-r from-neon-cyan to-neon-green hover:opacity-90 neon-glow-cyan active:scale-95 min-h-[56px]"
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
          <span className="text-lg font-bold text-neon-cyan">{score}</span>
        </GlassCard>
        <GlassCard className="px-4 py-2">
          <span className="text-sm text-muted-foreground">Раунд: </span>
          <span className="text-lg font-bold text-neon-green">{round}/{maxRounds}</span>
        </GlassCard>
      </div>

      <GlassCard glowColor="cyan" className="text-center space-y-6 py-8">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {isWaiting ? "Приготовься..." : "Нажми правильный цвет!"}
          </h3>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-green transition-all duration-100"
              style={{ width: `${(timeLeft / 2000) * 100}%` }}
            />
          </div>
        </div>

        <div className="relative w-40 h-40 mx-auto">
          <div className="absolute inset-0 glass-strong rounded-3xl neon-glow-cyan animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`w-28 h-28 rounded-full transition-all duration-300 ${
                !isWaiting ? colorMap[currentLight].bg : "bg-muted"
              } ${!isWaiting ? colorMap[currentLight].neon : ""} animate-glow`}
            />
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-3 gap-3">
        {colors.map((color) => (
          <Button
            key={color}
            onClick={() => handleColorClick(color)}
            disabled={isWaiting}
            className={`glass-strong rounded-xl py-6 ${colorMap[color].bg} hover:opacity-90 border ${
              color === "red" ? "border-red-500/30" : 
              color === "yellow" ? "border-neon-yellow/30" : "border-neon-green/30"
            } active:scale-95 min-h-[60px] disabled:opacity-50`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${
                color === "red" ? "bg-red-500" : 
                color === "yellow" ? "bg-neon-yellow" : "bg-neon-green"
              }`} />
              <span className={`text-sm font-semibold ${colorMap[color].text}`}>
                {colorMap[color].label}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TrafficLightGame;
