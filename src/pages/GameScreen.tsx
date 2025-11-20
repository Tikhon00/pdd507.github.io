import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TrafficLightGame from "@/components/games/TrafficLightGame";
import BrakeGame from "@/components/games/BrakeGame";
import SignMatchGame from "@/components/games/SignMatchGame";

const GameScreen = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const gameTitles: Record<string, string> = {
    "traffic-signs": "Светофор-реакция",
    "crossroads": "Успей затормозить",
    "parking": "Знак → Действие",
    "final-test": "Финальный тест",
  };

  const handleVibrate = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const handleGameEnd = (score: number) => {
    setTimeout(() => {
      navigate("/results", { state: { score, gameId, gameTitle: gameTitles[gameId || ""] } });
    }, 500);
  };

  const renderGame = () => {
    switch (gameId) {
      case "traffic-signs":
        return <TrafficLightGame onGameEnd={handleGameEnd} />;
      case "crossroads":
        return <BrakeGame onGameEnd={handleGameEnd} />;
      case "parking":
        return <SignMatchGame onGameEnd={handleGameEnd} />;
      default:
        return (
          <div className="text-center text-muted-foreground">
            Игра пока в разработке
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={() => {
          handleVibrate();
          navigate("/games");
        }}
        variant="ghost"
        className="glass rounded-xl active:scale-95 min-h-[44px]"
      >
        <ArrowLeft className="mr-2" size={20} />
        Назад
      </Button>

      <div className="text-center space-y-2">
        <h1 className="font-bold bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent">
          {gameTitles[gameId || ""] || "Игра"}
        </h1>
      </div>

      {renderGame()}
    </div>
  );
};

export default GameScreen;
