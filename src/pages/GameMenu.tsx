import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { Car, TrafficCone, MapPin, FileText, ChevronRight } from "lucide-react";

const games = [
  {
    id: "traffic-signs",
    title: "Светофор-реакция",
    description: "Нажми цвет светофора",
    icon: TrafficCone,
    color: "cyan" as const,
    difficulty: "Легко",
  },
  {
    id: "crossroads",
    title: "Успей затормозить",
    description: "Останови машину вовремя",
    icon: MapPin,
    color: "green" as const,
    difficulty: "Средне",
  },
  {
    id: "parking",
    title: "Знак → Действие",
    description: "Сопоставь знаки",
    icon: Car,
    color: "yellow" as const,
    difficulty: "Сложно",
  },
  {
    id: "quiz",
    title: "Викторина по ПДД",
    description: "10 вопросов про правила",
    icon: FileText,
    color: "cyan" as const,
    difficulty: "Тест",
  },
];

const GameMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-bold bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent">
          Выбери игру
        </h1>
        <p className="text-sm text-muted-foreground">
          Пройди все уровни
        </p>
      </div>

      <div className="grid gap-4">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <GlassCard
              key={game.id}
              glowColor={game.color}
              onClick={() => navigate(game.id === "quiz" ? "/quiz" : `/game/${game.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-neon-${game.color}/20 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`text-neon-${game.color}`} size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{game.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full glass text-muted-foreground whitespace-nowrap">
                      {game.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{game.description}</p>
                </div>
                <ChevronRight className="text-muted-foreground flex-shrink-0" size={20} />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default GameMenu;
