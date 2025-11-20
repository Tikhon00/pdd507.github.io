import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "green" | "yellow";
  onClick?: () => void;
}

const GlassCard = ({ children, className, glowColor, onClick }: GlassCardProps) => {
  const glowClass = glowColor ? `neon-glow-${glowColor}` : "";

  const handleClick = () => {
    if (onClick) {
      if ('vibrate' in navigator) {
        navigator.vibrate(20);
      }
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "glass rounded-2xl p-4 md:p-6 transition-all active:scale-95",
        glowClass,
        onClick && "cursor-pointer active:opacity-80",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
