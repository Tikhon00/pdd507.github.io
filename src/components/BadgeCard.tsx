import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface BadgeCardProps {
  badge: string;
  icon?: React.ReactNode;
}

const BadgeCard = ({ badge, icon }: BadgeCardProps) => {
  return (
    <div className="glass rounded-xl p-3 flex items-center gap-3 neon-glow-yellow animate-scale-in">
      <div className="w-10 h-10 rounded-lg bg-neon-yellow/20 flex items-center justify-center flex-shrink-0">
        {icon || <Award className="text-neon-yellow" size={20} />}
      </div>
      <div className="flex-1">
        <Badge variant="outline" className="text-xs border-neon-yellow/50 text-neon-yellow">
          {badge}
        </Badge>
      </div>
    </div>
  );
};

export default BadgeCard;
