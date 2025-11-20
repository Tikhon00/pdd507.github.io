import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 300);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-fade-in">
      <div className="text-center space-y-4 animate-scale-in">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow-green animate-pulse shadow-xl">
          <Sparkles className="text-white" size={48} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Drive Smart
        </h1>
      </div>
    </div>
  );
};

export default IntroAnimation;
